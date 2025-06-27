
interface FloodForecastData {
  date: string;
  location: string;
  latitude: number;
  longitude: number;
  discharge: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  station: string;
}

interface OpenMeteoFloodData {
  latitude: number;
  longitude: number;
  daily: {
    time: string[];
    river_discharge: number[];
  };
}

export const fetchFloodForecast = async (): Promise<FloodForecastData[]> => {
  try {
    // Fetch from Servir-HKH streamflow forecast
    const response = await fetch('https://servirhkh.yipl.net/static/data/streamflow_forecast.csv');
    const csvText = await response.text();
    
    // Parse CSV data
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const data: FloodForecastData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length >= 6) {
        const discharge = parseFloat(values[4]) || 0;
        const riskLevel = getRiskLevel(discharge);
        
        data.push({
          date: values[0] || new Date().toISOString(),
          location: values[1] || 'Unknown',
          latitude: parseFloat(values[2]) || 27.7,
          longitude: parseFloat(values[3]) || 85.3,
          discharge: discharge,
          riskLevel: riskLevel,
          station: values[5] || 'Station'
        });
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching flood forecast:', error);
    
    // Fallback to Open-Meteo API for river discharge data
    return await fetchOpenMeteoFloodData();
  }
};

export const fetchOpenMeteoFloodData = async (): Promise<FloodForecastData[]> => {
  try {
    const locations = [
      { lat: 27.7, lon: 85.3, name: 'Kathmandu Valley' },
      { lat: 28.2, lon: 83.9, name: 'Pokhara Valley' },
      { lat: 26.4, lon: 87.2, name: 'Biratnagar' }
    ];
    
    const floodData: FloodForecastData[] = [];
    
    for (const location of locations) {
      const response = await fetch(
        `https://api.open-meteo.com/v1/glofas?latitude=${location.lat}&longitude=${location.lon}&daily=river_discharge&forecast_days=7`
      );
      const data: OpenMeteoFloodData = await response.json();
      
      if (data.daily && data.daily.river_discharge) {
        data.daily.river_discharge.forEach((discharge, index) => {
          if (discharge > 0) {
            floodData.push({
              date: data.daily.time[index],
              location: location.name,
              latitude: location.lat,
              longitude: location.lon,
              discharge: discharge,
              riskLevel: getRiskLevel(discharge),
              station: `${location.name} Station`
            });
          }
        });
      }
    }
    
    return floodData;
  } catch (error) {
    console.error('Error fetching Open-Meteo flood data:', error);
    return [];
  }
};

const getRiskLevel = (discharge: number): 'low' | 'medium' | 'high' | 'critical' => {
  if (discharge < 100) return 'low';
  if (discharge < 500) return 'medium';
  if (discharge < 1000) return 'high';
  return 'critical';
};

export const getFloodColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'low': return '#22c55e'; // green
    case 'medium': return '#f59e0b'; // yellow
    case 'high': return '#f97316'; // orange
    case 'critical': return '#dc2626'; // red
    default: return '#6b7280'; // gray
  }
};

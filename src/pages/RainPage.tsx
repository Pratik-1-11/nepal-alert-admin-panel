import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CloudRain, CloudDrizzle, MapPin, Calendar, RefreshCw, Wind, Thermometer, Gauge, Cloud, Waves } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchFloodForecast, getFloodColor } from '@/services/floodService';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  name: string;
}

interface FloodData {
  date: string;
  location: string;
  latitude: number;
  longitude: number;
  discharge: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  station: string;
}

const RainPage = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [floodData, setFloodData] = useState<FloodData[]>([]);
  const [loading, setLoading] = useState(false);
  const [floodLoading, setFloodLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Kathmandu');
  const [showFloodData, setShowFloodData] = useState(false);
  const [weatherLayers, setWeatherLayers] = useState({
    precipitation: true,
    wind: false,
    temperature: false,
    pressure: false,
    clouds: false
  });
  const { toast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersRef = useRef<{[key: string]: L.TileLayer}>({});
  const floodMarkersRef = useRef<L.Marker[]>([]);

  const API_KEY = 'a3cf90bbeab7a32511d2371fd3578fe1';
  const nepalCities = [
    { name: 'Kathmandu', lat: 27.7172, lon: 85.3240 },
    { name: 'Pokhara', lat: 28.2096, lon: 83.9856 },
    { name: 'Lalitpur', lat: 27.6588, lon: 85.3247 },
    { name: 'Biratnagar', lat: 26.4525, lon: 87.2718 },
    { name: 'Birgunj', lat: 27.0104, lon: 84.8808 },
    { name: 'Dharan', lat: 26.8149, lon: 87.2824 }
  ];

  // Weather layer configurations with more intense blue for precipitation
  const weatherLayerConfigs = {
    precipitation: {
      url: `https://maps.openweathermap.org/maps/2.0/weather/PA0/{z}/{x}/{y}?appid=${API_KEY}`,
      name: 'Precipitation',
      icon: CloudRain,
      color: 'bg-blue-600',
      opacity: 0.8
    },
    wind: {
      url: `https://maps.openweathermap.org/maps/2.0/weather/WND/{z}/{x}/{y}?appid=${API_KEY}`,
      name: 'Wind Speed',
      icon: Wind,
      color: 'bg-green-500',
      opacity: 0.6
    },
    temperature: {
      url: `https://maps.openweathermap.org/maps/2.0/weather/TA2/{z}/{x}/{y}?appid=${API_KEY}`,
      name: 'Temperature',
      icon: Thermometer,
      color: 'bg-red-500',
      opacity: 0.6
    },
    pressure: {
      url: `https://maps.openweathermap.org/maps/2.0/weather/APM/{z}/{x}/{y}?appid=${API_KEY}`,
      name: 'Pressure',
      icon: Gauge,
      color: 'bg-purple-500',
      opacity: 0.6
    },
    clouds: {
      url: `https://maps.openweathermap.org/maps/2.0/weather/CL/{z}/{x}/{y}?appid=${API_KEY}`,
      name: 'Clouds',
      icon: Cloud,
      color: 'bg-gray-500',
      opacity: 0.6
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map centered on Nepal
    mapInstanceRef.current = L.map(mapRef.current).setView([28.3949, 84.1240], 7);

    // Add base tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current);

    // Initialize weather layers with updated opacity
    Object.entries(weatherLayerConfigs).forEach(([key, config]) => {
      layersRef.current[key] = L.tileLayer(config.url, {
        attribution: '© OpenWeatherMap',
        opacity: config.opacity
      });
    });

    // Add initial layers based on state
    Object.entries(weatherLayers).forEach(([key, enabled]) => {
      if (enabled && layersRef.current[key]) {
        layersRef.current[key].addTo(mapInstanceRef.current!);
      }
    });

    // Add markers for Nepal cities
    nepalCities.forEach(city => {
      const marker = L.marker([city.lat, city.lon]).addTo(mapInstanceRef.current!);
      marker.bindPopup(`<b>${city.name}</b><br>Click to view weather data`);
      marker.on('click', () => {
        setSelectedCity(city.name);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Toggle weather layers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    Object.entries(weatherLayers).forEach(([key, enabled]) => {
      const layer = layersRef.current[key];
      if (!layer) return;

      if (enabled) {
        if (!mapInstanceRef.current!.hasLayer(layer)) {
          layer.addTo(mapInstanceRef.current!);
        }
      } else {
        if (mapInstanceRef.current!.hasLayer(layer)) {
          mapInstanceRef.current!.removeLayer(layer);
        }
      }
    });
  }, [weatherLayers]);

  const toggleWeatherLayer = (layerKey: string) => {
    setWeatherLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey as keyof typeof prev]
    }));
  };

  const fetchWeatherData = async (cityName: string) => {
    setLoading(true);
    try {
      const city = nepalCities.find(c => c.name === cityName) || nepalCities[0];
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const data = await response.json();
      setWeatherData(data);
      
      // Center map on selected city
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([city.lat, city.lon], 10);
      }
      
      toast({
        title: "Weather Data Updated",
        description: `Successfully fetched precipitation data for ${cityName}`,
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(selectedCity);
  }, [selectedCity]);

  const getRainIntensity = (rainData?: { '1h'?: number; '3h'?: number }) => {
    if (!rainData) return 'No Rain';
    const rain1h = rainData['1h'] || 0;
    if (rain1h === 0) return 'No Rain';
    if (rain1h < 0.5) return 'Light Drizzle';
    if (rain1h < 2.5) return 'Light Rain';
    if (rain1h < 7.5) return 'Moderate Rain';
    if (rain1h < 35) return 'Heavy Rain';
    return 'Violent Rain';
  };

  const getRainColor = (rainData?: { '1h'?: number; '3h'?: number }) => {
    if (!rainData) return 'bg-gray-100 text-gray-800';
    const rain1h = rainData['1h'] || 0;
    if (rain1h === 0) return 'bg-gray-100 text-gray-800';
    if (rain1h < 0.5) return 'bg-blue-100 text-blue-800';
    if (rain1h < 2.5) return 'bg-blue-200 text-blue-900';
    if (rain1h < 7.5) return 'bg-blue-400 text-white';
    if (rain1h < 35) return 'bg-blue-600 text-white';
    return 'bg-blue-800 text-white';
  };

  const getRainIcon = (rainData?: { '1h'?: number; '3h'?: number }) => {
    if (!rainData || (rainData['1h'] || 0) === 0) return null;
    const rain1h = rainData['1h'] || 0;
    return rain1h < 2.5 ? CloudDrizzle : CloudRain;
  };

  const fetchFloodData = async () => {
    setFloodLoading(true);
    try {
      const data = await fetchFloodForecast();
      setFloodData(data);
      
      toast({
        title: "Flood Data Updated",
        description: `Fetched flood monitoring data for ${data.length} locations`,
      });
    } catch (error) {
      console.error('Error fetching flood data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch flood data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFloodLoading(false);
    }
  };

  // Update flood markers on map
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing flood markers
    floodMarkersRef.current.forEach(marker => {
      mapInstanceRef.current!.removeLayer(marker);
    });
    floodMarkersRef.current = [];

    if (showFloodData && floodData.length > 0) {
      floodData.forEach(flood => {
        const color = getFloodColor(flood.riskLevel);
        
        // Create custom flood marker
        const floodIcon = L.divIcon({
          className: 'custom-flood-marker',
          html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const marker = L.marker([flood.latitude, flood.longitude], { icon: floodIcon })
          .addTo(mapInstanceRef.current!);
        
        marker.bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold;">${flood.location}</h3>
            <p style="margin: 2px 0;"><strong>Risk Level:</strong> ${flood.riskLevel.toUpperCase()}</p>
            <p style="margin: 2px 0;"><strong>Discharge:</strong> ${flood.discharge.toFixed(2)} m³/s</p>
            <p style="margin: 2px 0;"><strong>Station:</strong> ${flood.station}</p>
            <p style="margin: 2px 0;"><strong>Date:</strong> ${new Date(flood.date).toLocaleDateString()}</p>
          </div>
        `);
        
        floodMarkersRef.current.push(marker);
      });
    }
  }, [showFloodData, floodData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nepal Weather & Flood Monitor</h1>
          <p className="text-gray-600">Real-time weather data with interactive weather layers and flood monitoring across Nepal</p>
        </div>

        {/* City Selection and Weather Layer Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location & Data Layers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* City Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Select City</h3>
              <div className="flex flex-wrap gap-2">
                {nepalCities.map((city) => (
                  <Button
                    key={city.name}
                    variant={selectedCity === city.name ? "default" : "outline"}
                    onClick={() => setSelectedCity(city.name)}
                    className="mb-2"
                  >
                    {city.name}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => fetchWeatherData(selectedCity)}
                  disabled={loading}
                  className="mb-2"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh Weather
                </Button>
              </div>
            </div>

            {/* Flood Data Controls */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Flood Monitoring</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={showFloodData ? "default" : "outline"}
                  onClick={() => {
                    setShowFloodData(!showFloodData);
                    if (!showFloodData && floodData.length === 0) {
                      fetchFloodData();
                    }
                  }}
                  className={showFloodData ? "bg-blue-600" : ""}
                >
                  <Waves className="h-4 w-4 mr-2" />
                  {showFloodData ? 'Hide' : 'Show'} Flood Data
                </Button>
                <Button
                  variant="outline"
                  onClick={fetchFloodData}
                  disabled={floodLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${floodLoading ? 'animate-spin' : ''}`} />
                  Refresh Flood Data
                </Button>
              </div>
              {showFloodData && (
                <div className="mt-3 text-xs text-gray-600">
                  <p><strong>Flood Risk Levels:</strong></p>
                  <div className="flex gap-4 mt-1">
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      Low (&lt;100 m³/s)
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      Medium (100-500 m³/s)
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      High (500-1000 m³/s)
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-600"></div>
                      Critical (&gt;1000 m³/s)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Weather Layer Controls */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Weather Layers</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.entries(weatherLayerConfigs).map(([key, config]) => {
                  const IconComponent = config.icon;
                  const isActive = weatherLayers[key as keyof typeof weatherLayers];
                  
                  return (
                    <Button
                      key={key}
                      variant={isActive ? "default" : "outline"}
                      onClick={() => toggleWeatherLayer(key)}
                      className={`flex items-center gap-2 ${isActive ? config.color : ''}`}
                      size="sm"
                    >
                      <IconComponent className="h-4 w-4" />
                      {config.name}
                    </Button>
                  );
                })}
              </div>
              <div className="mt-3 text-xs text-gray-500">
                <p><strong>Tip:</strong> Toggle multiple layers to compare different weather conditions</p>
                <p><strong>Precipitation:</strong> More intense blue shows heavier rainfall</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Map */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Interactive Weather & Flood Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              ref={mapRef} 
              className="w-full h-96 rounded-lg border"
              style={{ minHeight: '400px' }}
            />
            <div className="mt-4 text-sm text-gray-600 space-y-1">
              <p><strong>Weather Layers:</strong></p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-xs">
                <li>• <strong>Precipitation:</strong> Blue areas show rainfall intensity</li>
                <li>• <strong>Wind:</strong> Shows wind speed and direction patterns</li>
                <li>• <strong>Temperature:</strong> Color-coded temperature zones</li>
                <li>• <strong>Pressure:</strong> Atmospheric pressure variations</li>
                <li>• <strong>Clouds:</strong> Cloud coverage and density</li>
              </ul>
              <p><strong>Flood Monitoring:</strong> Colored circles show real-time flood risk levels at monitoring stations</p>
              <p className="pt-2"><strong>Controls:</strong> Click markers for detailed data • Pan and zoom to explore</p>
            </div>
          </CardContent>
        </Card>

        {/* Flood Summary */}
        {showFloodData && floodData.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="h-5 w-5" />
                Current Flood Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['low', 'medium', 'high', 'critical'].map(level => {
                  const count = floodData.filter(f => f.riskLevel === level).length;
                  const color = getFloodColor(level);
                  
                  return (
                    <div key={level} className="text-center">
                      <div 
                        className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: color }}
                      >
                        {count}
                      </div>
                      <p className="text-sm font-medium capitalize">{level} Risk</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-xs text-gray-500 text-center">
                Total monitoring stations: {floodData.length} • Data from Servir-HKH and Open-Meteo
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Weather Data */}
        {weatherData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Main Weather Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{weatherData.name}</span>
                  {getRainIcon(weatherData.rain) && (
                    <div className="flex items-center gap-1">
                      {getRainIcon(weatherData.rain) === CloudDrizzle ? (
                        <CloudDrizzle className="h-5 w-5 text-blue-500" />
                      ) : (
                        <CloudRain className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Temperature</span>
                    <span className="text-lg font-bold">{Math.round(weatherData.main.temp)}°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Weather</span>
                    <span className="capitalize">{weatherData.weather[0].description}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Humidity</span>
                    <span>{weatherData.main.humidity}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pressure</span>
                    <span>{weatherData.main.pressure} hPa</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Precipitation Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudRain className="h-5 w-5" />
                  Precipitation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <Badge className={getRainColor(weatherData.rain)} variant="secondary">
                      {getRainIntensity(weatherData.rain)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Last 1 hour</span>
                      <span className="font-bold">
                        {weatherData.rain?.['1h'] ? `${weatherData.rain['1h']} mm` : '0 mm'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Last 3 hours</span>
                      <span className="font-bold">
                        {weatherData.rain?.['3h'] ? `${weatherData.rain['3h']} mm` : '0 mm'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wind & Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="h-5 w-5" />
                  Wind & More
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Wind Speed</span>
                    <span>{weatherData.wind.speed} m/s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Wind Direction</span>
                    <span>{weatherData.wind.deg}°</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Cloud Cover</span>
                    <span>{weatherData.clouds.all}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Coordinates</span>
                    <span className="text-xs">
                      {weatherData.coord.lat.toFixed(2)}, {weatherData.coord.lon.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Timestamp */}
        {weatherData && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Weather updated: {new Date(weatherData.dt * 1000).toLocaleString()}</span>
                {floodData.length > 0 && (
                  <>
                    <span className="mx-2">•</span>
                    <span>Flood data: {floodData.length} stations monitored</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RainPage;


export interface EarthquakeData {
  id: string;
  magnitude: number;
  place: string;
  time: number;
  latitude: number;
  longitude: number;
  depth: number;
  url: string;
}

export const fetchNepalEarthquakes = async (): Promise<EarthquakeData[]> => {
  try {
    // USGS API for earthquakes in Nepal region (lat: 26-31, lng: 80-89)
    const response = await fetch(
      'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2024-01-01&minlatitude=26&maxlatitude=31&minlongitude=80&maxlongitude=89&minmagnitude=2.5&orderby=time'
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch earthquake data');
    }
    
    const data = await response.json();
    
    return data.features.map((feature: any) => ({
      id: feature.id,
      magnitude: feature.properties.mag,
      place: feature.properties.place,
      time: feature.properties.time,
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
      depth: feature.geometry.coordinates[2],
      url: feature.properties.url,
    }));
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    return [];
  }
};

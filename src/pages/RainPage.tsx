
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CloudRain, CloudDrizzle, MapPin, Calendar, RefreshCw, Map } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

const RainPage = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Kathmandu');
  const [showPrecipitation, setShowPrecipitation] = useState(true);
  const { toast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const precipitationLayerRef = useRef<L.TileLayer | null>(null);

  const API_KEY = 'a3cf90bbeab7a32511d2371fd3578fe1';
  const nepalCities = [
    { name: 'Kathmandu', lat: 27.7172, lon: 85.3240 },
    { name: 'Pokhara', lat: 28.2096, lon: 83.9856 },
    { name: 'Lalitpur', lat: 27.6588, lon: 85.3247 },
    { name: 'Biratnagar', lat: 26.4525, lon: 87.2718 },
    { name: 'Birgunj', lat: 27.0104, lon: 84.8808 },
    { name: 'Dharan', lat: 26.8149, lon: 87.2824 }
  ];

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map centered on Nepal
    mapInstanceRef.current = L.map(mapRef.current).setView([28.3949, 84.1240], 7);

    // Add base tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current);

    // Add precipitation layer
    precipitationLayerRef.current = L.tileLayer(
      `https://maps.openweathermap.org/maps/2.0/weather/PA0/{z}/{x}/{y}?appid=${API_KEY}`,
      {
        attribution: '© OpenWeatherMap',
        opacity: 0.6
      }
    );

    if (showPrecipitation) {
      precipitationLayerRef.current.addTo(mapInstanceRef.current);
    }

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

  // Toggle precipitation layer
  useEffect(() => {
    if (!mapInstanceRef.current || !precipitationLayerRef.current) return;

    if (showPrecipitation) {
      precipitationLayerRef.current.addTo(mapInstanceRef.current);
    } else {
      mapInstanceRef.current.removeLayer(precipitationLayerRef.current);
    }
  }, [showPrecipitation]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nepal Precipitation Monitor</h1>
          <p className="text-gray-600">Real-time rainfall and weather data across Nepal with interactive map</p>
        </div>

        {/* City Selection and Map Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Select Location & Map Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
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
                Refresh
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant={showPrecipitation ? "default" : "outline"}
                onClick={() => setShowPrecipitation(!showPrecipitation)}
                className="flex items-center gap-2"
              >
                <Map className="h-4 w-4" />
                {showPrecipitation ? 'Hide' : 'Show'} Precipitation Layer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Map */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Interactive Precipitation Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              ref={mapRef} 
              className="w-full h-96 rounded-lg border"
              style={{ minHeight: '400px' }}
            />
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Blue areas:</strong> Precipitation zones (darker = heavier rain)</p>
              <p><strong>Markers:</strong> Click on city markers to view detailed weather data</p>
              <p><strong>Controls:</strong> Use mouse/touch to pan and zoom the map</p>
            </div>
          </CardContent>
        </Card>

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

            {/* Additional Weather Info */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Info</CardTitle>
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
                <span>Last updated: {new Date(weatherData.dt * 1000).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RainPage;

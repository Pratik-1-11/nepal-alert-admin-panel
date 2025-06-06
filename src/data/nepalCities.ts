
export interface City {
  name: string;
  latitude: number;
  longitude: number;
  type: 'provincial_capital' | 'major_city';
  province?: string;
}

export const nepalCities: City[] = [
  // Provincial Capitals
  { name: 'Kathmandu', latitude: 27.7172, longitude: 85.3240, type: 'provincial_capital', province: 'Bagmati' },
  { name: 'Pokhara', latitude: 28.2096, longitude: 83.9856, type: 'provincial_capital', province: 'Gandaki' },
  { name: 'Biratnagar', latitude: 26.4525, longitude: 87.2718, type: 'provincial_capital', province: 'Koshi' },
  { name: 'Janakpur', latitude: 26.7288, longitude: 85.9256, type: 'provincial_capital', province: 'Madhesh' },
  { name: 'Butwal', latitude: 27.7000, longitude: 83.4486, type: 'provincial_capital', province: 'Lumbini' },
  { name: 'Nepalgunj', latitude: 28.0500, longitude: 81.6167, type: 'provincial_capital', province: 'Karnali' },
  { name: 'Dhangadhi', latitude: 28.6833, longitude: 80.6000, type: 'provincial_capital', province: 'Sudurpashchim' },
  
  // Major Cities
  { name: 'Lalitpur', latitude: 27.6588, longitude: 85.3247, type: 'major_city' },
  { name: 'Bhaktapur', latitude: 27.6710, longitude: 85.4298, type: 'major_city' },
  { name: 'Chitwan (Bharatpur)', latitude: 27.6747, longitude: 84.4339, type: 'major_city' },
  { name: 'Hetauda', latitude: 27.4280, longitude: 85.0323, type: 'major_city' },
  { name: 'Damak', latitude: 26.6586, longitude: 87.7006, type: 'major_city' },
  { name: 'Dharan', latitude: 26.8147, longitude: 87.2789, type: 'major_city' },
  { name: 'Itahari', latitude: 26.6518, longitude: 87.2847, type: 'major_city' },
  { name: 'Ghorahi', latitude: 28.0333, longitude: 82.5167, type: 'major_city' },
  { name: 'Tulsipur', latitude: 28.1333, longitude: 82.3000, type: 'major_city' },
  { name: 'Siddharthanagar', latitude: 27.5031, longitude: 83.4614, type: 'major_city' },
];

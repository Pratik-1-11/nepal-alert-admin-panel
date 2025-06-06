
export interface Location {
  name: string;
  latitude: number;
  longitude: number;
  type: 'provincial_capital' | 'major_city' | 'district_headquarters' | 'municipality' | 'rural_municipality';
  district?: string;
  province?: string;
}

export const nepalLocations: Location[] = [
  // Provincial Capitals
  { name: 'Kathmandu', latitude: 27.7172, longitude: 85.3240, type: 'provincial_capital', district: 'Kathmandu', province: 'Bagmati' },
  { name: 'Pokhara', latitude: 28.2096, longitude: 83.9856, type: 'provincial_capital', district: 'Kaski', province: 'Gandaki' },
  { name: 'Biratnagar', latitude: 26.4525, longitude: 87.2718, type: 'provincial_capital', district: 'Morang', province: 'Koshi' },
  { name: 'Janakpur', latitude: 26.7288, longitude: 85.9256, type: 'provincial_capital', district: 'Dhanusha', province: 'Madhesh' },
  { name: 'Butwal', latitude: 27.7000, longitude: 83.4486, type: 'provincial_capital', district: 'Rupandehi', province: 'Lumbini' },
  { name: 'Birendranagar', latitude: 28.2096, longitude: 81.6167, type: 'provincial_capital', district: 'Surkhet', province: 'Karnali' },
  { name: 'Dhangadhi', latitude: 28.6833, longitude: 80.6000, type: 'provincial_capital', district: 'Kailali', province: 'Sudurpashchim' },
  
  // Major Cities
  { name: 'Lalitpur', latitude: 27.6588, longitude: 85.3247, type: 'major_city', district: 'Lalitpur', province: 'Bagmati' },
  { name: 'Bhaktapur', latitude: 27.6710, longitude: 85.4298, type: 'major_city', district: 'Bhaktapur', province: 'Bagmati' },
  { name: 'Bharatpur', latitude: 27.6747, longitude: 84.4339, type: 'major_city', district: 'Chitwan', province: 'Bagmati' },
  { name: 'Hetauda', latitude: 27.4280, longitude: 85.0323, type: 'major_city', district: 'Makwanpur', province: 'Bagmati' },
  { name: 'Dharan', latitude: 26.8147, longitude: 87.2789, type: 'major_city', district: 'Sunsari', province: 'Koshi' },
  { name: 'Itahari', latitude: 26.6518, longitude: 87.2847, type: 'major_city', district: 'Sunsari', province: 'Koshi' },
  { name: 'Damak', latitude: 26.6586, longitude: 87.7006, type: 'major_city', district: 'Jhapa', province: 'Koshi' },
  { name: 'Birtamod', latitude: 26.6667, longitude: 88.0833, type: 'major_city', district: 'Jhapa', province: 'Koshi' },
  { name: 'Siddharthanagar', latitude: 27.5031, longitude: 83.4614, type: 'major_city', district: 'Rupandehi', province: 'Lumbini' },
  { name: 'Ghorahi', latitude: 28.0333, longitude: 82.5167, type: 'major_city', district: 'Dang', province: 'Lumbini' },
  { name: 'Tulsipur', latitude: 28.1333, longitude: 82.3000, type: 'major_city', district: 'Dang', province: 'Lumbini' },
  { name: 'Nepalgunj', latitude: 28.0500, longitude: 81.6167, type: 'major_city', district: 'Banke', province: 'Lumbini' },
  
  // District Headquarters
  { name: 'Taplejung', latitude: 27.3500, longitude: 87.6667, type: 'district_headquarters', district: 'Taplejung', province: 'Koshi' },
  { name: 'Phidim', latitude: 27.1500, longitude: 87.7500, type: 'district_headquarters', district: 'Panchthar', province: 'Koshi' },
  { name: 'Ilam', latitude: 26.9083, longitude: 87.9250, type: 'district_headquarters', district: 'Ilam', province: 'Koshi' },
  { name: 'Chainpur', latitude: 27.2667, longitude: 87.3333, type: 'district_headquarters', district: 'Sankhuwasabha', province: 'Koshi' },
  { name: 'Khandbari', latitude: 27.3833, longitude: 87.2000, type: 'district_headquarters', district: 'Sankhuwasabha', province: 'Koshi' },
  { name: 'Bhojpur', latitude: 27.1667, longitude: 87.0500, type: 'district_headquarters', district: 'Bhojpur', province: 'Koshi' },
  { name: 'Solukhumbu', latitude: 27.7000, longitude: 86.7167, type: 'district_headquarters', district: 'Solukhumbu', province: 'Koshi' },
  { name: 'Okhaldhunga', latitude: 27.3167, longitude: 86.5000, type: 'district_headquarters', district: 'Okhaldhunga', province: 'Koshi' },
  { name: 'Khotang', latitude: 27.0333, longitude: 86.8333, type: 'district_headquarters', district: 'Khotang', province: 'Koshi' },
  { name: 'Udayapur', latitude: 26.8500, longitude: 86.5500, type: 'district_headquarters', district: 'Udayapur', province: 'Koshi' },
  
  // Madhesh Province
  { name: 'Saptari', latitude: 26.6000, longitude: 86.9000, type: 'district_headquarters', district: 'Saptari', province: 'Madhesh' },
  { name: 'Siraha', latitude: 26.6500, longitude: 86.2000, type: 'district_headquarters', district: 'Siraha', province: 'Madhesh' },
  { name: 'Mahottari', latitude: 26.8500, longitude: 85.7500, type: 'district_headquarters', district: 'Mahottari', province: 'Madhesh' },
  { name: 'Sarlahi', latitude: 27.0000, longitude: 85.5500, type: 'district_headquarters', district: 'Sarlahi', province: 'Madhesh' },
  { name: 'Rautahat', latitude: 27.0667, longitude: 85.3833, type: 'district_headquarters', district: 'Rautahat', province: 'Madhesh' },
  { name: 'Bara', latitude: 27.1333, longitude: 84.9167, type: 'district_headquarters', district: 'Bara', province: 'Madhesh' },
  { name: 'Parsa', latitude: 27.0500, longitude: 84.7333, type: 'district_headquarters', district: 'Parsa', province: 'Madhesh' },
  
  // Bagmati Province
  { name: 'Sindhuli', latitude: 27.2500, longitude: 85.9667, type: 'district_headquarters', district: 'Sindhuli', province: 'Bagmati' },
  { name: 'Ramechhap', latitude: 27.3333, longitude: 86.0833, type: 'district_headquarters', district: 'Ramechhap', province: 'Bagmati' },
  { name: 'Dolakha', latitude: 27.6700, longitude: 86.1667, type: 'district_headquarters', district: 'Dolakha', province: 'Bagmati' },
  { name: 'Sindhupalchok', latitude: 27.9500, longitude: 85.6833, type: 'district_headquarters', district: 'Sindhupalchok', province: 'Bagmati' },
  { name: 'Kavrepalanchok', latitude: 27.6167, longitude: 85.5667, type: 'district_headquarters', district: 'Kavrepalanchok', province: 'Bagmati' },
  { name: 'Nuwakot', latitude: 27.9167, longitude: 85.1667, type: 'district_headquarters', district: 'Nuwakot', province: 'Bagmati' },
  { name: 'Rasuwa', latitude: 28.1167, longitude: 85.3167, type: 'district_headquarters', district: 'Rasuwa', province: 'Bagmati' },
  { name: 'Dhading', latitude: 27.8667, longitude: 84.9000, type: 'district_headquarters', district: 'Dhading', province: 'Bagmati' },
  
  // Gandaki Province
  { name: 'Gorkha', latitude: 28.0000, longitude: 84.6333, type: 'district_headquarters', district: 'Gorkha', province: 'Gandaki' },
  { name: 'Lamjung', latitude: 28.2333, longitude: 84.3833, type: 'district_headquarters', district: 'Lamjung', province: 'Gandaki' },
  { name: 'Tanahu', latitude: 27.9167, longitude: 84.2500, type: 'district_headquarters', district: 'Tanahu', province: 'Gandaki' },
  { name: 'Syangja', latitude: 28.0833, longitude: 83.8833, type: 'district_headquarters', district: 'Syangja', province: 'Gandaki' },
  { name: 'Parbat', latitude: 28.2333, longitude: 83.6833, type: 'district_headquarters', district: 'Parbat', province: 'Gandaki' },
  { name: 'Baglung', latitude: 28.2667, longitude: 83.5833, type: 'district_headquarters', district: 'Baglung', province: 'Gandaki' },
  { name: 'Myagdi', latitude: 28.6000, longitude: 83.5667, type: 'district_headquarters', district: 'Myagdi', province: 'Gandaki' },
  { name: 'Mustang', latitude: 28.9833, longitude: 83.8833, type: 'district_headquarters', district: 'Mustang', province: 'Gandaki' },
  { name: 'Manang', latitude: 28.6667, longitude: 84.0167, type: 'district_headquarters', district: 'Manang', province: 'Gandaki' },
  
  // Lumbini Province
  { name: 'Nawalparasi', latitude: 27.6333, longitude: 83.7500, type: 'district_headquarters', district: 'Nawalparasi', province: 'Lumbini' },
  { name: 'Palpa', latitude: 27.8667, longitude: 83.5500, type: 'district_headquarters', district: 'Palpa', province: 'Lumbini' },
  { name: 'Gulmi', latitude: 28.0833, longitude: 83.2167, type: 'district_headquarters', district: 'Gulmi', province: 'Lumbini' },
  { name: 'Arghakhanchi', latitude: 27.9500, longitude: 83.1167, type: 'district_headquarters', district: 'Arghakhanchi', province: 'Lumbini' },
  { name: 'Kapilvastu', latitude: 27.5500, longitude: 83.0500, type: 'district_headquarters', district: 'Kapilvastu', province: 'Lumbini' },
  { name: 'Pyuthan', latitude: 28.1000, longitude: 82.8167, type: 'district_headquarters', district: 'Pyuthan', province: 'Lumbini' },
  { name: 'Rolpa', latitude: 28.0167, longitude: 82.6167, type: 'district_headquarters', district: 'Rolpa', province: 'Lumbini' },
  { name: 'Rukum', latitude: 28.2167, longitude: 82.5167, type: 'district_headquarters', district: 'Rukum', province: 'Lumbini' },
  { name: 'Bardiya', latitude: 28.3333, longitude: 81.5167, type: 'district_headquarters', district: 'Bardiya', province: 'Lumbini' },
  
  // Karnali Province
  { name: 'Salyan', latitude: 28.3833, longitude: 82.1667, type: 'district_headquarters', district: 'Salyan', province: 'Karnali' },
  { name: 'Dolpa', latitude: 28.9833, longitude: 82.8167, type: 'district_headquarters', district: 'Dolpa', province: 'Karnali' },
  { name: 'Humla', latitude: 30.1167, longitude: 81.7833, type: 'district_headquarters', district: 'Humla', province: 'Karnali' },
  { name: 'Jumla', latitude: 29.2833, longitude: 82.1833, type: 'district_headquarters', district: 'Jumla', province: 'Karnali' },
  { name: 'Kalikot', latitude: 29.1000, longitude: 81.7833, type: 'district_headquarters', district: 'Kalikot', province: 'Karnali' },
  { name: 'Mugu', latitude: 29.6833, longitude: 82.1167, type: 'district_headquarters', district: 'Mugu', province: 'Karnali' },
  { name: 'Dailekh', latitude: 28.8500, longitude: 81.7167, type: 'district_headquarters', district: 'Dailekh', province: 'Karnali' },
  { name: 'Jajarkot', latitude: 28.7000, longitude: 82.1833, type: 'district_headquarters', district: 'Jajarkot', province: 'Karnali' },
  
  // Sudurpashchim Province
  { name: 'Bajura', latitude: 29.5000, longitude: 81.1833, type: 'district_headquarters', district: 'Bajura', province: 'Sudurpashchim' },
  { name: 'Bajhang', latitude: 29.5333, longitude: 81.2000, type: 'district_headquarters', district: 'Bajhang', province: 'Sudurpashchim' },
  { name: 'Achham', latitude: 29.1167, longitude: 81.2167, type: 'district_headquarters', district: 'Achham', province: 'Sudurpashchim' },
  { name: 'Doti', latitude: 29.2667, longitude: 80.9833, type: 'district_headquarters', district: 'Doti', province: 'Sudurpashchim' },
  { name: 'Kanchanpur', latitude: 28.8333, longitude: 80.1833, type: 'district_headquarters', district: 'Kanchanpur', province: 'Sudurpashchim' },
  { name: 'Dadeldhura', latitude: 29.3000, longitude: 80.5833, type: 'district_headquarters', district: 'Dadeldhura', province: 'Sudurpashchim' },
  { name: 'Baitadi', latitude: 29.5333, longitude: 80.4667, type: 'district_headquarters', district: 'Baitadi', province: 'Sudurpashchim' },
  { name: 'Darchula', latitude: 29.8500, longitude: 80.5500, type: 'district_headquarters', district: 'Darchula', province: 'Sudurpashchim' },
  
  // Popular Tourist and Mountain Areas
  { name: 'Lukla', latitude: 27.6869, longitude: 86.7294, type: 'municipality', district: 'Solukhumbu', province: 'Koshi' },
  { name: 'Namche Bazaar', latitude: 27.8056, longitude: 86.7139, type: 'municipality', district: 'Solukhumbu', province: 'Koshi' },
  { name: 'Everest Base Camp', latitude: 28.0026, longitude: 86.8528, type: 'municipality', district: 'Solukhumbu', province: 'Koshi' },
  { name: 'Annapurna Base Camp', latitude: 28.5314, longitude: 83.8703, type: 'municipality', district: 'Kaski', province: 'Gandaki' },
  { name: 'Muktinath', latitude: 28.8167, longitude: 83.8667, type: 'municipality', district: 'Mustang', province: 'Gandaki' },
  { name: 'Lumbini', latitude: 27.4833, longitude: 83.2750, type: 'municipality', district: 'Rupandehi', province: 'Lumbini' },
  { name: 'Chitlang', latitude: 27.5833, longitude: 85.0833, type: 'municipality', district: 'Makwanpur', province: 'Bagmati' },
  { name: 'Bandipur', latitude: 27.9333, longitude: 84.4167, type: 'municipality', district: 'Tanahu', province: 'Gandaki' },
  { name: 'Ghandruk', latitude: 28.3667, longitude: 83.8000, type: 'municipality', district: 'Kaski', province: 'Gandaki' },
  { name: 'Langtang', latitude: 28.2167, longitude: 85.5167, type: 'municipality', district: 'Rasuwa', province: 'Bagmati' },
];


export interface Notification {
  id?: string;
  message: string;
  region: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Draft' | 'Published' | 'Archived';
  timestamp: Date;
  title: string;
}

export interface DisasterUpdate {
  id?: string;
  description: string;
  title: string;
  timestamp: Date;
}

export interface DisasterLocation {
  id?: string;
  affectedRadius: number;
  depth: number;
  description: string;
  latitude: number;
  longitude: number;
  magnitude: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  sourceId: string;
  status: 'active' | 'inactive' | 'resolved';
  timestamp: Date;
  title: string;
  type: 'earthquake' | 'flood' | 'landslide' | 'fire' | 'storm';
}

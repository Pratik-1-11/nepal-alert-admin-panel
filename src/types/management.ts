
export interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'operator' | 'viewer';
  region: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  createdAt: Date;
}

export interface NewsArticle {
  id?: string;
  title: string;
  content: string;
  author: string;
  category: 'disaster' | 'preparedness' | 'recovery' | 'general';
  status: 'draft' | 'published' | 'archived';
  priority: 'low' | 'medium' | 'high';
  region: string;
  publishedAt?: Date;
  createdAt: Date;
  imageUrl?: string;
}

export interface EmergencyContact {
  id?: string;
  name: string;
  organization: string;
  position: string;
  phone: string;
  email: string;
  alternatePhone?: string;
  region: string;
  category: 'medical' | 'fire' | 'police' | 'rescue' | 'government' | 'ngo';
  availability: '24/7' | 'business_hours' | 'emergency_only';
  isActive: boolean;
  priority: number;
  createdAt: Date;
}

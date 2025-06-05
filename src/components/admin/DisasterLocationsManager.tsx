
import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DisasterLocation } from '@/types/disaster';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, MapPin, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DisasterLocationsManager = () => {
  const [locations, setLocations] = useState<DisasterLocation[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<DisasterLocation | null>(null);
  const [formData, setFormData] = useState<Partial<DisasterLocation>>({
    title: '',
    description: '',
    latitude: 0,
    longitude: 0,
    magnitude: 0,
    depth: 0,
    affectedRadius: 0,
    severity: 'medium',
    status: 'active',
    type: 'earthquake',
    source: '',
    sourceId: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'disaster_locations'));
      const locationsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as DisasterLocation[];
      setLocations(locationsList.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch disaster locations',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.source) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const locationData = {
        ...formData,
        timestamp: Timestamp.now(),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        magnitude: Number(formData.magnitude),
        depth: Number(formData.depth),
        affectedRadius: Number(formData.affectedRadius),
      };

      if (editingLocation) {
        await updateDoc(doc(db, 'disaster_locations', editingLocation.id!), locationData);
        toast({
          title: 'Success',
          description: 'Disaster location updated successfully',
        });
      } else {
        await addDoc(collection(db, 'disaster_locations'), locationData);
        toast({
          title: 'Success',
          description: 'Disaster location created successfully',
        });
      }

      setIsDialogOpen(false);
      setEditingLocation(null);
      setFormData({
        title: '', description: '', latitude: 0, longitude: 0, magnitude: 0,
        depth: 0, affectedRadius: 0, severity: 'medium', status: 'active',
        type: 'earthquake', source: '', sourceId: '',
      });
      fetchLocations();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save disaster location',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (location: DisasterLocation) => {
    setEditingLocation(location);
    setFormData(location);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'disaster_locations', id));
      toast({
        title: 'Success',
        description: 'Disaster location deleted successfully',
      });
      fetchLocations();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete disaster location',
        variant: 'destructive',
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Disaster Locations Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLocation ? 'Edit Disaster Location' : 'Add New Disaster Location'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter disaster title"
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter detailed description"
                  />
                </div>
                
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                    placeholder="e.g., 27.7172"
                  />
                </div>
                
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                    placeholder="e.g., 85.3240"
                  />
                </div>
                
                <div>
                  <Label htmlFor="magnitude">Magnitude</Label>
                  <Input
                    id="magnitude"
                    type="number"
                    step="0.1"
                    value={formData.magnitude}
                    onChange={(e) => setFormData({ ...formData, magnitude: parseFloat(e.target.value) })}
                    placeholder="e.g., 4.5"
                  />
                </div>
                
                <div>
                  <Label htmlFor="depth">Depth (km)</Label>
                  <Input
                    id="depth"
                    type="number"
                    value={formData.depth}
                    onChange={(e) => setFormData({ ...formData, depth: parseInt(e.target.value) })}
                    placeholder="e.g., 10"
                  />
                </div>
                
                <div>
                  <Label htmlFor="affectedRadius">Affected Radius (km)</Label>
                  <Input
                    id="affectedRadius"
                    type="number"
                    value={formData.affectedRadius}
                    onChange={(e) => setFormData({ ...formData, affectedRadius: parseInt(e.target.value) })}
                    placeholder="e.g., 50"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Disaster Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="earthquake">Earthquake</SelectItem>
                      <SelectItem value="flood">Flood</SelectItem>
                      <SelectItem value="landslide">Landslide</SelectItem>
                      <SelectItem value="fire">Fire</SelectItem>
                      <SelectItem value="storm">Storm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="severity">Severity</Label>
                  <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="source">Source *</Label>
                  <Input
                    id="source"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    placeholder="e.g., USGS, NSC"
                  />
                </div>
                
                <div>
                  <Label htmlFor="sourceId">Source ID</Label>
                  <Input
                    id="sourceId"
                    value={formData.sourceId}
                    onChange={(e) => setFormData({ ...formData, sourceId: e.target.value })}
                    placeholder="e.g., us7000pvip"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingLocation ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {locations.map((location) => (
          <Card key={location.id} className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{location.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{location.type}</Badge>
                    <Badge className={getSeverityColor(location.severity)}>
                      {location.severity}
                    </Badge>
                    <Badge className={getStatusColor(location.status)}>
                      {location.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(location)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(location.id!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-3">{location.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  <span>Mag: {location.magnitude}</span>
                </div>
                <div>
                  <span>Depth: {location.depth} km</span>
                </div>
                <div>
                  <span>Radius: {location.affectedRadius} km</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-500">
                  {location.timestamp.toLocaleString()} • {location.source}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DisasterLocationsManager;

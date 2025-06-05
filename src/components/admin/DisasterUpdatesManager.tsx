
import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DisasterUpdate } from '@/types/disaster';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DisasterUpdatesManager = () => {
  const [updates, setUpdates] = useState<DisasterUpdate[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<DisasterUpdate | null>(null);
  const [formData, setFormData] = useState<Partial<DisasterUpdate>>({
    title: '',
    description: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'disaster_updates'));
      const updatesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as DisasterUpdate[];
      setUpdates(updatesList.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch disaster updates',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const updateData = {
        ...formData,
        timestamp: Timestamp.now(),
      };

      if (editingUpdate) {
        await updateDoc(doc(db, 'disaster_updates', editingUpdate.id!), updateData);
        toast({
          title: 'Success',
          description: 'Disaster update updated successfully',
        });
      } else {
        await addDoc(collection(db, 'disaster_updates'), updateData);
        toast({
          title: 'Success',
          description: 'Disaster update created successfully',
        });
      }

      setIsDialogOpen(false);
      setEditingUpdate(null);
      setFormData({ title: '', description: '' });
      fetchUpdates();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save disaster update',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (update: DisasterUpdate) => {
    setEditingUpdate(update);
    setFormData(update);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'disaster_updates', id));
      toast({
        title: 'Success',
        description: 'Disaster update deleted successfully',
      });
      fetchUpdates();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete disaster update',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Disaster Updates Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Update
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingUpdate ? 'Edit Disaster Update' : 'Add New Disaster Update'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter update title"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter detailed description"
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingUpdate ? 'Update' : 'Create'}
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
        {updates.map((update) => (
          <Card key={update.id} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{update.title}</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(update)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(update.id!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-3">{update.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {update.timestamp.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DisasterUpdatesManager;

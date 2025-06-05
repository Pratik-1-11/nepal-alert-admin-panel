
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, MapPin, Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationsManager from '@/components/admin/NotificationsManager';
import DisasterUpdatesManager from '@/components/admin/DisasterUpdatesManager';
import DisasterLocationsManager from '@/components/admin/DisasterLocationsManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('notifications');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nepal Disaster Management Admin Panel
          </h1>
          <p className="text-gray-600">
            Manage disaster notifications, updates, and location data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500 ml-auto" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-gray-600">High priority notifications</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disaster Locations</CardTitle>
              <MapPin className="h-4 w-4 text-blue-500 ml-auto" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-gray-600">Active disaster zones</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Updates</CardTitle>
              <Bell className="h-4 w-4 text-green-500 ml-auto" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-gray-600">Updates today</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Manage notifications, disaster updates, and location data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="updates" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Disaster Updates
                </TabsTrigger>
                <TabsTrigger value="locations" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Disaster Locations
                </TabsTrigger>
              </TabsList>

              <TabsContent value="notifications" className="mt-6">
                <NotificationsManager />
              </TabsContent>

              <TabsContent value="updates" className="mt-6">
                <DisasterUpdatesManager />
              </TabsContent>

              <TabsContent value="locations" className="mt-6">
                <DisasterLocationsManager />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

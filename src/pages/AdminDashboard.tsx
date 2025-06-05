
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, MapPin, Bell, Plus, User, Users, Phone, News } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationsManager from '@/components/admin/NotificationsManager';
import DisasterUpdatesManager from '@/components/admin/DisasterUpdatesManager';
import DisasterLocationsManager from '@/components/admin/DisasterLocationsManager';
import UserManager from '@/components/admin/UserManager';
import NewsManager from '@/components/admin/NewsManager';
import EmergencyContactManager from '@/components/admin/EmergencyContactManager';

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
            Comprehensive management system for disaster response, user administration, news, and emergency contacts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <CardTitle className="text-sm font-medium">System Users</CardTitle>
              <Users className="h-4 w-4 text-green-500 ml-auto" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-gray-600">Registered users</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emergency Contacts</CardTitle>
              <Phone className="h-4 w-4 text-purple-500 ml-auto" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-gray-600">Available contacts</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Management</CardTitle>
            <CardDescription>
              Comprehensive management for disaster response, users, news, and emergency services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="updates" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Updates
                </TabsTrigger>
                <TabsTrigger value="locations" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Locations
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="news" className="flex items-center gap-2">
                  <News className="h-4 w-4" />
                  News
                </TabsTrigger>
                <TabsTrigger value="contacts" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contacts
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

              <TabsContent value="users" className="mt-6">
                <UserManager />
              </TabsContent>

              <TabsContent value="news" className="mt-6">
                <NewsManager />
              </TabsContent>

              <TabsContent value="contacts" className="mt-6">
                <EmergencyContactManager />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

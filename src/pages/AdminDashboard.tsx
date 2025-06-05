
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, MapPin, Users, Phone } from 'lucide-react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import NotificationsManager from '@/components/admin/NotificationsManager';
import DisasterUpdatesManager from '@/components/admin/DisasterUpdatesManager';
import DisasterLocationsManager from '@/components/admin/DisasterLocationsManager';
import UserManager from '@/components/admin/UserManager';
import NewsManager from '@/components/admin/NewsManager';
import EmergencyContactManager from '@/components/admin/EmergencyContactManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('notifications');

  const renderContent = () => {
    switch (activeTab) {
      case 'notifications':
        return <NotificationsManager />;
      case 'updates':
        return <DisasterUpdatesManager />;
      case 'locations':
        return <DisasterLocationsManager />;
      case 'users':
        return <UserManager />;
      case 'news':
        return <NewsManager />;
      case 'contacts':
        return <EmergencyContactManager />;
      default:
        return <NotificationsManager />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold">Nepal Disaster Management Admin Panel</h1>
              <p className="text-sm text-gray-600">
                Comprehensive management system for disaster response, user administration, news, and emergency contacts
              </p>
            </div>
          </header>

          <div className="flex-1 p-6">
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
              <CardContent className="p-6">
                {renderContent()}
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;

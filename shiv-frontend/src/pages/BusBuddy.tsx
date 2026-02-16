import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Bus, MapPin, Clock, Users } from "lucide-react";

const BusBuddy = () => {
  const handleOpenApp = () => {
    window.open("https://campus-bus-app-7ea73.web.app/", "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          Bus Buddy
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium">
          Track campus buses and plan your commute in real-time
        </p>
      </div>

      {/* Main Card */}
      <Card className="border-2 border-blue-200 dark:border-blue-900 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-b">
          <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Bus className="h-6 w-6" />
            Your Campus Transportation Solution
          </CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-300">
            Real-time bus tracking, schedules, and route planning
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Live Tracking</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Track bus locations in real-time</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Schedules</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">View bus arrival times</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Find Peers</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Connect with fellow commuters</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">About Bus Buddy</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Bus Buddy is a comprehensive campus transportation application designed to make your commute easier. Get real-time updates on bus locations, plan your routes efficiently, and connect with other students traveling in the same direction. Download the app or access it online to stay connected with campus transportation.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleOpenApp}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 flex items-center justify-center gap-2"
                size="lg"
              >
                <ExternalLink className="h-5 w-5" />
                Open Bus Buddy App
              </Button>
              <Button
                variant="outline"
                className="flex-1 py-6"
                size="lg"
              >
                Download Mobile App
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <ol className="space-y-1 list-decimal list-inside">
              <li>Open the Bus Buddy app</li>
              <li>View nearby bus stops</li>
              <li>Check real-time bus schedules</li>
              <li>Plan your route</li>
              <li>Get updates on arrival times</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Community Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <ul className="space-y-1 list-disc list-inside">
              <li>Connect with commuters</li>
              <li>Share ride preferences</li>
              <li>Rate bus experiences</li>
              <li>Report issues</li>
              <li>Get recommendations</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusBuddy;

import React, { useState } from 'react';
import {
  Calendar,
  Users,
  Clock,
  TrendingUp,
  Video,
  Settings,
  Bell,
  Plus,
  LogOut,
  MoreVertical,
  Search,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { StatCard, ChartPlaceholder, ListItem, EmptyState, PremiumBadge } from '../ui/Stats';
import { Tabs, Dropdown, Tooltip } from '../ui/Tabs';
import { Input } from '../ui/FormInputs';

interface DashboardProps {
  userName?: string;
  userAvatar?: string;
}

export default function PremiumDashboard({ userName = 'User', userAvatar }: DashboardProps) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const upcomingMeetings = [
    { id: 1, title: 'Team Standup', time: '10:00 AM', participants: 5, duration: '30 min' },
    { id: 2, title: 'Project Review', time: '2:00 PM', participants: 8, duration: '1 hour' },
    { id: 3, title: 'Client Call', time: '4:30 PM', participants: 3, duration: '45 min' },
  ];

  const recentMeetings = [
    { id: 1, title: 'Q1 Planning', date: 'Today', participants: 12, duration: '2h 15m' },
    { id: 2, title: 'Design Review', date: 'Yesterday', participants: 6, duration: '1h 30m' },
    { id: 3, title: 'Client Feedback', date: '2 days ago', participants: 4, duration: '45m' },
  ];

  const tabsConfig = [
    { label: 'Overview', id: 'overview', icon: <TrendingUp size={16} /> },
    { label: 'Meetings', id: 'meetings', icon: <Calendar size={16} /> },
    { label: 'Analytics', id: 'analytics', icon: <TrendingUp size={16} /> },
    { label: 'Team', id: 'team', icon: <Users size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-900 via-surface-900 to-surface-800">
      {/* Header */}
      <div className="border-b border-white/5 bg-surface-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-white/40">Welcome back, {userName}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex bg-surface-700 border border-white/5 rounded-lg px-3 py-2 max-w-sm">
              <Search size={16} className="text-white/40 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-white placeholder-white/40 text-sm flex-1"
              />
            </div>

            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors relative">
              <Bell size={18} className="text-white/60" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full" />
            </button>

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Upcoming Meetings"
                value="3"
                icon={<Calendar size={20} />}
                trend={12}
                color="brand"
              />
              <StatCard
                title="Meeting Hours"
                value="14.5h"
                icon={<Clock size={20} />}
                trend={8}
                color="emerald"
              />
              <StatCard
                title="Team Members"
                value="24"
                icon={<Users size={20} />}
                trend={3}
                color="blue"
              />
              <StatCard
                title="Productivity"
                value="87%"
                icon={<TrendingUp size={20} />}
                trend={5}
                color="amber"
              />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upcoming Meetings */}
              <div className="lg:col-span-2">
                <Card variant="glass">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Upcoming Meetings</CardTitle>
                        <CardDescription>Today and tomorrow</CardDescription>
                      </div>
                      <button className="px-3 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium flex items-center gap-2">
                        <Plus size={16} /> Schedule
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {upcomingMeetings.length > 0 ? (
                      upcomingMeetings.map((meeting) => (
                        <div
                          key={meeting.id}
                          className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
                        >
                          <div className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">{meeting.title}</p>
                            <div className="flex items-center gap-4 text-xs text-white/40 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {meeting.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users size={12} />
                                {meeting.participants}
                              </span>
                            </div>
                          </div>
                          <button className="px-3 py-1.5 bg-brand-600 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                            Join
                          </button>
                        </div>
                      ))
                    ) : (
                      <EmptyState
                        icon={<Calendar size={24} />}
                        title="No upcoming meetings"
                        description="Schedule your first meeting"
                        action={{ label: 'Schedule', onClick: () => {} }}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <Card variant="gradient">
                  <CardHeader>
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <button className="w-full px-4 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2">
                      <Video size={16} /> Start Meeting
                    </button>
                    <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors font-medium text-sm">
                      Join by Code
                    </button>
                    <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors font-medium text-sm">
                      Schedule
                    </button>
                  </CardContent>
                </Card>

                {/* Premium Badge */}
                <Card variant="elevated" className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/30">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <PremiumBadge variant="warning">Premium</PremiumBadge>
                      <p className="text-sm text-amber-100/80 mt-3">Unlimited meetings &amp; unlimited participants</p>
                      <button className="mt-4 w-full px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors text-sm font-medium">
                        Learn More
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartPlaceholder title="Meeting Trends" />
              <ChartPlaceholder title="Participant Engagement" />
            </div>

            {/* Recent Activity */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Recent Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentMeetings.map((meeting) => (
                    <ListItem
                      key={meeting.id}
                      icon={<Video size={16} />}
                      title={meeting.title}
                      subtitle={`${meeting.date} • ${meeting.participants} participants`}
                      action={
                        <Dropdown
                          trigger={<MoreVertical size={16} className="text-white/40" />}
                          items={[
                            { label: 'View Details', onClick: () => {} },
                            { label: 'Download Recording', onClick: () => {} },
                            { label: 'Share', onClick: () => {} },
                          ]}
                        />
                      }
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'meetings' && (
          <Card variant="glass">
            <CardHeader>
              <CardTitle>All Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<Calendar size={48} />}
                title="Manage your meetings"
                description="Create, view, and manage all your meetings from here"
                action={{ label: 'Create Meeting', onClick: () => {} }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

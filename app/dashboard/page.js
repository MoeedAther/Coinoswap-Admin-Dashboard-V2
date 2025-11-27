"use client";

import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend } from 'recharts';
import { Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const exchangeData = [
  { name: 'Changelly', count: 15, color: '#10b981' },
  { name: 'changeNOW', count: 8, color: '#10b981' },
  { name: 'changeHero', count: 10, color: '#3b82f6' },
  { name: 'EasyBit', count: 7, color: '#3b82f6' },
  { name: 'EXOLIX', count: 2, color: '#f97316' },
  { name: 'GODEX', count: 10, color: '#eab308' },
  { name: 'LetsExchange', count: 394, color: '#3b82f6' },
  { name: 'StealthEX', count: 10, color: '#8b5cf6' },
  { name: 'SimpleSwap', count: 10, color: '#3b82f6' },
];

const swapsPerExchange = [
  { name: 'Changelly', value: 120 },
  { name: 'Godex', value: 95 },
  { name: 'Simpleswap', value: 50 },
];

const weeklyData = [
  { day: 'Mon', swaps: 20, volume: 12500 },
  { day: 'Tue', swaps: 35, volume: 18900 },
  { day: 'Wed', swaps: 25, volume: 15200 },
  { day: 'Thu', swaps: 45, volume: 23400 },
  { day: 'Fri', swaps: 30, volume: 17800 },
  { day: 'Sat', swaps: 50, volume: 28900 },
  { day: 'Sun', swaps: 55, volume: 31200 },
];

const monthlyData = [
  { month: 'Jan', successful: 120, failed: 8, pending: 5 },
  { month: 'Feb', successful: 145, failed: 12, pending: 7 },
  { month: 'Mar', successful: 180, failed: 10, pending: 6 },
  { month: 'Apr', successful: 165, failed: 15, pending: 8 },
  { month: 'May', successful: 200, failed: 18, pending: 10 },
  { month: 'Jun', successful: 235, failed: 20, pending: 12 },
];

const completionData = [
  { name: 'Completed', value: 85, color: 'hsl(var(--primary))' },
  { name: 'Pending', value: 15, color: 'hsl(var(--muted))' },
];

export default function Dashboard() {
  const [dateFrom, setDateFrom] = useState();
  const [dateTo, setDateTo] = useState();
  const [status, setStatus] = useState('successful');

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-64 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom && dateTo ? (
                      `${format(dateFrom, 'dd/MM/yyyy')} - ${format(dateTo, 'dd/MM/yyyy')}`
                    ) : (
                      <span className="text-xs sm:text-sm">dd/MM/yyyy - dd/MM/yyyy</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3 space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">From Date</p>
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                        className={cn("pointer-events-auto")}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">To Date</p>
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        className={cn("pointer-events-auto")}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="successful">Successful</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" className="w-full sm:w-auto p-1">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {exchangeData.map((exchange, index) => (
              <Card key={index} className="border-border bg-card">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded" style={{ backgroundColor: exchange.color }} />
                      <span className="text-base sm:text-lg font-medium text-foreground truncate">{exchange.name}</span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-bold text-foreground">{exchange.count}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Weekly Swaps Trend - Area Chart */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold">Weekly Swaps Trend</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Last 7 days performance</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSwaps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="day" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                      cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="swaps" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fill="url(#colorSwaps)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Transaction Status - Line Chart */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold">Monthly Transaction Status</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Last 6 months overview</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                      cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="line"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="successful" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="failed" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--destructive))', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pending" 
                      stroke="hsl(var(--warning))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--warning))', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Completion Rate - Donut Chart */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold">Transaction Completion Rate</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Overall success rate</p>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-6">
                <div className="relative w-full max-w-sm">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <defs>
                        <linearGradient id="colorCompleted" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1}/>
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        </linearGradient>
                      </defs>
                      <Pie
                        data={completionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={75}
                        outerRadius={110}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="hsl(var(--card))"
                        strokeWidth={6}
                        paddingAngle={2}
                      >
                        <Cell key="completed" fill="url(#colorCompleted)" />
                        <Cell key="pending" fill="hsl(var(--muted))" />
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-5xl sm:text-6xl font-bold text-primary">85%</span>
                    <span className="text-sm text-muted-foreground mt-2 font-medium">Success Rate</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

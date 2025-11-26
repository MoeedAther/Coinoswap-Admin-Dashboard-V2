"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Copy } from 'lucide-react';
import { toast } from 'sonner';

const exchanges = [
  { name: 'Changelly', slack: 'https://google.com', gmail: 'https://google.com', telegram: 'https://google.com' },
  { name: 'Changenow', slack: 'https://google.com', gmail: 'support@chang...', telegram: 'https://google.com' },
  { name: 'Changehero', slack: 'https://google.com', gmail: 'https://google.com', telegram: 'https://google.com' },
  { name: 'Exolix', slack: 'https://google.com', gmail: 'https://google.com', telegram: 'https://google.com' },
  { name: 'Godex', slack: 'https://google.com', gmail: 'https://google.com', telegram: 'https://google.com' },
  { name: 'Stealthex', slack: 'https://google.com', gmail: 'https://google.com', telegram: 'https://google.com' },
  { name: 'Letsexchange', slack: 'https://google.com', gmail: 'https://google.com', telegram: 'https://google.com' },
  { name: 'Simpleswap', slack: 'https://google.com', gmail: 'https://google.com', telegram: 'https://google.com' },
];

const visibilityExchanges = [
  'Changelly', 'Changenow', 'Changehero', 'Exolix', 'Letsexchange', 'Stealthex', 'Simpleswap', 'Godex', 'Easybit'
];

export default function SettingExchange() {
  const [sendCoin, setSendCoin] = useState('XMR');
  const [getCoin, setGetCoin] = useState('BTC');
  const [amount, setAmount] = useState('0.1');
  const [cronData, setCronData] = useState({ second: '5', minute: '*', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' });
  const [selectedGiveaway, setSelectedGiveaway] = useState([]);
  const [tagline, setTagline] = useState('Featured Exchange');
  const [visibility, setVisibility] = useState({});

  const generatedURL = `https://www.coinoswap.com/?to=BTC&toNetwork=BTC&from=XMR&fromNetwork=XMR&sell=XMR&amount=0.1&direction=direct`;

  const handleCopyURL = () => {
    navigator.clipboard.writeText(generatedURL);
    toast.success('URL copied to clipboard');
  };

  const toggleVisibility = (exchange, type) => {
    setVisibility({ ...visibility, [exchange]: type });
  };

  const toggleGiveaway = (exchange) => {
    setSelectedGiveaway(prev =>
      prev.includes(exchange) ? prev.filter(e => e !== exchange) : [...prev, exchange]
    );
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Exchange</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Manage exchange settings and configurations</p>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Exchange Settings */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Exchange Settings</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Exchange</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Slack</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Gmail</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Telegram</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exchanges.map((exchange) => (
                        <tr key={exchange.name} className="border-b border-border">
                          <td className="py-3 px-2 text-foreground">{exchange.name}</td>
                          <td className="py-3 px-2 text-xs text-muted-foreground truncate max-w-[100px]">{exchange.slack}</td>
                          <td className="py-3 px-2 text-xs text-muted-foreground truncate max-w-[100px]">{exchange.gmail}</td>
                          <td className="py-3 px-2 text-xs text-muted-foreground truncate max-w-[100px]">{exchange.telegram}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {exchanges.map((exchange) => (
                    <Card key={exchange.name} className="border-border">
                      <CardContent className="p-3 space-y-2">
                        <p className="font-medium text-foreground">{exchange.name}</p>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div><span className="font-medium">Slack:</span> {exchange.slack}</div>
                          <div><span className="font-medium">Gmail:</span> {exchange.gmail}</div>
                          <div><span className="font-medium">Telegram:</span> {exchange.telegram}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Button className="w-full mt-4">Update All Exchanges</Button>
              </CardContent>
            </Card>

            {/* Exchange Visibility */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Exchange Visibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {visibilityExchanges.map((exchange) => (
                    <div key={exchange} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2 border-b border-border">
                      <span className="text-sm sm:text-base text-foreground">{exchange}</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={visibility[exchange] === 'fixed' ? 'default' : 'outline'}
                          onClick={() => toggleVisibility(exchange, 'fixed')}
                          className="flex-1 sm:flex-none"
                        >
                          Fixed
                        </Button>
                        <Button
                          size="sm"
                          variant={visibility[exchange] === 'floating' ? 'default' : 'outline'}
                          onClick={() => toggleVisibility(exchange, 'floating')}
                          className="flex-1 sm:flex-none"
                        >
                          Floating
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4">Save</Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Default Pairs */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Default Pairs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label>Send coin</Label>
                  <Select value={sendCoin} onValueChange={setSendCoin}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XMR">🪙 XMR</SelectItem>
                      <SelectItem value="BTC">₿ BTC</SelectItem>
                      <SelectItem value="ETH">Ξ ETH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Get coin</Label>
                  <Select value={getCoin} onValueChange={setGetCoin}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTC">₿ BTC</SelectItem>
                      <SelectItem value="ETH">Ξ ETH</SelectItem>
                      <SelectItem value="XMR">🪙 XMR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} step="0.1" />
                </div>
                <Button className="w-full">Update</Button>
                <div className="space-y-2">
                  <Label>URL</Label>
                  <div className="flex gap-2">
                    <Input value={generatedURL} readOnly className="text-xs" />
                    <Button size="icon" variant="outline" onClick={handleCopyURL}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Refresh Buttons */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Refresh Buttons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 bg-secondary/50 rounded-lg">
                  <span className="text-sm sm:text-base text-foreground">Approved Coins Short Names Refresh</span>
                  <Button className="gap-2 w-full sm:w-auto">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 bg-secondary/50 rounded-lg">
                  <span className="text-sm sm:text-base text-foreground">UnApproved Coins Short Names Refresh</span>
                  <Button className="gap-2 w-full sm:w-auto">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Cron Job */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Cron Job</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label>Second</Label>
                    <Input value={cronData.second} onChange={(e) => setCronData({ ...cronData, second: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Minute</Label>
                    <Input value={cronData.minute} onChange={(e) => setCronData({ ...cronData, minute: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hour</Label>
                    <Input value={cronData.hour} onChange={(e) => setCronData({ ...cronData, hour: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of month</Label>
                    <Input value={cronData.dayOfMonth} onChange={(e) => setCronData({ ...cronData, dayOfMonth: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Input value={cronData.month} onChange={(e) => setCronData({ ...cronData, month: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Day of week</Label>
                    <Input value={cronData.dayOfWeek} onChange={(e) => setCronData({ ...cronData, dayOfWeek: e.target.value })} />
                  </div>
                </div>
                <Button className="w-full">Save</Button>
              </CardContent>
            </Card>

            {/* GiveAway */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">GiveAway</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base">Select Giveaway Option</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={selectedGiveaway.includes('NO GIVEAWAY') ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleGiveaway('NO GIVEAWAY')}
                    >
                      NO GIVEAWAY
                    </Badge>
                    {['CHANGELY', 'CHANGENOW', 'CHANGEHERO', 'GODEX', 'LETSEXCHANGE', 'SIMPLESWAP', 'STEALTHEX', 'EASYBIT'].map((ex) => (
                      <Badge
                        key={ex}
                        variant={selectedGiveaway.includes(ex) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleGiveaway(ex)}
                      >
                        {ex}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tagline:</Label>
                  <Input value={tagline} onChange={(e) => setTagline(e.target.value)} />
                </div>
                <Button className="w-full">Save</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

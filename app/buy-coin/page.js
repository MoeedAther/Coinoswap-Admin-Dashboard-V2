"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const availableCoins = [
  { id: 1, name: 'Bitcoin', symbol: 'BTC', price: '$43,250.00', change24h: '+2.5%', network: 'Bitcoin' },
  { id: 2, name: 'Ethereum', symbol: 'ETH', price: '$2,280.50', change24h: '+1.8%', network: 'Ethereum' },
  { id: 3, name: 'Solana', symbol: 'SOL', price: '$98.75', change24h: '+5.2%', network: 'Solana' },
  { id: 4, name: 'Polygon', symbol: 'MATIC', price: '$0.85', change24h: '-0.5%', network: 'Polygon' },
  { id: 5, name: 'Cardano', symbol: 'ADA', price: '$0.52', change24h: '+3.1%', network: 'Cardano' },
];

export default function BuyCoin() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCoins = availableCoins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBuy = (coin) => {
    toast.success(`Buy order initiated for ${coin.name}`);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Buy Coin</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Purchase cryptocurrency directly</p>
          </div>

          <Card className="border-border">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-lg sm:text-xl">Available Coins</CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search coins..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Coin
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Network
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        24h Change
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCoins.map((coin) => (
                      <tr
                        key={coin.id}
                        className="border-b border-border hover:bg-secondary/50 transition-smooth"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-foreground">{coin.name}</p>
                            <p className="text-sm text-muted-foreground">{coin.symbol}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="secondary">{coin.network}</Badge>
                        </td>
                        <td className="py-4 px-4 text-foreground font-semibold">{coin.price}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`flex items-center gap-1 ${
                              coin.change24h.startsWith('+') ? 'text-success' : 'text-destructive'
                            }`}
                          >
                            <TrendingUp className="h-3 w-3" />
                            {coin.change24h}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button onClick={() => handleBuy(coin)} className="gap-2">
                              <ShoppingCart className="h-4 w-4" />
                              Buy
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredCoins.map((coin) => (
                  <Card key={coin.id} className="border-border">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">{coin.name}</p>
                          <p className="text-sm text-muted-foreground">{coin.symbol}</p>
                        </div>
                        <Badge variant="secondary">{coin.network}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Price: </span>
                          <span className="text-foreground font-semibold">{coin.price}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">24h: </span>
                          <span
                            className={`flex items-center gap-1 ${
                              coin.change24h.startsWith('+') ? 'text-success' : 'text-destructive'
                            }`}
                          >
                            <TrendingUp className="h-3 w-3" />
                            {coin.change24h}
                          </span>
                        </div>
                      </div>
                      <Button onClick={() => handleBuy(coin)} className="w-full gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Buy {coin.symbol}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

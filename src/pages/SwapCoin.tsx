import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface MappedCoin {
  id: number;
  name: string;
  symbol: string;
  network: string;
  exchange: string;
  swapCount: number;
}

const initialCoins: MappedCoin[] = [
  { id: 1, name: 'Bitcoin', symbol: 'BTC', network: 'Bitcoin', exchange: 'Changelly', swapCount: 15 },
  { id: 2, name: 'Ethereum', symbol: 'ETH', network: 'Ethereum', exchange: 'EasyBit', swapCount: 7 },
  { id: 3, name: 'USD Coin', symbol: 'USDC', network: 'Ethereum', exchange: 'LetsExchange', swapCount: 394 },
  { id: 4, name: 'Polygon', symbol: 'MATIC', network: 'Polygon', exchange: 'ChangeNOW', swapCount: 8 },
];

const SwapCoin = () => {
  const [coins, setCoins] = useState<MappedCoin[]>(initialCoins);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCoin, setEditingCoin] = useState<MappedCoin | null>(null);
  const [formData, setFormData] = useState({ name: '', symbol: '', network: '', exchange: '' });

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    if (!formData.name || !formData.symbol || !formData.network || !formData.exchange) {
      toast.error('Please fill in all fields');
      return;
    }
    const newCoin: MappedCoin = {
      id: coins.length + 1,
      name: formData.name,
      symbol: formData.symbol,
      network: formData.network,
      exchange: formData.exchange,
      swapCount: 0,
    };
    setCoins([...coins, newCoin]);
    setFormData({ name: '', symbol: '', network: '', exchange: '' });
    setIsAddDialogOpen(false);
    toast.success('Swap coin added successfully');
  };

  const handleEdit = (coin: MappedCoin) => {
    setEditingCoin(coin);
    setFormData({ name: coin.name, symbol: coin.symbol, network: coin.network, exchange: coin.exchange });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingCoin) return;
    if (!formData.name || !formData.symbol || !formData.network || !formData.exchange) {
      toast.error('Please fill in all fields');
      return;
    }
    setCoins(coins.map(c => c.id === editingCoin.id ? { ...c, ...formData } : c));
    setFormData({ name: '', symbol: '', network: '', exchange: '' });
    setEditingCoin(null);
    setIsEditDialogOpen(false);
    toast.success('Swap coin updated successfully');
  };

  const handleDelete = (id: number) => {
    setCoins(coins.filter((coin) => coin.id !== id));
    toast.success('Coin removed from swaps');
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Swap Coin</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Coins available for swapping</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                Add Swap
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Swap Coin</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label>Coin Name</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter coin name" />
                </div>
                <div className="space-y-2">
                  <Label>Symbol</Label>
                  <Input value={formData.symbol} onChange={(e) => setFormData({ ...formData, symbol: e.target.value })} placeholder="Enter symbol" />
                </div>
                <div className="space-y-2">
                  <Label>Network</Label>
                  <Select value={formData.network} onValueChange={(value) => setFormData({ ...formData, network: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bitcoin">Bitcoin</SelectItem>
                      <SelectItem value="Ethereum">Ethereum</SelectItem>
                      <SelectItem value="Polygon">Polygon</SelectItem>
                      <SelectItem value="Solana">Solana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Exchange</Label>
                  <Select value={formData.exchange} onValueChange={(value) => setFormData({ ...formData, exchange: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select exchange" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Changelly">Changelly</SelectItem>
                      <SelectItem value="EasyBit">EasyBit</SelectItem>
                      <SelectItem value="LetsExchange">LetsExchange</SelectItem>
                      <SelectItem value="ChangeNOW">ChangeNOW</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAdd} className="w-full">Add Swap Coin</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search swap coins..."
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
                      Exchange
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Swaps
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
                      <td className="py-4 px-4 text-foreground">{coin.exchange}</td>
                      <td className="py-4 px-4">
                        <span className="text-primary font-semibold">{coin.swapCount}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(coin)}
                            className="text-foreground hover:text-primary"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(coin.id)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="h-4 w-4" />
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
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(coin)}
                          className="h-9 w-9"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(coin.id)}
                          className="h-9 w-9 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Network: </span>
                        <Badge variant="secondary">{coin.network}</Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Exchange: </span>
                        <span className="text-foreground">{coin.exchange}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Swaps: </span>
                        <span className="text-primary font-semibold">{coin.swapCount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Swap Coin</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-2">
                <Label>Coin Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter coin name" />
              </div>
              <div className="space-y-2">
                <Label>Symbol</Label>
                <Input value={formData.symbol} onChange={(e) => setFormData({ ...formData, symbol: e.target.value })} placeholder="Enter symbol" />
              </div>
              <div className="space-y-2">
                <Label>Network</Label>
                <Select value={formData.network} onValueChange={(value) => setFormData({ ...formData, network: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bitcoin">Bitcoin</SelectItem>
                    <SelectItem value="Ethereum">Ethereum</SelectItem>
                    <SelectItem value="Polygon">Polygon</SelectItem>
                    <SelectItem value="Solana">Solana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Exchange</Label>
                <Select value={formData.exchange} onValueChange={(value) => setFormData({ ...formData, exchange: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exchange" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Changelly">Changelly</SelectItem>
                    <SelectItem value="EasyBit">EasyBit</SelectItem>
                    <SelectItem value="LetsExchange">LetsExchange</SelectItem>
                    <SelectItem value="ChangeNOW">ChangeNOW</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdate} className="w-full">Update Swap Coin</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default SwapCoin;

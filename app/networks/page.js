"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const initialNetworks = [
  { id: 1, name: 'Bitcoin', color: '#F7931A', exchanges: ['Binance', 'Coinbase', 'Kraken'], tokenCount: 45 },
  { id: 2, name: 'Ethereum', color: '#627EEA', exchanges: ['Binance', 'Coinbase', 'KuCoin'], tokenCount: 156 },
  { id: 3, name: 'Polygon', color: '#8247E5', exchanges: ['Binance', 'KuCoin'], tokenCount: 89 },
  { id: 4, name: 'Solana', color: '#14F195', exchanges: ['Coinbase', 'Kraken'], tokenCount: 67 },
  { id: 5, name: 'BSC', color: '#F3BA2F', exchanges: ['Binance'], tokenCount: 134 },
];

export default function Networks() {
  const [networks, setNetworks] = useState(initialNetworks);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingNetwork, setEditingNetwork] = useState(null);
  const [formData, setFormData] = useState({ name: '', color: '#f59e0b', exchanges: '' });

  const filteredNetworks = networks.filter((network) =>
    network.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    if (!formData.name || !formData.exchanges) {
      toast.error('Please fill in all fields');
      return;
    }
    const newNetwork = {
      id: networks.length + 1,
      name: formData.name,
      color: formData.color,
      exchanges: formData.exchanges.split(',').map(e => e.trim()),
      tokenCount: 0,
    };
    setNetworks([...networks, newNetwork]);
    setFormData({ name: '', color: '#f59e0b', exchanges: '' });
    setIsAddDialogOpen(false);
    toast.success('Network added successfully');
  };

  const handleEdit = (network) => {
    setEditingNetwork(network);
    setFormData({ name: network.name, color: network.color, exchanges: network.exchanges.join(', ') });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingNetwork) return;
    if (!formData.name || !formData.exchanges) {
      toast.error('Please fill in all fields');
      return;
    }
    setNetworks(networks.map(n => n.id === editingNetwork.id ? {
      ...n,
      name: formData.name,
      color: formData.color,
      exchanges: formData.exchanges.split(',').map(e => e.trim())
    } : n));
    setFormData({ name: '', color: '#f59e0b', exchanges: '' });
    setEditingNetwork(null);
    setIsEditDialogOpen(false);
    toast.success('Network updated successfully');
  };

  const handleDelete = (id) => {
    setNetworks(networks.filter((network) => network.id !== id));
    toast.success('Network deleted successfully');
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Network Configuration</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Manage blockchain networks and exchange mappings</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 w-full sm:w-auto">
                  <Plus className="h-4 w-4" />
                  Add Network
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Network</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[80vh] overflow-y-auto">
                  <div className="space-y-2">
                    <Label>Network Name</Label>
                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter network name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Exchanges (comma-separated)</Label>
                    <Input value={formData.exchanges} onChange={(e) => setFormData({ ...formData, exchanges: e.target.value })} placeholder="e.g., Changelly, Binance" />
                  </div>
                  <Button onClick={handleAdd} className="w-full">Add Network</Button>
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
                    placeholder="Search networks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredNetworks.map((network) => (
                  <Card key={network.id} className="border-border hover:shadow-glow transition-smooth">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
                            style={{ backgroundColor: network.color }}
                          />
                          <div className="min-w-0">
                            <h3 className="font-semibold text-foreground truncate">{network.name}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">{network.tokenCount} tokens</p>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => handleEdit(network)}>
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(network.id)}
                            className="h-8 w-8 sm:h-9 sm:w-9 text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2">Exchanges:</p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {network.exchanges.map((exchange) => (
                            <Badge key={exchange} variant="secondary" className="text-xs">
                              {exchange}
                            </Badge>
                          ))}
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
                <DialogTitle>Edit Network</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label>Network Name</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter network name" />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Exchanges (comma-separated)</Label>
                  <Input value={formData.exchanges} onChange={(e) => setFormData({ ...formData, exchanges: e.target.value })} placeholder="e.g., Changelly, Binance" />
                </div>
                <Button onClick={handleUpdate} className="w-full">Update Network</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

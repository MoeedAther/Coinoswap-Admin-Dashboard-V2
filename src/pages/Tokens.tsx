import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Token {
  id: number;
  name: string;
  symbol: string;
  blockchain: string;
  exchange: string;
  status: 'approved' | 'pending' | 'rejected';
}

const initialTokens: Token[] = [
  { id: 1, name: 'Bitcoin', symbol: 'BTC', blockchain: 'Bitcoin', exchange: 'Binance', status: 'approved' },
  { id: 2, name: 'Ethereum', symbol: 'ETH', blockchain: 'Ethereum', exchange: 'Coinbase', status: 'approved' },
  { id: 3, name: 'Polygon', symbol: 'MATIC', blockchain: 'Polygon', exchange: 'KuCoin', status: 'pending' },
  { id: 4, name: 'Solana', symbol: 'SOL', blockchain: 'Solana', exchange: 'Kraken', status: 'approved' },
];

const Tokens = () => {
  const [tokens, setTokens] = useState<Token[]>(initialTokens);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setTokens(tokens.filter((token) => token.id !== id));
    toast.success('Token deleted successfully');
  };

  const handleApprove = (id: number) => {
    setTokens(
      tokens.map((token) =>
        token.id === id ? { ...token, status: 'approved' as const } : token
      )
    );
    toast.success('Token approved');
  };

  const handleReject = (id: number) => {
    setTokens(
      tokens.map((token) =>
        token.id === id ? { ...token, status: 'rejected' as const } : token
      )
    );
    toast.error('Token rejected');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Token Management</h2>
            <p className="text-muted-foreground">Manage cryptocurrency tokens across exchanges</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Token
          </Button>
        </div>

        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tokens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Token
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Blockchain
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Exchange
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTokens.map((token) => (
                    <tr
                      key={token.id}
                      className="border-b border-border hover:bg-secondary/50 transition-smooth"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-foreground">{token.name}</p>
                          <p className="text-sm text-muted-foreground">{token.symbol}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-foreground">{token.blockchain}</td>
                      <td className="py-4 px-4 text-foreground">{token.exchange}</td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={
                            token.status === 'approved'
                              ? 'default'
                              : token.status === 'pending'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {token.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          {token.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleApprove(token.id)}
                                className="text-success hover:text-success/80"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleReject(token.id)}
                                className="text-destructive hover:text-destructive/80"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-foreground hover:text-primary"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(token.id)}
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Tokens;

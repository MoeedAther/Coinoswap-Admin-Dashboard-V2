import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

interface Transaction {
  id: number;
  from: string;
  to: string;
  amount: string;
  status: 'Successful' | 'Pending' | 'Failed';
  time: string;
  txHash: string;
}

const initialTransactions: Transaction[] = [
  { id: 1, from: 'BTC', to: 'ETH', amount: '0.5 BTC', status: 'Successful', time: '2 min ago', txHash: '0x1a2b3c...' },
  { id: 2, from: 'ETH', to: 'USDT', amount: '2.5 ETH', status: 'Pending', time: '5 min ago', txHash: '0x4d5e6f...' },
  { id: 3, from: 'SOL', to: 'USDC', amount: '150 SOL', status: 'Successful', time: '12 min ago', txHash: '0x7g8h9i...' },
  { id: 4, from: 'MATIC', to: 'ETH', amount: '1000 MATIC', status: 'Failed', time: '18 min ago', txHash: '0xj1k2l3...' },
  { id: 5, from: 'BTC', to: 'USDC', amount: '0.25 BTC', status: 'Successful', time: '25 min ago', txHash: '0xm4n5o6...' },
];

const Transactions = () => {
  const [transactions] = useState<Transaction[]>(initialTransactions);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.txHash.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Transactions</h2>
          <p className="text-sm sm:text-base text-muted-foreground">View all exchange transactions</p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
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
                      Swap
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Time
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      TX Hash
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-border hover:bg-secondary/50 transition-smooth"
                    >
                      <td className="py-4 px-4">
                        <span className="font-medium text-foreground">
                          {tx.from} → {tx.to}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-foreground">{tx.amount}</td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={
                            tx.status === 'Successful'
                              ? 'default'
                              : tx.status === 'Pending'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {tx.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{tx.time}</td>
                      <td className="py-4 px-4">
                        <code className="text-sm text-primary break-all">{tx.txHash}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredTransactions.map((tx) => (
                <Card key={tx.id} className="border-border">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">
                          {tx.from} → {tx.to}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{tx.amount}</p>
                      </div>
                      <Badge
                        variant={
                          tx.status === 'Successful'
                            ? 'default'
                            : tx.status === 'Pending'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {tx.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Time: </span>
                        <span className="text-foreground">{tx.time}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">TX Hash: </span>
                        <code className="text-xs text-primary break-all">{tx.txHash}</code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;

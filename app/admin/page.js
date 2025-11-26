"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Shield, UserPlus, Settings, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const initialAdmins = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'admin@coinoswap.com', phone: '+1234567890', role: 'Super Admin', status: 'Active' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'manager@coinoswap.com', phone: '+1234567891', role: 'Manager', status: 'Active' },
  { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'support@coinoswap.com', phone: '+1234567892', role: 'Support', status: 'Active' },
];

export default function Admin() {
  const [admins, setAdmins] = useState(initialAdmins);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const handleAddAdmin = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password || !formData.role) {
      toast.error('Please fill in all fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const newAdmin = {
      id: admins.length + 1,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: 'Active',
    };
    setAdmins([...admins, newAdmin]);
    setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', role: '' });
    setIsAddDialogOpen(false);
    toast.success('Admin added successfully');
  };

  const handleView = (admin) => {
    setSelectedAdmin(admin);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      phone: admin.phone,
      password: '',
      confirmPassword: '',
      role: admin.role,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedAdmin) return;
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.role) {
      toast.error('Please fill in all fields');
      return;
    }
    setAdmins(admins.map(a => a.id === selectedAdmin.id ? {
      ...a,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
    } : a));
    setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', role: '' });
    setSelectedAdmin(null);
    setIsEditDialogOpen(false);
    toast.success('Admin updated successfully');
  };

  const handleDelete = (id) => {
    setAdmins(admins.filter(a => a.id !== id));
    toast.success('Admin deleted successfully');
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Management</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Manage admin users and permissions</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 w-full sm:w-auto">
                  <UserPlus className="h-4 w-4" />
                  Add Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Admin</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-4">Basic Information</h3>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>First name <span className="text-destructive">*</span></Label>
                        <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Last name <span className="text-destructive">*</span></Label>
                        <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Email <span className="text-destructive">*</span></Label>
                        <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone number <span className="text-destructive">*</span></Label>
                        <Input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+1" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-4">Security</h3>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Password <span className="text-destructive">*</span></Label>
                        <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Password confirmation <span className="text-destructive">*</span></Label>
                        <Input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Roles <span className="text-destructive">*</span></Label>
                        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Super Admin">Super Admin</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                            <SelectItem value="Support">Support</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={handleAddAdmin} className="w-full sm:w-auto">Create</Button>
                    <Button onClick={handleAddAdmin} variant="secondary" className="w-full sm:w-auto">Create & create another</Button>
                    <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="w-full sm:w-auto">Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Total Admins
                </CardTitle>
                <Shield className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-foreground">{admins.length}</div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Active Sessions
                </CardTitle>
                <Settings className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-foreground">2</div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Permissions
                </CardTitle>
                <Shield className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-foreground">5</div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Admin Users</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Phone</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-secondary/50 transition-smooth">
                        <td className="py-4 px-4 text-foreground">{user.firstName} {user.lastName}</td>
                        <td className="py-4 px-4 text-foreground">{user.email}</td>
                        <td className="py-4 px-4 text-foreground">{user.phone}</td>
                        <td className="py-4 px-4"><Badge variant="secondary">{user.role}</Badge></td>
                        <td className="py-4 px-4"><Badge className="bg-success/10 text-success">{user.status}</Badge></td>
                        <td className="py-4 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleView(user)}>
                                <Eye className="mr-2 h-4 w-4" />View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(user)}>
                                <Edit className="mr-2 h-4 w-4" />Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {admins.map((user) => (
                  <Card key={user.id} className="border-border">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(user)}>
                              <Eye className="mr-2 h-4 w-4" />View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(user)}>
                              <Edit className="mr-2 h-4 w-4" />Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <div><span className="text-muted-foreground">Phone: </span><span className="text-foreground">{user.phone}</span></div>
                        <Badge variant="secondary">{user.role}</Badge>
                        <Badge className="bg-success/10 text-success">{user.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-md">
              <DialogHeader><DialogTitle>Admin Details</DialogTitle></DialogHeader>
              {selectedAdmin && (
                <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    <div><Label className="text-muted-foreground">First Name</Label><p className="font-medium">{selectedAdmin.firstName}</p></div>
                    <div><Label className="text-muted-foreground">Last Name</Label><p className="font-medium">{selectedAdmin.lastName}</p></div>
                    <div><Label className="text-muted-foreground">Email</Label><p className="font-medium">{selectedAdmin.email}</p></div>
                    <div><Label className="text-muted-foreground">Phone</Label><p className="font-medium">{selectedAdmin.phone}</p></div>
                    <div><Label className="text-muted-foreground">Role</Label><p className="font-medium">{selectedAdmin.role}</p></div>
                    <div><Label className="text-muted-foreground">Status</Label><p className="font-medium">{selectedAdmin.status}</p></div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Edit Admin</DialogTitle></DialogHeader>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-4">Basic Information</h3>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    <div className="space-y-2"><Label>First name *</Label><Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Last name *</Label><Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Email *</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Phone number *</Label><Input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Roles *</Label>
                      <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Super Admin">Super Admin</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Support">Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleUpdate} className="w-full sm:w-auto">Update</Button>
                  <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="w-full sm:w-auto">Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

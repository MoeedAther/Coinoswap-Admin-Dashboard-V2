"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import * as swapAPI from "@/api/swap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const initialCoins = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC",
    network: "Bitcoin",
    exchange: "Changelly",
    swapCount: 15,
  },
  {
    id: 2,
    name: "Ethereum",
    symbol: "ETH",
    network: "Ethereum",
    exchange: "EasyBit",
    swapCount: 7,
  },
  {
    id: 3,
    name: "USD Coin",
    symbol: "USDC",
    network: "Ethereum",
    exchange: "LetsExchange",
    swapCount: 394,
  },
  {
    id: 4,
    name: "Polygon",
    symbol: "MATIC",
    network: "Polygon",
    exchange: "ChangeNOW",
    swapCount: 8,
  },
];

export default function SwapCoin() {
  const [coins, setCoins] = useState(initialCoins);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const [editingCoin, setEditingCoin] = useState(null);
  const [notificationCoin, setNotificationCoin] = useState(null);
  const [mappingCoin, setMappingCoin] = useState(null);
  const [selectedCoins, setSelectedCoins] = useState([]);
  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [mapSearchResults, setMapSearchResults] = useState([]);
  const [isMapSearchLoading, setIsMapSearchLoading] = useState(false);
  const [mapPagination, setMapPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCoins: 0,
    limit: 20,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [mapIsStandard, setMapIsStandard] = useState(1); // 1 for standard, 0 for non-standard
  const [debouncedMapSearch, setDebouncedMapSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStandardFilter, setIsStandardFilter] = useState(1); // Default to 1 (Standard)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    standardCoinId: "",
    shortName: "",
    coinType: "",
    imageUrl: "",
    name: "",
    symbol: "",
    network: "",
    exchange: "",
    isApproved: false,
  });
  const [notificationData, setNotificationData] = useState({
    standardCoinId: "",
    swapPartner: "",
    payInNotifications: "",
    payOutNotifications: "",
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 when search changes
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch coins data on mount and when page/filter/search changes
  useEffect(() => {
    async function getCoins() {
      try {
        setIsLoading(true);
        const params = {
          searchTerm: debouncedSearch.trim(),
          isStandard: isStandardFilter !== null ? isStandardFilter : 1, // Default to 1 (Standard) if null
          page: currentPage,
          limit: 10,
        };
        const data = await swapAPI.searchSwapCoins(params);
        console.log("Coins Data:", data);
        
        if (data && data.success && data.coins) {
          // Transform API response to match the expected coin structure
          const transformedCoins = data.coins.map((coin, index) => ({
            id: coin.id || index + 1,
            name: coin.name || coin.ticker || "",
            symbol: coin.shortName || coin.symbol || "",
            network: coin.network || "",
            exchange: coin.swapPartner || coin.exchange || "",
            swapCount: Array.isArray(coin.mappedPartners) ? coin.mappedPartners.length : 0,
            isStandard: coin.isStandard || false,
            // Include additional fields for edit functionality
            standardCoinId: coin.id?.toString() || coin.standardCoinId?.toString() || "",
            shortName: coin.shortName || coin.ticker || "",
            coinType: coin.coinType || "",
            imageUrl: coin.imageUrl || coin.image || "",
            image: coin.image || coin.imageUrl || "",
            isApproved: coin.isApproved || false,
            // Include mappedPartners for map modal
            mappedPartners: coin.mappedPartners || [],
          }));
          setCoins(transformedCoins);
          
          // Update pagination state from API response
          if (data.pagination) {
            setPagination({
              currentPage: data.pagination.currentPage || currentPage,
              totalPages: data.pagination.totalPages || 1,
              totalCount: data.pagination.totalCoins || data.pagination.totalCount || 0,
              limit: data.pagination.limit || 10,
              hasNextPage: data.pagination.hasNextPage || false,
              hasPreviousPage: data.pagination.hasPrevPage || data.pagination.hasPreviousPage || false,
            });
          }
        }
      } catch (error) {
        console.error("API Error:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch coins"
        );
      } finally {
        setIsLoading(false);
      }
    }

    getCoins();
  }, [currentPage, isStandardFilter, debouncedSearch]);

  // No need for client-side filtering since API handles search
  const filteredCoins = coins;

  const handleAdd = () => {
    if (
      !formData.name ||
      !formData.symbol ||
      !formData.network ||
      !formData.exchange
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    const newCoin = {
      id: coins.length + 1,
      name: formData.name,
      symbol: formData.symbol,
      network: formData.network,
      exchange: formData.exchange,
      swapCount: 0,
    };
    setCoins([...coins, newCoin]);
    setFormData({ name: "", symbol: "", network: "", exchange: "" });
    setIsAddDialogOpen(false);
    toast.success("Swap coin added successfully");
  };

  const handleEdit = (coin) => {
    setEditingCoin(coin);
    setFormData({
      standardCoinId: coin.standardCoinId || coin.id?.toString() || "",
      shortName: coin.shortName || coin.symbol || "",
      coinType: coin.coinType || "",
      imageUrl: coin.imageUrl || coin.image || "",
      name: coin.name || "",
      symbol: coin.symbol || "",
      network: coin.network || "",
      exchange: coin.exchange || "",
      isApproved: coin.isApproved || false,
    });
    setIsEditDialogOpen(true);
  };

  const handleApprovalToggle = async (checked) => {
    if (!editingCoin) return;
    
    const coinId = parseInt(editingCoin.id || editingCoin.standardCoinId);
    if (isNaN(coinId)) {
      toast.error("Invalid coin ID");
      return;
    }

    try {
      setIsLoading(true);
      const response = await swapAPI.updateStandardCoin({
        coinId: coinId,
        isApproved: checked,
      });

      if (response && response.success) {
        // Update formData
        setFormData({ ...formData, isApproved: checked });
        
        // Update the coin in the coins array
        setCoins((prevCoins) =>
          prevCoins.map((coin) =>
            coin.id === editingCoin.id
              ? { ...coin, isApproved: checked }
              : coin
          )
        );
        
        // Update editingCoin
        setEditingCoin({ ...editingCoin, isApproved: checked });
      }
    } catch (error) {
      console.error("Approval toggle error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotification = (coin) => {
    setNotificationCoin(coin);
    // Get the first mapped partner if available, or set empty
    const firstPartner = coin.mappedPartners && coin.mappedPartners.length > 0 
      ? coin.mappedPartners[0] 
      : null;
    
    setNotificationData({
      standardCoinId: coin.standardCoinId || coin.id?.toString() || "",
      swapPartner: firstPartner?.swapPartner || "",
      payInNotifications: firstPartner?.payInNotifications 
        ? JSON.stringify(firstPartner.payInNotifications, null, 2)
        : "",
      payOutNotifications: firstPartner?.payOutNotifications
        ? JSON.stringify(firstPartner.payOutNotifications, null, 2)
        : "",
    });
    setIsNotificationDialogOpen(true);
  };

  const handlePartnerChange = (partnerName) => {
    if (!notificationCoin || !notificationCoin.mappedPartners) return;
    
    const partner = notificationCoin.mappedPartners.find(
      (p) => p.swapPartner === partnerName
    );
    
    setNotificationData({
      ...notificationData,
      swapPartner: partnerName,
      payInNotifications: partner?.payInNotifications
        ? JSON.stringify(partner.payInNotifications, null, 2)
        : "",
      payOutNotifications: partner?.payOutNotifications
        ? JSON.stringify(partner.payOutNotifications, null, 2)
        : "",
    });
  };

  const handleUpdateNotifications = async () => {
    if (!notificationCoin) return;
    
    if (!notificationData.standardCoinId) {
      toast.error("Standard Coin ID is required");
      return;
    }
    
    if (!notificationData.swapPartner) {
      toast.error("Swap Partner is required");
      return;
    }

    // Parse JSON arrays
    let payInNotifications = [];
    let payOutNotifications = [];
    
    try {
      if (notificationData.payInNotifications.trim()) {
        payInNotifications = JSON.parse(notificationData.payInNotifications);
        if (!Array.isArray(payInNotifications)) {
          toast.error("Pay In Notifications must be a JSON array");
          return;
        }
      }
    } catch (error) {
      toast.error("Invalid JSON format for Pay In Notifications");
      return;
    }

    try {
      if (notificationData.payOutNotifications.trim()) {
        payOutNotifications = JSON.parse(notificationData.payOutNotifications);
        if (!Array.isArray(payOutNotifications)) {
          toast.error("Pay Out Notifications must be a JSON array");
          return;
        }
      }
    } catch (error) {
      toast.error("Invalid JSON format for Pay Out Notifications");
      return;
    }

    // At least one must be provided
    if (payInNotifications.length === 0 && payOutNotifications.length === 0) {
      toast.error("At least one notification array must be provided");
      return;
    }

    try {
      setIsLoading(true);
      const updateData = {
        standardCoinId: parseInt(notificationData.standardCoinId),
        swapPartner: notificationData.swapPartner,
      };

      if (payInNotifications.length > 0) {
        updateData.payInNotifications = payInNotifications;
      }
      if (payOutNotifications.length > 0) {
        updateData.payOutNotifications = payOutNotifications;
      }

      const response = await swapAPI.updateNotifications(updateData);

      if (response && response.success) {
        toast.success(response.message || "Notifications updated successfully");
        
        // Reset form
        setNotificationData({
          standardCoinId: "",
          swapPartner: "",
          payInNotifications: "",
          payOutNotifications: "",
        });
        setNotificationCoin(null);
        setIsNotificationDialogOpen(false);

        // Refetch the current page to ensure UI is in sync with backend
        const refreshParams = {
          searchTerm: debouncedSearch.trim(),
          isStandard: isStandardFilter !== null ? isStandardFilter : 1,
          page: currentPage,
          limit: 10,
        };
        
        try {
          const refreshData = await swapAPI.searchSwapCoins(refreshParams);
          if (refreshData && refreshData.success && refreshData.coins) {
            const refreshedCoins = refreshData.coins.map((coin, index) => ({
              id: coin.id || index + 1,
              name: coin.name || coin.ticker || "",
              symbol: coin.shortName || coin.symbol || "",
              network: coin.network || "",
              exchange: coin.swapPartner || coin.exchange || "",
              swapCount: Array.isArray(coin.mappedPartners) ? coin.mappedPartners.length : 0,
              isStandard: coin.isStandard || false,
              standardCoinId: coin.id?.toString() || coin.standardCoinId?.toString() || "",
              shortName: coin.shortName || coin.ticker || "",
              coinType: coin.coinType || "",
              imageUrl: coin.imageUrl || coin.image || "",
              image: coin.image || coin.imageUrl || "",
              isApproved: coin.isApproved || false,
              mappedPartners: coin.mappedPartners || [],
            }));
            setCoins([...refreshedCoins]);
          }
        } catch (refreshError) {
          console.error("Error refreshing data:", refreshError);
        }
      }
    } catch (error) {
      console.error("Update notifications error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update notifications"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingCoin) return;
    if (!formData.standardCoinId) {
      toast.error("Standard Coin ID is required");
      return;
    }

    // Check if there are any fields to update
    const hasChanges = 
      formData.shortName || 
      formData.coinType || 
      formData.imageUrl;

    if (!hasChanges) {
      toast.error("No fields to update");
      return;
    }

    try {
      setIsLoading(true);
      const coinId = parseInt(editingCoin.id || formData.standardCoinId);
      if (isNaN(coinId)) {
        toast.error("Invalid coin ID");
        return;
      }

      const updateData = {
        coinId: coinId,
      };

      // Only include fields that have values
      if (formData.shortName) {
        updateData.shortName = formData.shortName;
      }
      if (formData.coinType) {
        updateData.coinType = formData.coinType;
      }
      if (formData.imageUrl) {
        updateData.image = formData.imageUrl;
      }

      const response = await swapAPI.updateStandardCoin(updateData);

      if (response && response.success) {
        // Close the dialog first
        setFormData({
          standardCoinId: "",
          shortName: "",
          coinType: "",
          imageUrl: "",
          name: "",
          symbol: "",
          network: "",
          exchange: "",
          isApproved: false,
        });
    setEditingCoin(null);
    setIsEditDialogOpen(false);
        toast.success(response.message || "Standard coin updated successfully");
        
        // Refetch the current page to ensure UI is in sync with backend
        // Use the same parameters as the main fetch
        const refreshParams = {
          searchTerm: debouncedSearch.trim(),
          isStandard: isStandardFilter !== null ? isStandardFilter : 1,
          page: currentPage,
          limit: 10,
        };
        
        try {
          setIsLoading(true);
          const refreshData = await swapAPI.searchSwapCoins(refreshParams);
          console.log("Refresh Data after update:", refreshData);
          
          if (refreshData && refreshData.success && refreshData.coins) {
            const refreshedCoins = refreshData.coins.map((coin, index) => ({
              id: coin.id || index + 1,
              name: coin.name || coin.ticker || "",
              symbol: coin.shortName || coin.symbol || "",
              network: coin.network || "",
              exchange: coin.swapPartner || coin.exchange || "",
              swapCount: Array.isArray(coin.mappedPartners) ? coin.mappedPartners.length : 0,
              isStandard: coin.isStandard || false,
              standardCoinId: coin.id?.toString() || coin.standardCoinId?.toString() || "",
              shortName: coin.shortName || coin.ticker || "",
              coinType: coin.coinType || "",
              imageUrl: coin.imageUrl || coin.image || "",
              image: coin.image || coin.imageUrl || "",
              isApproved: coin.isApproved || false,
              // Include mappedPartners for map modal
              mappedPartners: coin.mappedPartners || [],
            }));
            
            // Force update by setting coins with new array reference
            setCoins([...refreshedCoins]);
            
            // Update pagination if needed
            if (refreshData.pagination) {
              setPagination({
                currentPage: refreshData.pagination.currentPage || currentPage,
                totalPages: refreshData.pagination.totalPages || 1,
                totalCount: refreshData.pagination.totalCoins || refreshData.pagination.totalCount || 0,
                limit: refreshData.pagination.limit || 10,
                hasNextPage: refreshData.pagination.hasNextPage || false,
                hasPreviousPage: refreshData.pagination.hasPrevPage || refreshData.pagination.hasPreviousPage || false,
              });
            }
          }
        } catch (refreshError) {
          console.error("Error refreshing data:", refreshError);
          // Don't show error toast for refresh, as the update was successful
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update standard coin"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id) => {
    setCoins(coins.filter((coin) => coin.id !== id));
    toast.success("Coin removed from swaps");
  };

  const handleMap = (coin) => {
    setMappingCoin(coin);
    setSelectedCoins([]); // Reset selected coins when opening modal
    setMapSearchQuery("");
    setDebouncedMapSearch("");
    setMapSearchResults([]);
    setMapPagination({
      currentPage: 1,
      totalPages: 1,
      totalCoins: 0,
      limit: 20,
      hasNextPage: false,
      hasPrevPage: false,
    });
    setIsMapDialogOpen(true);
  };

  // Debounce map search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMapSearch(mapSearchQuery);
      setMapPagination((prev) => ({ ...prev, currentPage: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [mapSearchQuery]);

  // Fetch search results when search term is provided
  useEffect(() => {
    const fetchSearchResults = async () => {
      // Only fetch if modal is open AND there's a search term
      if (!isMapDialogOpen || !debouncedMapSearch.trim()) {
        if (!isMapDialogOpen) {
          setMapSearchResults([]);
        }
        return;
      }

      setIsMapSearchLoading(true);
      try {
        const params = {
          searchTerm: debouncedMapSearch.trim(),
          isStandard: mapIsStandard,
          page: mapPagination.currentPage,
          limit: mapPagination.limit,
        };

        const response = await swapAPI.searchSwapCoins(params);
        
        if (response && response.success) {
          const coins = response.coins || [];
          setMapSearchResults(coins);
          setMapPagination({
            currentPage: response.pagination?.currentPage || 1,
            totalPages: response.pagination?.totalPages || 1,
            totalCoins: response.pagination?.totalCoins || 0,
            limit: response.pagination?.limit || 20,
            hasNextPage: response.pagination?.hasNextPage || false,
            hasPrevPage: response.pagination?.hasPrevPage || false,
          });
        } else {
          setMapSearchResults([]);
        }
      } catch (error) {
        console.error("Error searching coins:", error);
        toast.error(
          error.response?.data?.message || "Failed to search coins"
        );
        setMapSearchResults([]);
      } finally {
        setIsMapSearchLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedMapSearch, mapIsStandard, mapPagination.currentPage, isMapDialogOpen]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Swap Coin
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Coins available for swapping
              </p>
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
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter coin name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Symbol</Label>
                    <Input
                      value={formData.symbol}
                      onChange={(e) =>
                        setFormData({ ...formData, symbol: e.target.value })
                      }
                      placeholder="Enter symbol"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Network</Label>
                    <Select
                      value={formData.network}
                      onValueChange={(value) =>
                        setFormData({ ...formData, network: value })
                      }
                    >
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
                    <Select
                      value={formData.exchange}
                      onValueChange={(value) =>
                        setFormData({ ...formData, exchange: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select exchange" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Changelly">Changelly</SelectItem>
                        <SelectItem value="EasyBit">EasyBit</SelectItem>
                        <SelectItem value="LetsExchange">
                          LetsExchange
                        </SelectItem>
                        <SelectItem value="ChangeNOW">ChangeNOW</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAdd} className="w-full">
                    Add Swap Coin
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-border">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Left Side — Title */}
                <CardTitle className="text-xl font-semibold">
                  Available Coins
                </CardTitle>

                {/* Right Side — Search + Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  {/* Search Input */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                      type="text"
                      placeholder="Search coins by name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  </div>

                  {/* Filter Button */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="gap-2 w-full sm:w-auto"
                      >
                        <Filter className="h-4 w-4" />
                        Filters
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Standard</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        checked={isStandardFilter === 1}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setIsStandardFilter(1);
                          } else if (isStandardFilter === 1) {
                            setIsStandardFilter(null);
                          }
                          setCurrentPage(1);
                        }}
                      >
                        Standard
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={isStandardFilter === 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setIsStandardFilter(0);
                          } else if (isStandardFilter === 0) {
                            setIsStandardFilter(null);
                          }
                          setCurrentPage(1);
                        }}
                      >
                        Non-Standard
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">Loading coins...</p>
                </div>
              ) : (
                <>
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
                          <div className="flex items-center gap-3">
                            {/* Coin Image */}
                            {coin.image || coin.imageUrl ? (
                              <img
                                src={coin.image || coin.imageUrl}
                                alt={coin.name}
                                className="w-12 h-12 rounded-full object-cover border"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  const placeholder =
                                    e.target.nextElementSibling;
                                  if (placeholder)
                                    placeholder.style.display = "flex";
                                }}
                              />
                            ) : null}

                            {/* Placeholder */}
                            <div
                              className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border"
                              style={{
                                display: coin.image || coin.imageUrl ? "none" : "flex",
                              }}
                            >
                              <span className="text-sm font-bold">
                                {coin.symbol?.[0]?.toUpperCase() || coin.name?.[0]?.toUpperCase() || "?"}
                              </span>
                            </div>

                            {/* Name + Symbol */}
                          <div>
                              <p className="font-semibold text-foreground text-base truncate max-w-[110px]">
                              {coin.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {coin.symbol}
                            </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="secondary">{coin.network}</Badge>
                        </td>
                        <td className="py-4 px-4 text-foreground">
                          {coin.exchange}
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-primary font-semibold">
                            {coin.swapCount}
                          </span>
                        </td>
                        {/* <td className="py-4 px-4">
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
                        </td> */}
                        <td className="py-4 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleMap(coin)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Map
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEdit(coin)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleNotification(coin)}
                              >
                                <Bell className="mr-2 h-4 w-4" />
                                Notifications
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
                {filteredCoins.map((coin) => (
                  <Card key={coin.id} className="border-border">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          {/* Coin Image */}
                          {coin.image || coin.imageUrl ? (
                            <img
                              src={coin.image || coin.imageUrl}
                              alt={coin.name}
                              className="w-12 h-12 rounded-full object-cover border"
                              onError={(e) => {
                                e.target.style.display = "none";
                                const placeholder =
                                  e.target.nextElementSibling;
                                if (placeholder)
                                  placeholder.style.display = "flex";
                              }}
                            />
                          ) : null}

                          {/* Placeholder */}
                          <div
                            className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border"
                            style={{
                              display: coin.image || coin.imageUrl ? "none" : "flex",
                            }}
                          >
                            <span className="text-sm font-bold">
                              {coin.symbol?.[0]?.toUpperCase() || coin.name?.[0]?.toUpperCase() || "?"}
                            </span>
                          </div>

                          {/* Name + Symbol */}
                          <div className="flex-1">
                            <p className="font-semibold text-foreground text-base truncate max-w-[110px]">
                            {coin.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {coin.symbol}
                          </p>
                        </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                              size="sm"
                              className="h-9 w-9 p-0"
                          >
                              <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleMap(coin)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Map
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(coin)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleNotification(coin)}>
                              <Bell className="mr-2 h-4 w-4" />
                              Notifications
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Network:{" "}
                          </span>
                          <Badge variant="secondary">{coin.network}</Badge>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Exchange:{" "}
                          </span>
                          <span className="text-foreground">
                            {coin.exchange}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Swaps: </span>
                          <span className="text-primary font-semibold">
                            {coin.swapCount}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
                </>
              )}
              
              {/* Pagination */}
              {coins.length > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground md:block hidden">
                    Showing {coins.length} of {pagination.totalCount} coins
                  </div>
                  <div className="flex justify-between w-full items-center gap-2 md:justify-start md:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={!pagination.hasPreviousPage || isLoading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(pagination.totalPages, prev + 1)
                        )
                      }
                      disabled={!pagination.hasNextPage || isLoading}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Update Standard Coin</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label>
                    Standard Coin ID<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={formData.standardCoinId}
                    readOnly
                    disabled
                    placeholder="Standard coin ID"
                    type="number"
                    className="bg-muted cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Short Name (Optional)</Label>
                  <Input
                    value={formData.shortName}
                    onChange={(e) =>
                      setFormData({ ...formData, shortName: e.target.value })
                    }
                    placeholder="Enter short name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Coin Type</Label>
                  <Select
                    value={formData.coinType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, coinType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">popular</SelectItem>
                      <SelectItem value="popular&stable">
                        popular&stable
                      </SelectItem>

                      <SelectItem value="other">other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
                <div className="flex items-center justify-between space-x-2 py-2">
                  <Label htmlFor="approval-toggle" className="text-sm font-medium">
                    Approval Status
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formData.isApproved ? "Approved" : "Disapproved"}
                    </span>
                    <Switch
                      id="approval-toggle"
                      checked={formData.isApproved}
                      onCheckedChange={handleApprovalToggle}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <Button onClick={handleUpdate} className="w-full">
                  Send Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Map Modal */}
          <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Map Coin</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                {/* Search Bar and Filter */}
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                      <Input
                        placeholder="Search coins by ticker, name, or network..."
                        value={mapSearchQuery}
                        onChange={(e) => setMapSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  <Select
                      value={mapIsStandard.toString()}
                      onValueChange={(value) => {
                        setMapIsStandard(parseInt(value));
                        setMapPagination((prev) => ({ ...prev, currentPage: 1 }));
                      }}
                    >
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Standard</SelectItem>
                        <SelectItem value="0">Non-Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                </div>
                
                {/* Dropdown Search Results - Full Width, Absolutely Positioned */}
                {debouncedMapSearch.trim() && (
                  <div className="absolute top-[70px] left-6 right-6 bg-background border border-border rounded-lg shadow-lg z-[60] max-h-[400px] overflow-y-auto">
                          {isMapSearchLoading ? (
                            <div className="p-4 text-center">
                              <p className="text-sm text-muted-foreground">
                                Searching...
                              </p>
                            </div>
                          ) : mapSearchResults && mapSearchResults.length > 0 ? (
                            <>
                              <div className="p-2 border-b border-border bg-secondary/30">
                                <div className="flex items-center justify-between">
                                  <p className="text-xs font-medium text-foreground">
                                    {mapPagination.totalCoins} results found
                                  </p>
                                  {mapPagination.totalPages > 1 && (
                                    <p className="text-xs text-muted-foreground">
                                      Page {mapPagination.currentPage} of {mapPagination.totalPages}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="divide-y divide-border">
                                {mapSearchResults.map((coin) => (
                                  <div
                                    key={coin.id}
                                    className="p-3 hover:bg-secondary/50 cursor-pointer transition-colors"
                                    onClick={() => {
                                      // Add coin to selected coins if not already selected
                                      setSelectedCoins((prev) => {
                                        const exists = prev.some((c) => c.id === coin.id);
                                        if (exists) return prev;
                                        return [...prev, coin];
                                      });
                                      setMapSearchQuery("");
                                      setDebouncedMapSearch("");
                                    }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2 flex-1 min-w-0">
                                        {coin.image && (
                                          <img
                                            src={coin.image}
                                            alt={coin.name || coin.ticker || "Coin"}
                                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                            onError={(e) => {
                                              e.target.style.display = "none";
                                            }}
                                          />
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-foreground truncate">
                                            {coin.name || "N/A"}
                                          </p>
                                          <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-xs text-muted-foreground">
                                              {coin.shortName || coin.ticker || "N/A"}
                                            </p>
                                            <Badge variant="secondary" className="text-xs">
                                              {coin.network || "N/A"}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs capitalize">
                                              {coin.coinType || "other"}
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3 ml-2">
                                        <span className="text-xs text-muted-foreground">
                                          {Array.isArray(coin.mappedPartners)
                                            ? coin.mappedPartners.length
                                            : 0}{" "}
                                          partners
                                        </span>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="flex-shrink-0"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            // Add coin to selected coins if not already selected
                                            setSelectedCoins((prev) => {
                                              const exists = prev.some((c) => c.id === coin.id);
                                              if (exists) return prev;
                                              return [...prev, coin];
                                            });
                                            setMapSearchQuery("");
                                            setDebouncedMapSearch("");
                                          }}
                                        >
                                          Map
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {mapPagination.totalPages > 1 && (
                                <div className="p-2 border-t border-border bg-secondary/30 flex items-center justify-between">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setMapPagination((prev) => ({
                                        ...prev,
                                        currentPage: prev.currentPage - 1,
                                      }))
                                    }
                                    disabled={!mapPagination.hasPrevPage}
                                  >
                                    Previous
                                  </Button>
                                  <span className="text-xs text-muted-foreground">
                                    Page {mapPagination.currentPage} of {mapPagination.totalPages}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setMapPagination((prev) => ({
                                        ...prev,
                                        currentPage: prev.currentPage + 1,
                                      }))
                                    }
                                    disabled={!mapPagination.hasNextPage}
                                  >
                                    Next
                                  </Button>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="p-4 text-center">
                              <p className="text-sm text-muted-foreground">
                                No coins found. Try a different search term.
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                {/* Coin Details */}
                {mappingCoin && (
                  <div className="space-y-4 border rounded-lg p-4 bg-secondary/50">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Current Coin Details
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground">
                            Coin Name
                          </Label>
                          <p className="font-medium text-foreground">
                            {mappingCoin.name}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            Symbol
                          </Label>
                          <p className="font-medium text-foreground">
                            {mappingCoin.symbol}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            Network
                          </Label>
                          <Badge variant="secondary">
                            {mappingCoin.network}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            Exchange
                          </Label>
                          <p className="font-medium text-foreground">
                            {mappingCoin.exchange}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Swaps</Label>
                          <p className="font-semibold text-primary">
                            {mappingCoin.swapCount}
                          </p>
                        </div>
                        {mappingCoin.standardCoinId && (
                          <div>
                            <Label className="text-muted-foreground">
                              Standard Coin ID
                            </Label>
                            <p className="font-medium text-foreground">
                              {mappingCoin.standardCoinId}
                            </p>
                          </div>
                        )}
                        {mappingCoin.shortName && (
                          <div>
                            <Label className="text-muted-foreground">
                              Short Name
                            </Label>
                            <p className="font-medium text-foreground">
                              {mappingCoin.shortName}
                            </p>
                          </div>
                        )}
                        {mappingCoin.coinType && (
                          <div>
                            <Label className="text-muted-foreground">
                              Coin Type
                            </Label>
                            <p className="font-medium text-foreground">
                              {mappingCoin.coinType}
                            </p>
                          </div>
                        )}
                        {mappingCoin.imageUrl && (
                          <div className="sm:col-span-2">
                            <Label className="text-muted-foreground">
                              Image URL
                            </Label>
                            <p className="font-medium text-foreground text-sm break-all">
                              {mappingCoin.imageUrl}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Mapped Partners Section */}
                    {mappingCoin.mappedPartners && Array.isArray(mappingCoin.mappedPartners) && mappingCoin.mappedPartners.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <h4 className="text-md font-semibold text-foreground mb-3">
                          Mapped Partners ({mappingCoin.mappedPartners.length})
                        </h4>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto">
                          {mappingCoin.mappedPartners.map((partner, index) => (
                            <div
                              key={index}
                              className="border border-border rounded-lg p-3 bg-background/50"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Swap Partner
                                  </Label>
                                  <p className="text-sm font-medium text-foreground capitalize">
                                    {partner.swapPartner || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Ticker
                                  </Label>
                                  <p className="text-sm font-medium text-foreground">
                                    {partner.ticker || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Name
                                  </Label>
                                  <p className="text-sm font-medium text-foreground">
                                    {partner.name || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Network
                                  </Label>
                                  <Badge variant="secondary" className="text-xs">
                                    {partner.network || "N/A"}
                                  </Badge>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Coin Type
                                  </Label>
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {partner.coinType || "other"}
                                  </Badge>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Requires Extra ID
                                  </Label>
                                  <p className="text-sm font-medium text-foreground">
                                    {partner.requiresExtraId ? "Yes" : "No"}
                                  </p>
                                </div>
                                {partner.payInNotifications && Array.isArray(partner.payInNotifications) && partner.payInNotifications.length > 0 && (
                                  <div className="sm:col-span-2">
                                    <Label className="text-xs text-muted-foreground">
                                      Pay In Notifications
                                    </Label>
                                    <div className="mt-1 space-y-1">
                                      {partner.payInNotifications.map((notif, idx) => (
                                        <p key={idx} className="text-xs text-foreground bg-secondary/30 p-2 rounded">
                                          {notif}
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {partner.payOutNotifications && Array.isArray(partner.payOutNotifications) && partner.payOutNotifications.length > 0 && (
                                  <div className="sm:col-span-2">
                                    <Label className="text-xs text-muted-foreground">
                                      Pay Out Notifications
                                    </Label>
                                    <div className="mt-1 space-y-1">
                                      {partner.payOutNotifications.map((notif, idx) => (
                                        <p key={idx} className="text-xs text-foreground bg-secondary/30 p-2 rounded">
                                          {notif}
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Selected Coins Table */}
                {selectedCoins.length > 0 && (
                  <div className="space-y-4 border rounded-lg p-4 bg-secondary/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground">
                        Selected Coins ({selectedCoins.length})
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCoins([])}
                      >
                        Clear All
                      </Button>
                    </div>
                    
                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                      {selectedCoins.map((coin, coinIndex) => (
                        <div
                          key={coin.id || coinIndex}
                          className="border border-border rounded-lg p-4 bg-background/50"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {coin.image && (
                                <img
                                  src={coin.image}
                                  alt={coin.name || coin.ticker || "Coin"}
                                  className="w-10 h-10 rounded-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              )}
                              <div>
                                <p className="font-semibold text-foreground">
                                  {coin.name || "N/A"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {coin.shortName || coin.ticker || "N/A"}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedCoins((prev) =>
                                  prev.filter((c) => c.id !== coin.id)
                                );
                              }}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs text-muted-foreground">
                                Network
                              </Label>
                              <Badge variant="secondary" className="text-xs">
                                {coin.network || "N/A"}
                              </Badge>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">
                                Swap Partner
                              </Label>
                              <p className="text-sm font-medium text-foreground capitalize">
                                {coin.swapPartner || "N/A"}
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">
                                Coin Type
                              </Label>
                              <Badge variant="outline" className="text-xs capitalize">
                                {coin.coinType || "other"}
                              </Badge>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">
                                Partners
                              </Label>
                              <p className="text-sm font-semibold text-primary">
                                {Array.isArray(coin.mappedPartners)
                                  ? coin.mappedPartners.length
                                  : 0}
                              </p>
                            </div>
                            {coin.standardCoinId && (
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  Standard Coin ID
                                </Label>
                                <p className="text-sm font-medium text-foreground">
                                  {coin.standardCoinId}
                                </p>
                              </div>
                            )}
                            {coin.id && (
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  Coin ID
                                </Label>
                                <p className="text-sm font-medium text-foreground">
                                  {coin.id}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          {/* Mapped Partners for this coin */}
                          {coin.mappedPartners && Array.isArray(coin.mappedPartners) && coin.mappedPartners.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <h5 className="text-sm font-semibold text-foreground mb-2">
                                Mapped Partners ({coin.mappedPartners.length})
                              </h5>
                              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                {coin.mappedPartners.map((partner, partnerIndex) => (
                                  <div
                                    key={partnerIndex}
                                    className="border border-border rounded p-2 bg-secondary/30"
                                  >
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <Badge variant="secondary" className="text-xs">
                                        {partner.swapPartner || "N/A"}
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs text-muted-foreground">
                                        {partner.ticker || "N/A"}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {partner.network || "N/A"}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
              
              {/* Fixed Footer with Buttons */}
              <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setIsMapDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (!mappingCoin) {
                      toast.error("No coin selected for mapping");
                      return;
                    }

                    if (selectedCoins.length === 0) {
                      toast.error("Please select at least one coin to merge");
                      return;
                    }

                    try {
                      setIsLoading(true);
                      const standardCoinId = parseInt(
                        mappingCoin.standardCoinId || mappingCoin.id
                      );

                      if (!standardCoinId || isNaN(standardCoinId)) {
                        toast.error("Invalid standard coin ID");
                        return;
                      }

                      const coinIds = selectedCoins
                        .map((coin) => coin.id)
                        .filter((id) => id && !isNaN(id))
                        .map((id) => parseInt(id));

                      if (coinIds.length === 0) {
                        toast.error("No valid coin IDs found");
                        return;
                      }

                      const response = await swapAPI.mergeCoinsToMapped({
                        standardCoinId: standardCoinId,
                        coinIds: coinIds,
                      });

                      if (response && response.success) {
                        toast.success(
                          response.message ||
                            `Successfully merged ${response.totalAdded || coinIds.length} partners`
                        );
                        
                        // Reset selected coins
                        setSelectedCoins([]);
                        
                        // Close modal
                        setIsMapDialogOpen(false);
                        
                        // Optionally refresh the current coin list
                        // You can add a refresh function here if needed
                      }
                    } catch (error) {
                      console.error("Merge error:", error);
                      toast.error(
                        error.response?.data?.message ||
                          "Failed to merge coins to mapped partners"
                      );
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={!mappingCoin || selectedCoins.length === 0 || isLoading}
                >
                  {isLoading ? "Saving..." : "Save Mapping"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Notification Modal */}
          <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Update Notifications</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label>
                    Standard Coin ID<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={notificationData.standardCoinId}
                    readOnly
                    disabled
                    placeholder="Standard coin ID"
                    type="number"
                    className="bg-muted cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Swap Partner<span className="text-destructive">*</span>
                  </Label>
                  {notificationCoin && notificationCoin.mappedPartners && notificationCoin.mappedPartners.length > 0 ? (
                    <Select
                      value={notificationData.swapPartner}
                      onValueChange={handlePartnerChange}
                  >
                    <SelectTrigger>
                        <SelectValue placeholder="Select partner" />
                    </SelectTrigger>
                    <SelectContent>
                        {notificationCoin.mappedPartners.map((partner) => (
                          <SelectItem key={partner.swapPartner} value={partner.swapPartner}>
                            {partner.swapPartner}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  ) : (
                    <Input
                      value={notificationData.swapPartner}
                      onChange={(e) =>
                        setNotificationData({ ...notificationData, swapPartner: e.target.value })
                      }
                      placeholder="e.g., changelly"
                    />
                  )}
                  <p className="text-xs text-muted-foreground">
                    The partner name in mappedPartners
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Pay In Notifications (JSON Array)</Label>
                  <textarea
                    value={notificationData.payInNotifications}
                    onChange={(e) =>
                      setNotificationData({ ...notificationData, payInNotifications: e.target.value })
                    }
                    placeholder='["Send exact amount", "Include memo if required"]'
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional - Array of pay-in notification strings
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Pay Out Notifications (JSON Array)</Label>
                  <textarea
                    value={notificationData.payOutNotifications}
                    onChange={(e) =>
                      setNotificationData({ ...notificationData, payOutNotifications: e.target.value })
                    }
                    placeholder='["Funds sent within 30 minutes", "Check your wallet"]'
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional - Array of pay-out notification strings
                  </p>
                </div>
                <Button 
                  onClick={handleUpdateNotifications} 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Request"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

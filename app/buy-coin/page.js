"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ShoppingCart,
  TrendingUp,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export default function BuyCoin() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFiat, setShowFiat] = useState(true);
  const [showCrypto, setShowCrypto] = useState(true);
  const [showStandard, setShowStandard] = useState(true);
  const [showNonStandard, setShowNonStandard] = useState(true);
  const [coins, setCoins] = useState([]);
  const [allFetchedCoins, setAllFetchedCoins] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchCoins = async () => {
      if (!showFiat && !showCrypto) {
        setAllFetchedCoins([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", "1");
        params.append("limit", "1000");

        const promises = [];

        if (showFiat && showStandard) {
          promises.push(
            fetch(
              `${API_BASE_URL}/buy/search-coins?isFiat=1&isStandard=1&${params.toString()}`
            )
              .then(async (res) => {
                if (!res.ok) {
                  const errorData = await res
                    .json()
                    .catch(() => ({ message: `HTTP ${res.status}` }));
                  return {
                    success: false,
                    error: errorData.message || "Request failed",
                    coins: [],
                  };
                }
                return res.json();
              })
              .catch((error) => {
                console.error("Error fetching fiat standard coins:", error);
                return { success: false, error: error.message, coins: [] };
              })
          );
        }
        if (showFiat && showNonStandard) {
          promises.push(
            fetch(
              `${API_BASE_URL}/buy/search-coins?isFiat=1&isStandard=0&${params.toString()}`
            )
              .then(async (res) => {
                if (!res.ok) {
                  const errorData = await res
                    .json()
                    .catch(() => ({ message: `HTTP ${res.status}` }));
                  return {
                    success: false,
                    error: errorData.message || "Request failed",
                    coins: [],
                  };
                }
                return res.json();
              })
              .catch((error) => {
                console.error("Error fetching fiat non-standard coins:", error);
                return { success: false, error: error.message, coins: [] };
              })
          );
        }
        if (showCrypto && showStandard) {
          promises.push(
            fetch(
              `${API_BASE_URL}/buy/search-coins?isFiat=0&isStandard=1&${params.toString()}`
            )
              .then(async (res) => {
                if (!res.ok) {
                  const errorData = await res
                    .json()
                    .catch(() => ({ message: `HTTP ${res.status}` }));
                  return {
                    success: false,
                    error: errorData.message || "Request failed",
                    coins: [],
                  };
                }
                return res.json();
              })
              .catch((error) => {
                console.error("Error fetching crypto standard coins:", error);
                return { success: false, error: error.message, coins: [] };
              })
          );
        }
        if (showCrypto && showNonStandard) {
          promises.push(
            fetch(
              `${API_BASE_URL}/buy/search-coins?isFiat=0&isStandard=0&${params.toString()}`
            )
              .then(async (res) => {
                if (!res.ok) {
                  const errorData = await res
                    .json()
                    .catch(() => ({ message: `HTTP ${res.status}` }));
                  return {
                    success: false,
                    error: errorData.message || "Request failed",
                    coins: [],
                  };
                }
                return res.json();
              })
              .catch((error) => {
                console.error(
                  "Error fetching crypto non-standard coins:",
                  error
                );
                return { success: false, error: error.message, coins: [] };
              })
          );
        }

        if (promises.length === 0) {
          setAllFetchedCoins([]);
          setIsLoading(false);
          return;
        }

        const results = await Promise.all(promises);

        let combinedCoins = [];
        let hasErrors = false;

        results.forEach((result) => {
          if (result.success && result.coins) {
            combinedCoins = [...combinedCoins, ...result.coins];
          } else if (result.error) {
            hasErrors = true;
            console.error("API Error:", result.error);
          }
        });

        if (hasErrors && combinedCoins.length === 0) {
          toast.error(
            "Failed to fetch coins. Please check your filters or try again."
          );
        }

        setAllFetchedCoins(combinedCoins);
      } catch (error) {
        console.error("Error fetching coins:", error);
        toast.error("Failed to fetch coins");
        setAllFetchedCoins([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoins();
  }, [showFiat, showCrypto, showStandard, showNonStandard]);

  useEffect(() => {
    let filteredCoins = [...allFetchedCoins];

    if (debouncedSearch && debouncedSearch.trim() !== "") {
      const searchLower = debouncedSearch.toLowerCase().trim();
      filteredCoins = filteredCoins.filter((coin) => {
        const ticker = (coin.ticker || "").toLowerCase();
        const name = (coin.name || "").toLowerCase();
        const network = (coin.network || "").toLowerCase();
        return (
          ticker.includes(searchLower) ||
          name.includes(searchLower) ||
          network.includes(searchLower)
        );
      });
    }

    if (debouncedSearch && debouncedSearch.trim() !== "") {
      const searchLower = debouncedSearch.toLowerCase().trim();
      filteredCoins.sort((a, b) => {
        const aTicker = (a.ticker || "").toLowerCase();
        const bTicker = (b.ticker || "").toLowerCase();
        const aName = (a.name || "").toLowerCase();
        const bName = (b.name || "").toLowerCase();

        if (aTicker === searchLower && bTicker !== searchLower) return -1;
        if (aTicker !== searchLower && bTicker === searchLower) return 1;

        if (aTicker.startsWith(searchLower) && !bTicker.startsWith(searchLower))
          return -1;
        if (!aTicker.startsWith(searchLower) && bTicker.startsWith(searchLower))
          return 1;

        if (aName.startsWith(searchLower) && !bName.startsWith(searchLower))
          return -1;
        if (!aName.startsWith(searchLower) && bName.startsWith(searchLower))
          return 1;

        return aTicker.localeCompare(bTicker);
      });
    }

    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    const paginatedCoins = filteredCoins.slice(startIndex, endIndex);

    setCoins(paginatedCoins);
    setPagination({
      currentPage: currentPage,
      totalPages: Math.ceil(filteredCoins.length / 10),
      totalCount: filteredCoins.length,
      limit: 10,
      hasNextPage: endIndex < filteredCoins.length,
      hasPreviousPage: currentPage > 1,
    });
  }, [allFetchedCoins, debouncedSearch, currentPage]);

  const parseMappedPartners = (mappedPartners) => {
    if (!mappedPartners || mappedPartners === "[]") return [];
    try {
      return typeof mappedPartners === "string"
        ? JSON.parse(mappedPartners)
        : mappedPartners;
    } catch {
      return [];
    }
  };

  // Refetch coins function
  const refetchCoins = async () => {
    if (!showFiat && !showCrypto) {
      setAllFetchedCoins([]);
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("limit", "1000");

      const promises = [];

      if (showFiat && showStandard) {
        promises.push(
          fetch(
            `${API_BASE_URL}/buy/search-coins?isFiat=1&isStandard=1&${params.toString()}`
          )
            .then(async (res) => {
              if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
                return { success: false, error: errorData.message || 'Request failed', coins: [] };
              }
              return res.json();
            })
            .catch((error) => {
              console.error('Error fetching fiat standard coins:', error);
              return { success: false, error: error.message, coins: [] };
            })
        );
      }
      if (showFiat && showNonStandard) {
        promises.push(
          fetch(
            `${API_BASE_URL}/buy/search-coins?isFiat=1&isStandard=0&${params.toString()}`
          )
            .then(async (res) => {
              if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
                return { success: false, error: errorData.message || 'Request failed', coins: [] };
              }
              return res.json();
            })
            .catch((error) => {
              console.error('Error fetching fiat non-standard coins:', error);
              return { success: false, error: error.message, coins: [] };
            })
        );
      }
      if (showCrypto && showStandard) {
        promises.push(
          fetch(
            `${API_BASE_URL}/buy/search-coins?isFiat=0&isStandard=1&${params.toString()}`
          )
            .then(async (res) => {
              if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
                return { success: false, error: errorData.message || 'Request failed', coins: [] };
              }
              return res.json();
            })
            .catch((error) => {
              console.error('Error fetching crypto standard coins:', error);
              return { success: false, error: error.message, coins: [] };
            })
        );
      }
      if (showCrypto && showNonStandard) {
        promises.push(
          fetch(
            `${API_BASE_URL}/buy/search-coins?isFiat=0&isStandard=0&${params.toString()}`
          )
            .then(async (res) => {
              if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
                return { success: false, error: errorData.message || 'Request failed', coins: [] };
              }
              return res.json();
            })
            .catch((error) => {
              console.error('Error fetching crypto non-standard coins:', error);
              return { success: false, error: error.message, coins: [] };
            })
        );
      }

      if (promises.length === 0) {
        setAllFetchedCoins([]);
        return;
      }

      const results = await Promise.all(promises);
      let combinedCoins = [];

      results.forEach((result) => {
        if (result.success && result.coins) {
          combinedCoins = [...combinedCoins, ...result.coins];
        }
      });

      setAllFetchedCoins(combinedCoins);
    } catch (error) {
      console.error("Error refetching coins:", error);
    }
  };

  // Delete standard coin handler
  const handleDeleteCoin = async (coin) => {
    // Only allow deletion of standard coins
    if (!coin.isStandard) {
      toast.error("Only standard coins can be deleted");
      return;
    }

    // Confirm deletion
    if (!confirm(`Are you sure you want to delete ${coin.name} (${coin.ticker})?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/buy/create-standard-coin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session-based auth
        body: JSON.stringify({
          action: "delete",
          standardCoinId: coin.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete coin");
      }

      if (data.success) {
        toast.success(data.message || "Coin deleted successfully");
        // Refetch coins to update the list
        await refetchCoins();
      } else {
        throw new Error(data.message || "Failed to delete coin");
      }
    } catch (error) {
      console.error("Error deleting coin:", error);
      toast.error(error.message || "Failed to delete coin");
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 p-2 md:p-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Buy Coin</h1>
            <p className="text-muted-foreground">
              Purchase cryptocurrency directly
            </p>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Available Coins</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col justify-end sm:flex-row gap-4">
                <div className="relative fl">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    type="text"
                    placeholder="Search coins by name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        checked={showFiat}
                        onCheckedChange={setShowFiat}
                      >
                      Fiat
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={showCrypto}
                        onCheckedChange={setShowCrypto}
                      >
                      Crypto
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuSeparator />
                    <DropdownMenuLabel>Standard</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        checked={showStandard}
                        onCheckedChange={setShowStandard}
                      >
                        Standard
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={showNonStandard}
                        onCheckedChange={setShowNonStandard}
                      >
                        Non-Standard
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Coin
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Network
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Buy Partner
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Partners
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        IsFiat
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-muted-foreground"
                        >
                          Loading coins...
                        </td>
                      </tr>
                    ) : coins.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-muted-foreground"
                        >
                          No coins found
                        </td>
                      </tr>
                    ) : (
                      coins.map((coin) => {
                        const mappedPartners = parseMappedPartners(
                          coin.mappedPartners
                        );
                        const partnerCount = coin.isStandard
                          ? mappedPartners.length
                          : coin.buyPartner
                          ? 1
                          : 0;

                        return (
                      <tr
                        key={coin.id}
                        className="border-b border-border hover:bg-secondary/50 transition-smooth"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {/* Coin Image */}
                                {coin.image ? (
                            <img
                                    src={coin.image}
                              alt={coin.name}
                              className="w-8 h-8 rounded-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                      const placeholder =
                                        e.target.nextElementSibling;
                                      if (placeholder)
                                        placeholder.style.display = "flex";
                                    }}
                                  />
                                ) : null}
                                <div
                                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                                  style={{
                                    display: coin.image ? "none" : "flex",
                                  }}
                                >
                                  <span className="text-xs font-bold">
                                    {coin.ticker?.[0] || "?"}
                                  </span>
                                </div>

                            {/* Name + Symbol */}
                            <div>
                              <p className="font-medium text-foreground">
                                {coin.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                    {coin.ticker}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                              <Badge variant="secondary">
                                {coin.network || "N/A"}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-foreground">
                              {coin.buyPartner || "N/A"}
                        </td>
                            <td className="py-4 px-4 text-foreground text-sm">
                              {partnerCount}
                        </td>
                        <td className="py-4 px-4">
                              <Badge
                                variant={coin.isFiat ? "default" : "outline"}
                              >
                                {coin.isFiat ? "Fiat" : "Crypto"}
                              </Badge>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  {coin.isStandard && (
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => handleDeleteCoin(coin)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading coins...
                  </div>
                ) : coins.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No coins found
                  </div>
                ) : (
                  coins.map((coin) => {
                    const mappedPartners = parseMappedPartners(
                      coin.mappedPartners
                    );
                    const partnerCount = coin.isStandard
                      ? mappedPartners.length
                      : coin.buyPartner
                      ? 1
                      : 0;

                    return (
                      <Card
                        key={coin.id}
                        className="border-border overflow-hidden"
                      >
                        <CardContent className="p-4 space-y-4">
                          {/* Top Section - Logo + Name + Badge + Menu */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {/* Coin Image */}
                              {coin.image ? (
                                <img
                                  src={coin.image}
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
                                  display: coin.image ? "none" : "flex",
                                }}
                              >
                                <span className="text-sm font-bold">
                                  {coin.ticker?.[0] || "?"}
                                </span>
                              </div>

                              {/* Name + Ticker */}
                        <div>
                                <p className="font-semibold text-foreground text-base truncate max-w-[110px]">
                            {coin.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                                  {coin.ticker}
                          </p>
                        </div>
                            </div>

                            {/* Right side — Network badge + menu */}
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {coin.network || "N/A"}
                              </Badge>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-2 h-8 w-8"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" /> View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                  </DropdownMenuItem>
                                  {coin.isStandard && (
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => handleDeleteCoin(coin)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          {/* Info Section */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex flex-col">
                              <span className="text-muted-foreground">
                                Buy Partner
                              </span>
                              <span className="font-medium text-foreground">
                                {coin.buyPartner || "N/A"}
                              </span>
                      </div>

                            <div className="flex flex-col">
                              <span className="text-muted-foreground">
                                Partners
                              </span>
                              <span className="font-medium">
                                {partnerCount}
                          </span>
                        </div>

                            <div className="flex flex-col">
                              <span className="text-muted-foreground">
                                Type
                              </span>
                              <Badge
                                variant={coin.isFiat ? "default" : "outline"}
                                className="w-fit text-xs"
                              >
                                {coin.isFiat ? "Fiat" : "Crypto"}
                              </Badge>
                            </div>

                            <div className="flex flex-col">
                              <span className="text-muted-foreground">
                                Standard
                              </span>
                              <span className="font-medium">
                                {coin.isStandard ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                    );
                  })
                )}
              </div>

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
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

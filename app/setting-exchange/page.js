"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Copy } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import * as settingsAPI from "@/api/settings";

const exchanges = [
  {
    name: "Changelly",
    slack: "https://google.com",
    gmail: "https://google.com",
    telegram: "https://google.com",
  },
  {
    name: "Changenow",
    slack: "https://google.com",
    gmail: "support@chang...",
    telegram: "https://google.com",
  },
  {
    name: "Changehero",
    slack: "https://google.com",
    gmail: "https://google.com",
    telegram: "https://google.com",
  },
  {
    name: "Exolix",
    slack: "https://google.com",
    gmail: "https://google.com",
    telegram: "https://google.com",
  },
  {
    name: "Godex",
    slack: "https://google.com",
    gmail: "https://google.com",
    telegram: "https://google.com",
  },
  {
    name: "Stealthex",
    slack: "https://google.com",
    gmail: "https://google.com",
    telegram: "https://google.com",
  },
  {
    name: "Letsexchange",
    slack: "https://google.com",
    gmail: "https://google.com",
    telegram: "https://google.com",
  },
  {
    name: "Simpleswap",
    slack: "https://google.com",
    gmail: "https://google.com",
    telegram: "https://google.com",
  },
];

export default function SettingExchange() {
  const [sendCoin, setSendCoin] = useState("XMR");
  const [getCoin, setGetCoin] = useState("BTC");
  const [amount, setAmount] = useState("0.1");
  const [cronData, setCronData] = useState({
    second: "5",
    minute: "*",
    hour: "*",
    dayOfMonth: "*",
    month: "*",
    dayOfWeek: "*",
  });
  const [selectedGiveaway, setSelectedGiveaway] = useState([]);
  const [tagline, setTagline] = useState("Featured Exchange");
  const [visibility, setVisibility] = useState({});
  const [allSettings, setAllSettings] = useState([]);
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const generatedURL = `https://www.coinoswap.com/?to=${getCoin}&toNetwork=${getCoin}&from=${sendCoin}&fromNetwork=${sendCoin}&sell=${sendCoin}&amount=${amount}&direction=direct`;

  useEffect(() => {
    loadAllSettings();
  }, []);

  useEffect(() => {
    if (allSettings.length > 0) {
      loadSettingsData();
    }
  }, [allSettings]);

  const loadAllSettings = async () => {
    try {
      setIsLoading(true);
      const response = await settingsAPI.getAllSettings();
      if (response.success) {
        setAllSettings(response.settings || []);
        console.log("Settings loaded:", response.settings);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error(error.response?.data?.message || "Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const safeParse = (value) => {
    if (!value) return null;
    if (typeof value !== "string") return value;

    try {
      let trimmed = value.trim();
      
      // If it doesn't start with { or [, but looks like object properties, wrap it
      if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
        // Check if it looks like object properties (contains "key": pattern)
        if (trimmed.includes('":')) {
          trimmed = "{" + trimmed + "}";
          console.log("Reconstructed JSON:", trimmed);
        } else {
          return null;
        }
      }

      let parsed = JSON.parse(trimmed);

      // Handle double-encoded JSON
      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }
      
      console.log("Parsed successfully:", parsed);
      return parsed;
    } catch (e) {
      console.error("Error parsing JSON:", e, "Original value:", value);
      return null;
    }
  };

  const loadSettingsData = () => {
    // DEFAULT PAIRS
    const defaultPairs = allSettings.find((s) => s.key === "default_pairs");
    if (defaultPairs) {
      const value = safeParse(defaultPairs.value);
      if (value) {
        setSendCoin(value.sendCoin || sendCoin);
        setGetCoin(value.getCoin || getCoin);
        setAmount(value.amount || amount);
      }
    }

    // CRON JOB
    const cronJob = allSettings.find((s) => s.key === "cron_job");
    if (cronJob) {
      const value = safeParse(cronJob.value);
      if (value) setCronData(value);
    }

    // GIVEAWAY
    const giveaway = allSettings.find((s) => s.key === "giveaway");
    if (giveaway) {
      const value = safeParse(giveaway.value);
      if (value) {
        setSelectedGiveaway(value.selected || []);
        setTagline(value.tagline || "Featured Exchange");
      }
    }

    // EXCHANGE VISIBILITY
    const exchangeVisibility = allSettings.find(
      (s) => s.key === "exchange_visibility"
    );
    if (exchangeVisibility) {
      const value = safeParse(exchangeVisibility.value);
      if (value) setVisibility(value);
    }

    // PARTNERS - Collect from all settings that contain partner data
    let partnersData = [];

    // Look for settings with partner-like data
    allSettings.forEach((setting) => {
      console.log("Processing setting:", setting.key, setting.value);
      let value = safeParse(setting.value);
      
      console.log("Parsed value:", value);
      
      if (value) {
        // If it's an array of partners
        if (Array.isArray(value)) {
          console.log("Found array of partners:", value);
          partnersData.push(...value);
        } 
        // If it's an object with a nested 'value' property (like exolix structure)
        else if (
          typeof value === "object" &&
          value.value &&
          typeof value.value === "object" &&
          (value.value.name || value.value.isEnabled !== undefined || value.value.hasGiveAway !== undefined)
        ) {
          console.log("Found nested partner object:", value.value);
          partnersData.push(value.value);
        }
        // If it's a single partner object with expected properties
        else if (
          typeof value === "object" &&
          (value.name || value.isEnabled !== undefined || value.hasGiveAway !== undefined)
        ) {
          console.log("Found single partner object:", value);
          partnersData.push(value);
        }
      }
    });

    console.log("All collected partners (before dedup):", partnersData);

    // Remove duplicates based on name - keep latest version
    const uniquePartnersMap = new Map();
    partnersData.forEach((p) => {
      // Always update to the latest version (last one wins)
      if (p.name) {
        uniquePartnersMap.set(p.name.toLowerCase(), p);
      }
    });

    const uniquePartners = Array.from(uniquePartnersMap.values());

    console.log("Unique partners (after dedup):", uniquePartners);
    setPartners(uniquePartners);
  };

  const saveSetting = async (key, value, type = "object") => {
    try {
      // When type is 'object', send the value as an object, not a JSON string
      let settingValue = value;
      
      // Only stringify if type is 'string'
      if (type === "string" && typeof value === "object") {
        settingValue = JSON.stringify(value);
      }

      console.log("Saving setting:", { key, value: settingValue, type });

      const response = await settingsAPI.upsertSetting({
        key,
        value: settingValue,
        type,
      });
      
      if (response.success) {
        toast.success(
          response.message || `Setting '${key}' saved successfully`
        );
        await loadAllSettings();
        return true;
      }
    } catch (error) {
      console.error(`Error saving setting ${key}:`, error);
      console.error("Error response:", error.response?.data);
      toast.error(
        error.response?.data?.message || `Failed to save setting ${key}`
      );
      return false;
    }
  };

  const handleCopyURL = () => {
    navigator.clipboard.writeText(generatedURL);
    toast.success("URL copied to clipboard");
  };

  const toggleGiveaway = (exchange) => {
    setSelectedGiveaway((prev) =>
      prev.includes(exchange)
        ? prev.filter((e) => e !== exchange)
        : [...prev, exchange]
    );
  };

  const handleSaveDefaultPairs = async () => {
    await saveSetting(
      "default_pairs",
      {
        sendCoin,
        getCoin,
        amount,
      },
      "string"
    );
  };

  const handleSaveCronJob = async () => {
    await saveSetting("cron_job", cronData, "string");
  };

  const handleSaveGiveaway = async () => {
    await saveSetting(
      "giveaway",
      {
        selected: selectedGiveaway,
        tagline,
      },
      "string"
    );
  };

  const handleTogglePartnerEnabled = async (partnerName, currentValue) => {
    const updatedPartners = partners.map((partner) => {
      if (partner.name === partnerName) {
        return { ...partner, isEnabled: !currentValue };
      }
      return partner;
    });
    setPartners(updatedPartners);
    await saveSetting("partners", updatedPartners, "string");
  };

  const handleTogglePartnerGiveaway = async (partnerName, currentValue) => {
    const updatedPartners = partners.map((partner) => {
      if (partner.name === partnerName) {
        return { ...partner, hasGiveAway: !currentValue };
      }
      return partner;
    });
    setPartners(updatedPartners);
    await saveSetting("partners", updatedPartners, "string");
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Exchange
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage exchange settings and configurations
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Exchange Settings */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Exchange Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                          Exchange
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                          Slack
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                          Gmail
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                          Telegram
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {exchanges.map((exchange) => (
                        <tr
                          key={exchange.name}
                          className="border-b border-border"
                        >
                          <td className="py-3 px-2 text-foreground">
                            {exchange.name}
                          </td>
                          <td className="py-3 px-2 text-xs text-muted-foreground truncate max-w-[100px]">
                            {exchange.slack}
                          </td>
                          <td className="py-3 px-2 text-xs text-muted-foreground truncate max-w-[100px]">
                            {exchange.gmail}
                          </td>
                          <td className="py-3 px-2 text-xs text-muted-foreground truncate max-w-[100px]">
                            {exchange.telegram}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden space-y-3">
                  {exchanges.map((exchange) => (
                    <Card key={exchange.name} className="border-border">
                      <CardContent className="p-3 space-y-2">
                        <p className="font-medium text-foreground">
                          {exchange.name}
                        </p>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium">Slack:</span>{" "}
                            {exchange.slack}
                          </div>
                          <div>
                            <span className="font-medium">Gmail:</span>{" "}
                            {exchange.gmail}
                          </div>
                          <div>
                            <span className="font-medium">Telegram:</span>{" "}
                            {exchange.telegram}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Button className="w-full mt-4">Update All Exchanges</Button>
              </CardContent>
            </Card>

            {/* Exchange Visibility / Partners */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Exchange Visibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading partners...
                  </div>
                ) : partners.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No partners found
                  </div>
                ) : (
                  <div className="space-y-3">
                    {partners.map((partner) => (
                      <div
                        key={partner.name}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2 border-b border-border"
                      >
                        <span className="text-sm sm:text-base text-foreground capitalize">
                          {partner.name}
                        </span>
                        <div className="flex gap-4 items-center flex-wrap">
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor={`enabled-${partner.name}`}
                              className="text-xs text-muted-foreground"
                            >
                              Enabled
                            </Label>
                            <Switch
                              id={`enabled-${partner.name}`}
                              checked={partner.isEnabled || false}
                              onCheckedChange={() =>
                                handleTogglePartnerEnabled(
                                  partner.name,
                                  partner.isEnabled || false
                                )
                              }
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor={`giveaway-${partner.name}`}
                              className="text-xs text-muted-foreground"
                            >
                              Giveaway
                            </Label>
                            <Switch
                              id={`giveaway-${partner.name}`}
                              checked={partner.hasGiveAway || false}
                              onCheckedChange={() =>
                                handleTogglePartnerGiveaway(
                                  partner.name,
                                  partner.hasGiveAway || false
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Default Pairs */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Default Pairs
                </CardTitle>
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
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.1"
                  />
                </div>
                <Button className="w-full" onClick={handleSaveDefaultPairs}>
                  Update
                </Button>
                <div className="space-y-2">
                  <Label>URL</Label>
                  <div className="flex gap-2">
                    <Input value={generatedURL} readOnly className="text-xs" />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleCopyURL}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Refresh Buttons */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Refresh Buttons
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 bg-secondary/50 rounded-lg">
                  <span className="text-sm sm:text-base text-foreground">
                    Approved Coins Short Names Refresh
                  </span>
                  <Button className="gap-2 w-full sm:w-auto">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 bg-secondary/50 rounded-lg">
                  <span className="text-sm sm:text-base text-foreground">
                    UnApproved Coins Short Names Refresh
                  </span>
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
                    <Input
                      value={cronData.second}
                      onChange={(e) =>
                        setCronData({ ...cronData, second: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Minute</Label>
                    <Input
                      value={cronData.minute}
                      onChange={(e) =>
                        setCronData({ ...cronData, minute: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hour</Label>
                    <Input
                      value={cronData.hour}
                      onChange={(e) =>
                        setCronData({ ...cronData, hour: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of month</Label>
                    <Input
                      value={cronData.dayOfMonth}
                      onChange={(e) =>
                        setCronData({ ...cronData, dayOfMonth: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Input
                      value={cronData.month}
                      onChange={(e) =>
                        setCronData({ ...cronData, month: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Day of week</Label>
                    <Input
                      value={cronData.dayOfWeek}
                      onChange={(e) =>
                        setCronData({ ...cronData, dayOfWeek: e.target.value })
                      }
                    />
                  </div>
                </div>
                <Button className="w-full" onClick={handleSaveCronJob}>
                  Save
                </Button>
              </CardContent>
            </Card>

            {/* GiveAway */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">GiveAway</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base">
                    Select Giveaway Option
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={
                        selectedGiveaway.includes("NO GIVEAWAY")
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleGiveaway("NO GIVEAWAY")}
                    >
                      NO GIVEAWAY
                    </Badge>
                    {[
                      "CHANGELY",
                      "CHANGENOW",
                      "CHANGEHERO",
                      "GODEX",
                      "LETSEXCHANGE",
                      "SIMPLESWAP",
                      "STEALTHEX",
                      "EASYBIT",
                    ].map((ex) => (
                      <Badge
                        key={ex}
                        variant={
                          selectedGiveaway.includes(ex) ? "default" : "outline"
                        }
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
                  <Input
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={handleSaveGiveaway}>
                  Save
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
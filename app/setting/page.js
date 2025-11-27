"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/store/hook";
import { changePassword, enable2FA, verify2FA, disable2FA, clear2FASetup, getSession, logoutAdmin } from "@/redux/slices/authSlice";
import { useAuth } from "@/contexts/AuthContext";
import { Shield } from "lucide-react";

export default function Setting() {
  const dispatch = useAppDispatch();
  const { logout } = useAuth();
  const { admin, requires2FA, twoFA } = useAppSelector((state) => state.auth);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const is2FAEnabled = admin?.twoFactorEnabled || false;
  const [twoFACode, setTwoFACode] = useState("");
  const [disablePassword, setDisablePassword] = useState("");
  const [disableCode, setDisableCode] = useState("");

  // ----------------------- AUTO ENABLE 2FA ON MOUNT -----------------------
  useEffect(() => {
    dispatch(clear2FASetup());
    
    dispatch(getSession()).then((result) => {
      if (getSession.fulfilled.match(result)) {
        const current2FAStatus = result.payload.admin?.twoFactorEnabled || false;
        
        if (!current2FAStatus) {
          setTimeout(() => {
            handleEnable2FA();
          }, 100);
        }
      }
    });
  }, []); 

  // ----------------------- CHANGE PASSWORD -----------------------
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (is2FAEnabled && !twoFactorCode) {
      toast.error("2FA code is required");
      setShow2FA(true);
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(
        changePassword({
          currentPassword: oldPassword,
          newPassword,
          twoFactorCode: is2FAEnabled ? twoFactorCode : null,
        })
      );

      if (changePassword.fulfilled.match(result)) {
        toast.success("Password changed successfully. Please login again.");
        setOldPassword("");
        setNewPassword("");
        setTwoFactorCode("");
        setShow2FA(false);
        
        // Logout immediately after password change
        setTimeout(() => {
          logout();
        }, 1000); // Small delay to show success message
      } else {
        const errorMessage =
          result.payload?.message || "Password change failed";
        if (result.payload?.requires2FA) {
          setShow2FA(true);
          toast.error(errorMessage);
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      toast.error("An error occurred while changing password");
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------- ENABLE 2FA -----------------------
  const handleEnable2FA = async () => {
    try {
      const result = await dispatch(enable2FA());
      
      if (enable2FA.fulfilled.match(result)) {
        toast.success("Scan the QR code with your authenticator app");
      } else {
        const errorMessage = result.payload?.message || "Failed to enable 2FA";
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("An error occurred while enabling 2FA");
    }
  };

  // ----------------------- VERIFY 2FA -----------------------
  const handleVerify2FA = async () => {
    if (!twoFACode || twoFACode.length !== 6) {
      toast.error("Enter a valid 6-digit 2FA code");
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(verify2FA({ twoFactorCode: twoFACode }));
      
      if (verify2FA.fulfilled.match(result)) {
        toast.success("2FA enabled successfully");
        setTwoFACode("");
        dispatch(clear2FASetup());
        // Refresh session to get updated 2FA status
        dispatch(getSession());
      } else {
        const errorMessage = result.payload?.message || "Invalid 2FA code";
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("An error occurred while verifying 2FA");
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------- DISABLE 2FA -----------------------
  const handleDisable2FA = async () => {
    if (!disablePassword) {
      toast.error("Password is required");
      return;
    }

    if (is2FAEnabled && !disableCode) {
      toast.error("2FA code is required");
      return;
    }

    if (disableCode && disableCode.length !== 6) {
      toast.error("Enter a valid 6-digit 2FA code");
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(disable2FA({
        password: disablePassword,
        twoFactorCode: is2FAEnabled ? disableCode : null,
      }));
      
      if (disable2FA.fulfilled.match(result)) {
        toast.success("2FA disabled successfully");
        setDisablePassword("");
        setDisableCode("");
        // Refresh session to get updated 2FA status
        dispatch(getSession()).then(() => {
          // After disable, automatically call enable2FA to show QR code again
          setTimeout(() => {
            handleEnable2FA();
          }, 500);
        });
      } else {
        const errorMessage = result.payload?.message || "Failed to disable 2FA";
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("An error occurred while disabling 2FA");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Setting
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your security settings
            </p>
          </div>

          {/* TWO BOXES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* ----------------- LEFT BOX: CHANGE PASSWORD ----------------- */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Change Password
                </CardTitle>
              </CardHeader>

              <CardContent>
                <form
                  onSubmit={handlePasswordChange}
                  className="space-y-3 sm:space-y-4"
                >
                  {/* Old Password */}
                  <div className="space-y-2">
                    <Label>Old Password</Label>
                    <Input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter your old password"
                    />
                  </div>

                  {/* New */}
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                    />
                  </div>

                  {/* Confirm */}
                  {/* <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                    />
                  </div> */}

                  {show2FA && is2FAEnabled && (
                    <div className="space-y-2">
                      <Label>2FA Code</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="123456"
                          maxLength={6}
                          value={twoFactorCode}
                          onChange={(e) =>
                            setTwoFactorCode(e.target.value.replace(/\D/g, ""))
                          }
                          className="pl-10"
                        />
                      </div>
                  </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* ----------------- RIGHT BOX: GOOGLE VERIFICATION ----------------- */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Google Verification (2FA)
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6">
                {/* SWITCH */}
                <div className="flex items-center justify-between">
                  <Label className="text-sm sm:text-base">
                    Enable Two-Factor Authentication
                  </Label>
                  <Switch
                    checked={is2FAEnabled}
                    disabled={true}
                  />
                </div>

                {/* ----------- IF NOT ENABLED → SHOW ENABLE FLOW ----------- */}
                {!is2FAEnabled && (
                  <>
                    {!twoFA.qrCode ? (
                      <Button 
                        className="w-full" 
                        onClick={handleEnable2FA}
                        disabled={twoFA.isEnabling}
                      >
                        {twoFA.isEnabling ? "Generating..." : "Enable 2FA"}
                      </Button>
                    ) : (
                      <>
                        {/* QR Code */}
                        <div className="flex">
                          <img
                            src={twoFA.qrCode}
                            alt="QR Code"
                            className="w-40 h-40 rounded border border-border"
                          />
                        </div>

                        {/* Secret Key */}
                        <div className="space-y-2">
                          <Label className="font-medium">Secret</Label>
                          <Input
                            value={twoFA.secret || ""}
                            readOnly
                            className="bg-muted"
                          />
                        </div>

                        {/* Enter 6-Digit Code */}
                        <div className="space-y-2">
                          <Label className="font-medium">Enter 6-digit Code</Label>
                          <div className="relative">
                            <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              maxLength={6}
                              placeholder="123456"
                              value={twoFACode}
                              onChange={(e) =>
                                setTwoFACode(e.target.value.replace(/\D/g, ""))
                              }
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <Button 
                          className="w-full" 
                          onClick={handleVerify2FA}
                          disabled={isLoading || !twoFACode || twoFACode.length !== 6}
                        >
                          {isLoading ? "Verifying..." : "Verify & Enable 2FA"}
                        </Button>
                      </>
                    )}
                  </>
                )}

                {/* ----------- IF ENABLED → SHOW DISABLE FLOW ----------- */}
                {is2FAEnabled && (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm sm:text-base">Password</Label>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={disablePassword}
                        onChange={(e) => setDisablePassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm sm:text-base">
                        Enter 2FA Code to Disable
                      </Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          maxLength={6}
                          placeholder="123456"
                          value={disableCode}
                          onChange={(e) =>
                            setDisableCode(e.target.value.replace(/\D/g, ""))
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={handleDisable2FA}
                      disabled={isLoading || !disablePassword || !disableCode || disableCode.length !== 6}
                    >
                      {isLoading ? "Disabling..." : "Disable 2FA"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

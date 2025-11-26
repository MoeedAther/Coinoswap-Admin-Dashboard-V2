import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const Setting = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const [twoFACode, setTwoFACode] = useState("");
  const [disableCode, setDisableCode] = useState("");

  // ----------------------- CHANGE PASSWORD -----------------------
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    toast.success("Password changed successfully");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // ----------------------- ENABLE 2FA -----------------------
  const handleEnable2FA = () => {
    if (!twoFACode || twoFACode.length !== 6) {
      toast.error("Enter a valid 6-digit 2FA code");
      return;
    }

    setIs2FAEnabled(true);
    toast.success("2FA enabled successfully");
  };

  // ----------------------- DISABLE 2FA -----------------------
  const handleDisable2FA = () => {
    if (!disableCode || disableCode.length !== 6) {
      toast.error("Enter the 6-digit code to disable 2FA");
      return;
    }

    setIs2FAEnabled(false);
    setDisableCode("");
    setTwoFACode("");
    toast.success("2FA disabled successfully");
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Setting</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your security settings</p>
        </div>

        {/* TWO BOXES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* ----------------- LEFT BOX: CHANGE PASSWORD ----------------- */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Change Password</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-3 sm:space-y-4">
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
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* ----------------- RIGHT BOX: GOOGLE VERIFICATION ----------------- */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Google Verification (2FA)</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 sm:space-y-6">
              {/* SWITCH */}
              <div className="flex items-center justify-between">
                <Label className="text-sm sm:text-base">Enable Two-Factor Authentication</Label>
                <Switch
                  checked={is2FAEnabled}
                  onCheckedChange={(checked) => {
                    if (!checked) {
                      // User trying to disable; show disable box
                      setIs2FAEnabled(true);
                    }
                  }}
                />
              </div>

              {/* ----------- IF NOT ENABLED → SHOW ENABLE FLOW ----------- */}
              {!is2FAEnabled && (
                <>
                  {/* QR Code */}
                  <div className="flex justify-start">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAYFBMVEX///8AAADk5ORpaWnGxsYuLi7T09Py8vIVFRUcHBy5ubl8fHzn5+f4+PhVVVWrq6uenp7c3NyWlpaFhYVHR0c1NTUmJiZubm4ICAhgYGA8PDxMTExzc3OQkJCzs7OlpaXZnYKBAAAJx0lEQVR4nO2d62KyvBKFFTkIchRFUQ73f5e7Zob3Y9FpDFRb6876Rw6Ep9ghTCbDamVlZWVl9dJKfHemYuroaJo4MAS3LKTh47mj+4kGxmkqb54i+iPk4ddNchiiVyNUpTR8NHPwqnGk0wwwm/U8nRlmr2mDMDkV7kSY88zhNw+F2T4WZmthLIwGptW06X8XZnva3VPpAUzUCG1Svm6w9znVZRoYr7w7/GlrDOMVwT2t0jHMKpHa9AQTXo7/qcqoTnxAMEy6ujt84ZnDxJo2LIQRlUm/DPGWTGHuKrYwX8rCWBhJC2AkOzJwijBBrJokAFMdLh86VLNhYtGMLoWR/rLrQgNzoiYuwPBDs58LU4jDL4ap5sKUEgxPZ/KHwFQWxsK8FczunWDa7W0yuXVp3pkPMMqkTmDA3iavCJMorXZhdVNIHULvduCFAOOeq/+03ScvCMPaSf3WCAOFFsbCWJgv1b0TzL64yYnS+qbD34a5KIi0dRRT97dhWOw3cy2MhXkrmPD1YMLFMOnhsy6OBiaIbwrKi2pKA669q3CWlmFUy0svwTgXYfh0MUzsCEo0MPkh/dAhunWMY570t4FwFvayJHCEMIk0+nBlP+A3w5czfojkQm9Zr+UE1L02G8jCfCkLM9IrwhwNBq4lmIYu36ejYRZpcDYSw9QGTY/GMOaarDbzLdnBLeEbxG9luEArPjTNZWEsjIX5TZjzY2EeG9V0WodztK2mMMo9W25V7RRG1eXUsaSjCUy1nTX8+qSDSQp/pgKASZvThzYR1cUAc6W6jOqize2oSQEmmDt6oYsEXKpJVJMLlbjorHMCvoYsjIX5Ab0mjBQNoS2kq0hy7xaFcQk1MJVq4XXUz+VDgElwCIML1TbJypEaHiLbjUvZ4OZ0xLP9IlIx07UGpqRIwJ767TkuEGB8qjN4AQpa1TLT0Tg13H2GOUEh+82udNRBf3w5QxhuqZsB8AvQ9T5MTP7JesZ0hmEaCcbgTRNhzOdmj33TtDAW5qkwogFAGO4vGgCe+/tQ2EFLDjsrEYaOIjp6kAEYZs0XAcbrqbJV893ahVlzV6spcUdz2b1qMiinlrk6aHgV80hz6D2dM2tuPTbc0q1Pd7TZmc+ak1SAufCPp4YbxB3ElzMWBgKh+NfWheMb5EgtUQfzKUNw/SkY/rV19KtpjWGuJrMEC2Nhfg6GJ7Or8bVNYMC3PsCwTUZbbgDDNplh4vswxxnvDGz4GjKERwmGzGfjA0yqCmuy0H4rwbRUx48bstA12eSiowF5hFSZ7SKj4WvwZLhkofcGyxWDYLV5AkOSdwMaxGjKgUDgN+PFAJceeg3cC35oamcAE0EcgAgj7zlbDAMeTS2MwXTGwliYX4Y5/lGYJOtv4ulfWKrDjDtG/UgZv934+agwdyQYn+p8gEmzcWFBA+0lmMN4hL4NjWGCy/gvVPn3e4jSrTYzjLj5PJZgRBnBXH8VxrEwFuavwpxvWodLYXQhWnoYNW76D+b8WfNhcqVenJpG2VhsoV0obO7DpHQaTuxRcEcal71YTp9/Ur+fYZoZRtcGfolnfhTii8z6Pgyrne1rNn9o4pumrHR8MRU7xcqFME9xAloYC/NzMINHU9cGH0UMY24AfKnJDF8zWTOtrzmIyPSxdwZMc+Kqo/0Qg0xWtAYYMs1dKl2pD8YVvVEbLqVzsk0O9qrMhd9H0tI1UUtXuwy4WY8eSfjQDHb0LMOUUXuAYYl+s/1aeOqNBzpPAiALGm8HF5xQoYnfTIxqqv7BKCFMawwj+s1Q7QRGaQqjdDXwm/0dmLe6MxbmQ2eEQWvIBkDc34Aw/X2YqQFQKvHfg2Hm/8+wfwJcCVk2PurJNIe7bOzJYJgN+Seoe4ahESxyaGQNR2fTOSOASfPRiNngo6bC6I5pHgsiNES/2US6GE1RwzIgOLW0CUFAi5fOnwKD6zMWxsK8CQwZANHX/F2YHzAAW4qwSBlGBVxsdj7ASFEUKTfpqX/P63hfB1zUGcBcaHGvpLCNiPqlsH53ppXCjXkaPe3yp7RAK8t8NyDD8EMzhhvko+ObChPzzUDabVrS0rks821a4tK56ARcvh3YwliY34JJjWHMDUAkGYAB5ijBGMQByDBkKQueoe6F4DlsOSjbjIPnUHwVtMmkyMn8ckjc4KShs3U7GpCMceVQhIaKtqu1ERoiDD80PXxnEcMa0dXEf+huLehEdZFUh+KXM98bF5oEz8kwOJ1h6QJOWboZAAacmsDAJGHGm6aFsTBPhWFvq2gAEEYX18zaa2Ca58PwlpMWvTu05aRFH5O05cTNx3tTSow6YaVUh1En11JQ800YeY8NJu6TCnkzkOdKmf4QpochhohzKTOr/12YhZoEnKLEbVorhJEeG+gEtDCLZGFuekmY9vkw4AowmZst3qjdqZntsEMblcFmEeRFGN6oXUgwQ5A1qaFJu3bLydIt9Jzb9GMGILTJOfEppz/VwNAW+m0twazGZ1k53vbuFvqlyQ0GibnAdC9nYnID9JvtpH+PBXvO7ks7N5sPI+U3szAWxsJ8DbN+AszixFMMI8ZB6r63Y/DQXAzzoJRgKN3SuYWxMP+vMJh68pswzmNhzJOCUt7PuL3ekoJe/HHhkM0zTz8qr+lRgimdz0PFrghTqDr/drL0UM7wNRuna016SrsaUb7W4ZsF43yrl4xSuYoW2hMGul4kmISabhw6m4ZlcSJd+U1TfCszCG5CfTd4bnaK45+Hme+etTBvCoOrTH/1fyam3P9cyMnzIw3MsaavBNBrc1WPlOYSzMGnIbQOjcfA5PQFA7atLbEFGpiSLq2n95krdWDho4RhQv66wIznzFIYMUZzpYHJjfcCJNDvKdnnvwtjvrHBwliYd4HZ3j4kdR5g4ANUDMOOVRkmUJUddRuSTyeCgufDDNn8VnD079NgSllFH6GVzslVLSwRFuFR0A/AiBLzAegk7gXQycJYGAvzPBjxBOYw+F0A3bfdWbgH3SBl01M+qJvkR4rQoLpSHV1yCNRge81MO+nU/76Wq7oPDg2H8rt634TRyWAGILr/dV+hH64CLlhcOrcwFsbCPA+mkOwYSIaJlMmawCQYfaami14LdQE0cc6jiaVXKmuWuAeYb56NYban3T2VngRTU90BYNzmVtjwXXMo6/SQ46kZnbMZpuDuWF2pKvdQGJlHnJtLzqK1BhhMpIua5AURm9Csv4HC4ImrzU+FWZoSzMK8DYycevJFYJrKm6dhohl+rqp6Ommn6sJOGtDdjjqE4ne33Ks62Q5hDqqw0Saf9t2Z4serI9XxSDG0RMXQoZCaBFSHUR9svf1X+myFlZWVlZWg/wGWDGwTIFcvjQAAAABJRU5ErkJggg=="
                      alt="QR Code"
                      className="w-40 h-40 rounded"
                    />
                  </div>

                  {/* Secret Key */}
                  <div className="space-y-2">
                    <Label className="font-medium">Secret</Label>
                    <Input
                      value="MM5W6T2LLI5WYW23OBLS4JBBFAXUUTZZNQVFO6BTGIXCGNK6IZ2Q"
                      readOnly
                      className="bg-muted"
                    />
                  </div>

                  {/* Enter 6-Digit Code */}
                  <div className="space-y-2">
                    <Label className="font-medium">Enter 6-digit Code</Label>
                    <Input
                      maxLength={6}
                      placeholder="123456"
                      value={twoFACode}
                      onChange={(e) =>
                        setTwoFACode(e.target.value.replace(/\D/g, ""))
                      }
                      className="bg-muted"
                    />
                  </div>

                  <Button className="w-full" onClick={handleEnable2FA}>
                    Enable 2FA
                  </Button>
                </>
              )}

              {/* ----------- IF ENABLED → SHOW DISABLE FLOW ----------- */}
              {is2FAEnabled && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base">Enter 2FA Code to Disable</Label>
                    <Input
                      maxLength={6}
                      placeholder="123456"
                      value={disableCode}
                      onChange={(e) =>
                        setDisableCode(e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleDisable2FA}
                  >
                    Disable 2FA
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Setting;

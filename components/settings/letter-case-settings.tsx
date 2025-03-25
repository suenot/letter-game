import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAsync } from "@/lib/use-async";
import { gameService } from "@/src/api";
import { Loading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-message";

export function LetterCaseSettings() {
  const {
    data: settings,
    isLoading,
    error,
    execute: refreshSettings,
  } = useAsync(gameService.getSettings, { immediate: true });

  const handleUppercaseChange = async (checked: boolean) => {
    if (!settings) return;
    try {
      await gameService.updateSettings({
        ...settings,
        uppercase_enabled: checked,
      });
      refreshSettings();
    } catch (error) {
      console.error("Failed to update uppercase setting:", error);
    }
  };

  const handleLowercaseChange = async (checked: boolean) => {
    if (!settings) return;
    try {
      await gameService.updateSettings({
        ...settings,
        lowercase_enabled: checked,
      });
      refreshSettings();
    } catch (error) {
      console.error("Failed to update lowercase setting:", error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!settings) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="uppercase" className="flex flex-col space-y-1">
          <span>Uppercase Letters</span>
          <span className="font-normal text-sm text-muted-foreground">
            Enable uppercase letters in the game (A, B, C)
          </span>
        </Label>
        <Switch
          id="uppercase"
          checked={settings.uppercase_enabled}
          onCheckedChange={handleUppercaseChange}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="lowercase" className="flex flex-col space-y-1">
          <span>Lowercase Letters</span>
          <span className="font-normal text-sm text-muted-foreground">
            Enable lowercase letters in the game (a, b, c)
          </span>
        </Label>
        <Switch
          id="lowercase"
          checked={settings.lowercase_enabled}
          onCheckedChange={handleLowercaseChange}
        />
      </div>

      {!settings.uppercase_enabled && !settings.lowercase_enabled && (
        <div className="rounded-md bg-yellow-50 p-4 mt-4">
          <div className="flex">
            <div className="text-yellow-800">
              <p className="text-sm">
                Warning: At least one letter case should be enabled for the game to work properly.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

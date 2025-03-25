import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAsync } from "@/lib/use-async";
import { gameService } from "@/src/api";
import { Loading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-message";
import { soundService, SoundEffect } from "@/lib/sounds";
import { Button } from "@/components/ui/button";
import { VolumeX, Volume2 } from "lucide-react";

export function SoundSettings() {
  const {
    data: settings,
    isLoading,
    error,
    execute: refreshSettings,
  } = useAsync(gameService.getSettings, { immediate: true });

  // Sync sound service with settings
  useEffect(() => {
    if (settings) {
      soundService.setEnabled(settings.sound_effects_enabled);
    }
  }, [settings?.sound_effects_enabled]);

  const handleSoundChange = async (checked: boolean) => {
    if (!settings) return;
    try {
      await gameService.updateSettings({
        ...settings,
        sound_effects_enabled: checked,
      });
      refreshSettings();
    } catch (error) {
      console.error("Failed to update sound settings:", error);
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
        <Label htmlFor="sound" className="flex flex-col space-y-1">
          <span>Sound Effects</span>
          <span className="font-normal text-sm text-muted-foreground">
            Enable sound effects for game actions
          </span>
        </Label>
        <div className="flex items-center space-x-2">
          <VolumeX className={`h-4 w-4 ${settings.sound_effects_enabled ? 'text-muted-foreground' : 'text-primary'}`} />
          <Switch
            id="sound"
            checked={settings.sound_effects_enabled}
            onCheckedChange={handleSoundChange}
          />
          <Volume2 className={`h-4 w-4 ${settings.sound_effects_enabled ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
      </div>

      {settings.sound_effects_enabled && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-medium mb-2">Test Sound Effects</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => soundService.play(SoundEffect.LETTER_SELECT)}
            >
              Letter Select
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => soundService.play(SoundEffect.LETTER_CORRECT)}
            >
              Correct Answer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => soundService.play(SoundEffect.LETTER_INCORRECT)}
            >
              Wrong Answer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => soundService.play(SoundEffect.TOPIC_COMPLETE)}
            >
              Topic Complete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

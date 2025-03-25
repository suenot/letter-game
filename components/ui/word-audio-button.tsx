import React from "react";
import { Button } from "./button";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWordAudio } from "@/lib/use-word-audio";
import { gameService } from "@/src/api";
import { useAsync } from "@/lib/use-async";

interface WordAudioButtonProps {
  word: string;
  className?: string;
  onError?: (error: string) => void;
}

export function WordAudioButton({ word, className, onError }: WordAudioButtonProps) {
  const { getAudio, playAudio, audioStates } = useWordAudio();
  const { data: settings } = useAsync(gameService.getSettings, { immediate: true });

  const audioState = audioStates[word];
  const isAudioEnabled = settings?.sound_effects_enabled ?? true;

  const handleClick = async () => {
    if (!isAudioEnabled) return;
    try {
      await playAudio(word);
    } catch (error) {
      if (error instanceof Error && onError) {
        onError(error.message);
      }
    }
  };

  // Preload audio when component mounts
  React.useEffect(() => {
    if (isAudioEnabled) {
      getAudio(word);
    }
  }, [word, isAudioEnabled, getAudio]);

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("h-8 w-8 p-0", className)}
      onClick={handleClick}
      disabled={!isAudioEnabled || audioState?.isLoading}
      title={isAudioEnabled ? "Play word pronunciation" : "Sound effects are disabled"}
    >
      {audioState?.isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : !isAudioEnabled ? (
        <VolumeX className="h-4 w-4 text-muted-foreground" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </Button>
  );
}

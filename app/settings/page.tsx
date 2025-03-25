import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LetterCaseSettings } from "@/components/settings/letter-case-settings";
import { SoundSettings } from "@/components/settings/sound-settings";

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Game Settings</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Letter Case Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <LetterCaseSettings />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sound Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <SoundSettings />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

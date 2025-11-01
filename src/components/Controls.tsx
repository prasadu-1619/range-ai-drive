import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Power, Sparkles, Sun, Moon, Lightbulb, Zap } from 'lucide-react';

interface ControlsProps {
  isEngineOn: boolean;
  speed: number;
  terrain: string;
  weather: string;
  acMode: 'off' | 'low' | 'medium' | 'high';
  timeOfDay: 'day' | 'night';
  headlightsOn: boolean;
  onEngineToggle: () => void;
  onTerrainChange: (terrain: string) => void;
  onWeatherChange: (weather: string) => void;
  onAcModeChange: (mode: 'off' | 'low' | 'medium' | 'high') => void;
  onTimeOfDayChange: (time: 'day' | 'night') => void;
  onHeadlightsToggle: () => void;
  onFindRange: () => void;
  isAnalyzing: boolean;
}

export const Controls = ({
  isEngineOn,
  speed,
  terrain,
  weather,
  acMode,
  timeOfDay,
  headlightsOn,
  onEngineToggle,
  onTerrainChange,
  onWeatherChange,
  onAcModeChange,
  onTimeOfDayChange,
  onHeadlightsToggle,
  onFindRange,
  isAnalyzing
}: ControlsProps) => {
  return (
    <div className="absolute top-6 right-6 space-y-4 pointer-events-auto">
      {/* Engine Control */}
      <Card className="bg-card/70 backdrop-blur-md border-primary/20 shadow-[0_0_20px_rgba(0,217,255,0.15)]">
        <div className="p-4">
          <Button
            onClick={onEngineToggle}
            className={`w-full ${isEngineOn ? 'bg-success hover:bg-success/90' : 'bg-primary hover:bg-primary/90'}`}
            size="lg"
          >
            <Power className="mr-2 h-5 w-5" />
            {isEngineOn ? 'Stop Engine' : 'Start Engine'}
          </Button>
        </div>
      </Card>
      
      {/* Environment Controls */}
      <Card className="bg-card/70 backdrop-blur-md border-primary/20 shadow-[0_0_20px_rgba(0,217,255,0.15)]">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Terrain</Label>
            <Select value={terrain} onValueChange={onTerrainChange}>
              <SelectTrigger className="bg-input border-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="city">City</SelectItem>
                <SelectItem value="highway">Highway</SelectItem>
                <SelectItem value="hills">Hills</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm">Weather</Label>
            <Select value={weather} onValueChange={onWeatherChange}>
              <SelectTrigger className="bg-input border-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sunny">Sunny</SelectItem>
                <SelectItem value="hot">Hot</SelectItem>
                <SelectItem value="rainy">Rainy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Time of Day</Label>
            <div className="flex gap-2">
              <Button
                onClick={() => onTimeOfDayChange('day')}
                variant={timeOfDay === 'day' ? 'default' : 'outline'}
                className="flex-1"
                size="sm"
              >
                <Sun className="h-4 w-4 mr-1" />
                Day
              </Button>
              <Button
                onClick={() => onTimeOfDayChange('night')}
                variant={timeOfDay === 'night' ? 'default' : 'outline'}
                className="flex-1"
                size="sm"
              >
                <Moon className="h-4 w-4 mr-1" />
                Night
              </Button>
            </div>
          </div>

          {timeOfDay === 'night' && (
            <div className="flex items-center justify-between">
              <Label className="text-sm flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Headlights
              </Label>
              <Switch checked={headlightsOn} onCheckedChange={onHeadlightsToggle} />
            </div>
          )}
          
          <div className="space-y-2">
            <Label className="text-sm">Air Conditioning</Label>
            <Select value={acMode} onValueChange={(v) => onAcModeChange(v as any)}>
              <SelectTrigger className="bg-input border-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="off">Off</SelectItem>
                <SelectItem value="low">Low ❄️</SelectItem>
                <SelectItem value="medium">Medium ❄️❄️</SelectItem>
                <SelectItem value="high">High ❄️❄️❄️</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
      
      {/* AI Analysis Button */}
      <Card className="bg-card/70 backdrop-blur-md border-accent/30 shadow-[0_0_30px_rgba(0,217,255,0.2)]">
        <div className="p-4">
          <Button
            onClick={onFindRange}
            disabled={isAnalyzing || !isEngineOn}
            className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Zap className="mr-2 h-5 w-5 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Find Range with AI
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

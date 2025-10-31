import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Power, Zap, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface ControlsProps {
  isEngineOn: boolean;
  speed: number;
  terrain: string;
  weather: string;
  acOn: boolean;
  onEngineToggle: () => void;
  onSpeedChange: (speed: number) => void;
  onTerrainChange: (terrain: string) => void;
  onWeatherChange: (weather: string) => void;
  onAcToggle: () => void;
  onFindRange: () => void;
  isAnalyzing: boolean;
}

export const Controls = ({
  isEngineOn,
  speed,
  terrain,
  weather,
  acOn,
  onEngineToggle,
  onSpeedChange,
  onTerrainChange,
  onWeatherChange,
  onAcToggle,
  onFindRange,
  isAnalyzing
}: ControlsProps) => {
  const [isPressing, setIsPressing] = useState(false);
  
  const handleAccelerate = () => {
    if (!isEngineOn) {
      toast.error("Start the engine first!");
      return;
    }
    if (speed < 120) {
      onSpeedChange(Math.min(speed + 5, 120));
    }
  };
  
  const handleBrake = () => {
    if (speed > 0) {
      onSpeedChange(Math.max(speed - 5, 0));
    }
  };
  
  const handleEngineToggle = () => {
    if (!isEngineOn) {
      toast.success("Engine started! ⚡");
    } else {
      toast.info("Engine stopped");
      onSpeedChange(0);
    }
    onEngineToggle();
  };
  
  return (
    <div className="absolute top-6 right-6 space-y-4 pointer-events-auto">
      {/* Engine Control */}
      <Card className="bg-card/70 backdrop-blur-md border-primary/20 shadow-[0_0_20px_rgba(0,217,255,0.15)]">
        <div className="p-4">
          <Button
            onClick={handleEngineToggle}
            className={`w-full ${isEngineOn ? 'bg-success hover:bg-success/90' : 'bg-primary hover:bg-primary/90'}`}
            size="lg"
          >
            <Power className="mr-2 h-5 w-5" />
            {isEngineOn ? 'Stop Engine' : 'Start Engine'}
          </Button>
        </div>
      </Card>
      
      {/* Speed Controls */}
      <Card className="bg-card/70 backdrop-blur-md border-primary/20 shadow-[0_0_20px_rgba(0,217,255,0.15)]">
        <div className="p-4 space-y-3">
          <Label className="text-sm font-semibold">Speed Control</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleAccelerate}
              disabled={!isEngineOn || speed >= 120}
              className="bg-success hover:bg-success/90"
              onMouseDown={() => setIsPressing(true)}
              onMouseUp={() => setIsPressing(false)}
              onMouseLeave={() => setIsPressing(false)}
            >
              Accelerate
            </Button>
            <Button
              onClick={handleBrake}
              disabled={speed === 0}
              variant="destructive"
            >
              Brake
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Conditions */}
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
          
          <div className="flex items-center justify-between">
            <Label className="text-sm">Air Conditioning</Label>
            <Switch checked={acOn} onCheckedChange={onAcToggle} />
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

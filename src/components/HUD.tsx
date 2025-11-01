import { Battery, Gauge, Wind, Thermometer, X, Navigation, Sun, Moon, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface HUDProps {
  battery: number;
  speed: number;
  range: number;
  terrain: string;
  acMode: 'off' | 'low' | 'medium' | 'high';
  weather: string;
  timeOfDay: 'day' | 'night';
  headlightsOn: boolean;
  distance: number;
  aiAnalysis?: string;
  isAnalyzing?: boolean;
  onDismissAnalysis?: () => void;
  isCharging: boolean;
  chargeAmount: number;
  onChargeAmountChange: (amount: number) => void;
  onCharge: () => void;
  onSkipCharging: () => void;
}

export const HUD = ({ 
  battery, 
  speed, 
  range, 
  terrain, 
  acMode, 
  weather, 
  timeOfDay,
  headlightsOn,
  distance,
  aiAnalysis,
  isAnalyzing,
  onDismissAnalysis,
  isCharging,
  chargeAmount,
  onChargeAmountChange,
  onCharge,
  onSkipCharging
}: HUDProps) => {
  const getBatteryColor = () => {
    if (battery > 50) return 'text-success';
    if (battery > 20) return 'text-warning';
    return 'text-destructive';
  };

  const getACDisplay = () => {
    if (acMode === 'off') return 'OFF';
    return `${acMode.toUpperCase()} ${acMode === 'high' ? '❄️❄️❄️' : acMode === 'medium' ? '❄️❄️' : '❄️'}`;
  };

  const getRoadStatus = () => {
    const nextStation = Math.ceil(distance / 100) * 100;
    const distanceToNext = nextStation - distance;
    
    if (distanceToNext < 10) {
      return `⚡ Charging station in ${distanceToNext.toFixed(1)} km`;
    }
    return `Next station: ${distanceToNext.toFixed(0)} km`;
  };
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD */}
      <div className="absolute top-6 left-0 right-0 flex justify-center gap-4 px-6 pointer-events-auto">
        {/* Battery Status */}
        <Card className="bg-card/70 backdrop-blur-md border-primary/20 shadow-[0_0_20px_rgba(0,217,255,0.15)]">
          <div className="p-4 flex items-center gap-3">
            <Battery className={`h-6 w-6 ${getBatteryColor()}`} />
            <div>
              <p className="text-sm text-muted-foreground">Battery</p>
              <p className={`text-2xl font-bold font-mono ${getBatteryColor()}`}>
                {battery}%
              </p>
            </div>
            <div className="w-24">
              <Progress value={battery} className="h-2" />
            </div>
          </div>
        </Card>
        
        {/* Speed */}
        <Card className="bg-card/70 backdrop-blur-md border-primary/20 shadow-[0_0_20px_rgba(0,217,255,0.15)]">
          <div className="p-4 flex items-center gap-3">
            <Gauge className="h-6 w-6 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Speed</p>
              <p className="text-2xl font-bold font-mono text-accent">
                {speed} <span className="text-base">km/h</span>
              </p>
            </div>
          </div>
        </Card>
        
        {/* Range */}
        <Card className="bg-card/70 backdrop-blur-md border-primary/20 shadow-[0_0_20px_rgba(0,217,255,0.15)]">
          <div className="p-4 flex items-center gap-3">
            <div className="h-6 w-6 text-primary flex items-center justify-center font-bold">
              R
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Est. Range</p>
              <p className="text-2xl font-bold font-mono text-primary">
                {range} <span className="text-base">km</span>
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Bottom Left - Conditions */}
      <Card className="absolute bottom-6 left-6 bg-card/70 backdrop-blur-md border-primary/20 shadow-[0_0_20px_rgba(0,217,255,0.15)] pointer-events-auto">
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Distance: <span className="text-primary font-semibold">{distance.toFixed(1)} km</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Terrain: <span className="text-primary font-semibold capitalize">{terrain}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Weather: <span className="text-primary font-semibold capitalize">{weather}</span></span>
          </div>
          <div className="flex items-center gap-2">
            {timeOfDay === 'day' ? <Sun className="h-4 w-4 text-warning" /> : <Moon className="h-4 w-4 text-primary" />}
            <span className="text-sm capitalize">{timeOfDay}</span>
          </div>
          {timeOfDay === 'night' && (
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Lights: <span className={`font-semibold ${headlightsOn ? 'text-accent' : 'text-muted-foreground'}`}>
                {headlightsOn ? 'ON' : 'OFF'}
              </span></span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 text-muted-foreground">❄️</div>
            <span className="text-sm">AC: <span className={`font-semibold ${acMode !== 'off' ? 'text-accent' : 'text-muted-foreground'}`}>
              {getACDisplay()}
            </span></span>
          </div>
          <div className="text-xs text-muted-foreground border-t border-primary/20 pt-2 mt-2">
            {getRoadStatus()}
          </div>
        </div>
      </Card>
      
      {/* Charging Station Modal */}
      {isCharging && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" 
            style={{ zIndex: 9998 }}
          />
          <Card className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full mx-4 bg-card/95 backdrop-blur-md border-success/50 shadow-[0_0_50px_rgba(34,197,94,0.4)] pointer-events-auto animate-in slide-in-from-bottom duration-500" style={{ zIndex: 9999 }}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-3 w-3 bg-success rounded-full animate-pulse" />
                <span className="text-lg font-bold text-success">⚡ Charging Station</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Current battery: {battery}% • Available: {100 - battery}%
              </p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="charge-amount" className="text-sm">How much to charge? (%)</Label>
                  <Input
                    id="charge-amount"
                    type="number"
                    min="1"
                    max={100 - battery}
                    value={chargeAmount || ''}
                    onChange={(e) => onChargeAmountChange(Number(e.target.value))}
                    className="mt-2"
                    placeholder="Enter amount"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={onCharge}
                    disabled={chargeAmount <= 0 || chargeAmount > 100 - battery}
                    className="flex-1 bg-success hover:bg-success/90"
                  >
                    Charge {chargeAmount}%
                  </Button>
                  <Button
                    onClick={onSkipCharging}
                    variant="outline"
                    className="flex-1"
                  >
                    Skip
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* AI Analysis Display - Modal Overlay */}
      {(aiAnalysis || isAnalyzing) && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto cursor-pointer" 
            style={{ zIndex: 9998 }}
            onClick={onDismissAnalysis}
          />
          <Card className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full mx-4 bg-card/95 backdrop-blur-md border-accent/50 shadow-[0_0_50px_rgba(0,217,255,0.4)] pointer-events-auto animate-in slide-in-from-bottom duration-500" style={{ zIndex: 9999 }}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-accent rounded-full animate-pulse" />
                  <span className="text-lg font-bold text-accent">AI Range Analysis</span>
                </div>
                {!isAnalyzing && onDismissAnalysis && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={onDismissAnalysis}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {isAnalyzing ? (
                <p className="text-base text-muted-foreground animate-pulse">
                  Analyzing driving conditions with AI...
                </p>
              ) : (
                <p className="text-base leading-relaxed text-foreground">
                  {aiAnalysis}
                </p>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

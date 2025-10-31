import { Battery, Gauge, Wind, Thermometer } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface HUDProps {
  battery: number;
  speed: number;
  range: number;
  terrain: string;
  acOn: boolean;
  weather: string;
  aiAnalysis?: string;
  isAnalyzing?: boolean;
}

export const HUD = ({ 
  battery, 
  speed, 
  range, 
  terrain, 
  acOn, 
  weather, 
  aiAnalysis,
  isAnalyzing 
}: HUDProps) => {
  const getBatteryColor = () => {
    if (battery > 50) return 'text-success';
    if (battery > 20) return 'text-warning';
    return 'text-destructive';
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
            <Wind className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Terrain: <span className="text-primary font-semibold capitalize">{terrain}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Weather: <span className="text-primary font-semibold capitalize">{weather}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 text-muted-foreground">❄️</div>
            <span className="text-sm">AC: <span className={`font-semibold ${acOn ? 'text-accent' : 'text-muted-foreground'}`}>
              {acOn ? 'ON' : 'OFF'}
            </span></span>
          </div>
        </div>
      </Card>
      
      {/* AI Analysis Display */}
      {(aiAnalysis || isAnalyzing) && (
        <Card className="absolute bottom-6 right-6 max-w-md bg-card/70 backdrop-blur-md border-accent/30 shadow-[0_0_30px_rgba(0,217,255,0.2)] pointer-events-auto animate-in slide-in-from-bottom duration-500">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 bg-accent rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-accent">AI Range Analysis</span>
            </div>
            {isAnalyzing ? (
              <p className="text-sm text-muted-foreground animate-pulse">
                Analyzing driving conditions...
              </p>
            ) : (
              <p className="text-sm leading-relaxed">
                {aiAnalysis}
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

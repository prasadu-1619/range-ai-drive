import { Battery, Gauge, Wind, Thermometer, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface HUDProps {
  battery: number;
  speed: number;
  range: number;
  terrain: string;
  acOn: boolean;
  weather: string;
  aiAnalysis?: string;
  isAnalyzing?: boolean;
  onDismissAnalysis?: () => void;
}

export const HUD = ({ 
  battery, 
  speed, 
  range, 
  terrain, 
  acOn, 
  weather, 
  aiAnalysis,
  isAnalyzing,
  onDismissAnalysis
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

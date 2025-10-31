import { useState, useEffect } from 'react';
import { EVScene } from '@/components/EVScene';
import { HUD } from '@/components/HUD';
import { Controls } from '@/components/Controls';
import { toast } from 'sonner';

const Index = () => {
  const [isEngineOn, setIsEngineOn] = useState(false);
  const [battery, setBattery] = useState(85);
  const [speed, setSpeed] = useState(0);
  const [range, setRange] = useState(340);
  const [terrain, setTerrain] = useState<'city' | 'highway' | 'hills'>('highway');
  const [weather, setWeather] = useState('sunny');
  const [acOn, setAcOn] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Simulate battery drain based on speed and conditions
  useEffect(() => {
    if (!isEngineOn || speed === 0) return;
    
    const drainRate = speed / 10000; // Base drain
    const terrainMultiplier = terrain === 'hills' ? 1.5 : terrain === 'city' ? 1.2 : 1.0;
    const acMultiplier = acOn ? 1.2 : 1.0;
    const weatherMultiplier = weather === 'hot' ? 1.15 : weather === 'rainy' ? 1.1 : 1.0;
    
    const totalDrain = drainRate * terrainMultiplier * acMultiplier * weatherMultiplier;
    
    const interval = setInterval(() => {
      setBattery(prev => {
        const newBattery = Math.max(0, prev - totalDrain);
        if (newBattery === 0) {
          toast.error("Battery depleted! Engine stopped.");
          setIsEngineOn(false);
          setSpeed(0);
        }
        return newBattery;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [isEngineOn, speed, terrain, acOn, weather]);
  
  // Update estimated range
  useEffect(() => {
    const maxRange = 400;
    let estimatedRange = (battery / 100) * maxRange;
    
    const terrainModifiers = { city: 0.95, highway: 1.0, hills: 0.75 };
    estimatedRange *= terrainModifiers[terrain];
    
    if (acOn) estimatedRange *= 0.9;
    
    const weatherModifiers = { sunny: 1.0, hot: 0.92, rainy: 0.88 };
    estimatedRange *= (weatherModifiers as any)[weather] || 1.0;
    
    if (speed > 80) estimatedRange *= 0.85;
    else if (speed > 60) estimatedRange *= 0.93;
    
    setRange(Math.round(estimatedRange));
  }, [battery, speed, terrain, acOn, weather]);
  
  const handleFindRange = async () => {
    if (!isEngineOn) {
      toast.error("Start the engine first!");
      return;
    }
    
    setIsAnalyzing(true);
    setAiAnalysis(undefined);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-range`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            battery: Math.round(battery),
            speed,
            terrain,
            acOn,
            weather
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to analyze range');
      }
      
      const data = await response.json();
      setAiAnalysis(data.aiAnalysis);
      toast.success("AI analysis complete!");
      
    } catch (error) {
      console.error('Error analyzing range:', error);
      toast.error("Failed to analyze range. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      {/* 3D Scene */}
      <EVScene speed={speed} terrain={terrain} isEngineOn={isEngineOn} />
      
      {/* HUD Overlay */}
      <HUD
        battery={Math.round(battery)}
        speed={speed}
        range={range}
        terrain={terrain}
        acOn={acOn}
        weather={weather}
        aiAnalysis={aiAnalysis}
        isAnalyzing={isAnalyzing}
      />
      
      {/* Controls */}
      <Controls
        isEngineOn={isEngineOn}
        speed={speed}
        terrain={terrain}
        weather={weather}
        acOn={acOn}
        onEngineToggle={() => setIsEngineOn(!isEngineOn)}
        onSpeedChange={setSpeed}
        onTerrainChange={(t) => setTerrain(t as any)}
        onWeatherChange={setWeather}
        onAcToggle={() => setAcOn(!acOn)}
        onFindRange={handleFindRange}
        isAnalyzing={isAnalyzing}
      />
      
      {/* Title */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <h1 className="text-3xl font-bold text-primary drop-shadow-[0_0_20px_rgba(0,217,255,0.5)]">
          EV Range Simulator
        </h1>
        <p className="text-sm text-muted-foreground">
          Powered by AI • Real-time efficiency analysis
        </p>
      </div>
    </div>
  );
};

export default Index;

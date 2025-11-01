import { useState, useEffect, useCallback } from 'react';
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
  const [acMode, setAcMode] = useState<'off' | 'low' | 'medium' | 'high'>('off');
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('day');
  const [headlightsOn, setHeadlightsOn] = useState(false);
  const [distance, setDistance] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [chargeAmount, setChargeAmount] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState<string>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        if (!isEngineOn) {
          toast.error("Start the engine first!");
          return;
        }
        setSpeed(prev => Math.min(prev + 2, 120));
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setSpeed(prev => Math.max(prev - 3, 0));
      } else if (e.key === ' ') {
        e.preventDefault();
        setSpeed(prev => Math.max(prev - 8, 0)); // Space bar for quick brake
      } else if (e.key === 'l' || e.key === 'L') {
        if (timeOfDay === 'night') {
          setHeadlightsOn(prev => !prev);
          toast.info(headlightsOn ? "Headlights off" : "Headlights on 💡");
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEngineOn, timeOfDay, headlightsOn]);

  // Auto-acceleration when moving
  useEffect(() => {
    if (!isEngineOn || speed === 0) return;
    
    const accelerationInterval = setInterval(() => {
      setSpeed(prev => {
        if (prev < 60) return Math.min(prev + 0.5, 120); // Slow acceleration
        return prev;
      });
    }, 100);
    
    return () => clearInterval(accelerationInterval);
  }, [isEngineOn, speed]);

  // Simulate battery drain and distance tracking
  useEffect(() => {
    if (!isEngineOn || speed === 0 || isCharging) return;
    
    const drainRate = speed / 10000; // Base drain
    const terrainMultiplier = terrain === 'hills' ? 1.5 : terrain === 'city' ? 1.2 : 1.0;
    const acMultiplier = acMode === 'high' ? 1.3 : acMode === 'medium' ? 1.2 : acMode === 'low' ? 1.1 : 1.0;
    const weatherMultiplier = weather === 'hot' ? 1.15 : weather === 'rainy' ? 1.1 : 1.0;
    const headlightMultiplier = headlightsOn ? 1.05 : 1.0;
    
    const totalDrain = drainRate * terrainMultiplier * acMultiplier * weatherMultiplier * headlightMultiplier;
    
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
      
      // Update distance (speed in km/h, interval is 100ms)
      setDistance(prev => {
        const newDistance = prev + (speed * 0.1) / 3600; // Convert to km
        
        // Check for charging station every 100 km
        if (Math.floor(newDistance / 100) > Math.floor(prev / 100)) {
          setSpeed(0);
          setIsCharging(true);
          toast.success("🔋 Charging station reached! Time to recharge.");
        }
        
        return newDistance;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [isEngineOn, speed, terrain, acMode, weather, headlightsOn, isCharging]);
  
  // Update estimated range
  useEffect(() => {
    const maxRange = 400;
    let estimatedRange = (battery / 100) * maxRange;
    
    const terrainModifiers = { city: 0.95, highway: 1.0, hills: 0.75 };
    estimatedRange *= terrainModifiers[terrain];
    
    const acMultiplier = acMode === 'high' ? 0.85 : acMode === 'medium' ? 0.9 : acMode === 'low' ? 0.95 : 1.0;
    estimatedRange *= acMultiplier;
    
    const weatherModifiers = { sunny: 1.0, hot: 0.92, rainy: 0.88 };
    estimatedRange *= (weatherModifiers as any)[weather] || 1.0;
    
    if (headlightsOn) estimatedRange *= 0.97;
    
    if (speed > 80) estimatedRange *= 0.85;
    else if (speed > 60) estimatedRange *= 0.93;
    
    setRange(Math.round(estimatedRange));
  }, [battery, speed, terrain, acMode, weather, headlightsOn]);
  
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
            acMode,
            weather,
            timeOfDay,
            headlightsOn,
            distance: Math.round(distance)
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to analyze range');
      }
      
      const data = await response.json();
      setAiAnalysis(data.aiAnalysis);
      toast.success("AI analysis complete!");
      
      // Auto-dismiss after 10 seconds
      setTimeout(() => {
        setAiAnalysis(undefined);
      }, 10000);
      
    } catch (error) {
      console.error('Error analyzing range:', error);
      toast.error("Failed to analyze range. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCharge = useCallback(() => {
    if (chargeAmount <= 0 || chargeAmount > 100 - battery) {
      toast.error("Invalid charge amount!");
      return;
    }
    
    setBattery(prev => Math.min(100, prev + chargeAmount));
    setIsCharging(false);
    setChargeAmount(0);
    toast.success(`Charged ${chargeAmount}%! Ready to continue.`);
  }, [chargeAmount, battery]);
  
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      {/* 3D Scene */}
      <EVScene 
        speed={speed} 
        terrain={terrain} 
        isEngineOn={isEngineOn} 
        timeOfDay={timeOfDay}
        headlightsOn={headlightsOn}
      />
      
      {/* HUD Overlay */}
      <HUD
        battery={Math.round(battery)}
        speed={speed}
        range={range}
        terrain={terrain}
        acMode={acMode}
        weather={weather}
        timeOfDay={timeOfDay}
        headlightsOn={headlightsOn}
        distance={distance}
        aiAnalysis={aiAnalysis}
        isAnalyzing={isAnalyzing}
        onDismissAnalysis={() => setAiAnalysis(undefined)}
        isCharging={isCharging}
        chargeAmount={chargeAmount}
        onChargeAmountChange={setChargeAmount}
        onCharge={handleCharge}
        onSkipCharging={() => setIsCharging(false)}
      />
      
      {/* Controls */}
      <Controls
        isEngineOn={isEngineOn}
        speed={speed}
        terrain={terrain}
        weather={weather}
        acMode={acMode}
        timeOfDay={timeOfDay}
        headlightsOn={headlightsOn}
        onEngineToggle={() => {
          if (!isEngineOn) {
            toast.success("Engine started! ⚡");
          } else {
            toast.info("Engine stopped");
            setSpeed(0);
          }
          setIsEngineOn(!isEngineOn);
        }}
        onTerrainChange={(t) => setTerrain(t as any)}
        onWeatherChange={setWeather}
        onAcModeChange={setAcMode}
        onTimeOfDayChange={setTimeOfDay}
        onHeadlightsToggle={() => {
          if (timeOfDay === 'night') {
            setHeadlightsOn(!headlightsOn);
          } else {
            toast.error("Headlights only work at night!");
          }
        }}
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
        <p className="text-xs text-muted-foreground mt-1">
          ⌨️ Use Arrow Keys/WASD to drive • Space to brake
        </p>
      </div>
    </div>
  );
};

export default Index;

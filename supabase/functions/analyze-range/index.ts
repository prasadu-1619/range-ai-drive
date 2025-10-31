import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { battery, speed, terrain, acOn, weather } = await req.json();
    
    // Calculate base range based on battery percentage
    const maxRange = 400; // km
    let estimatedRange = (battery / 100) * maxRange;
    
    // Apply terrain modifier
    const terrainModifiers = {
      city: 0.95,
      highway: 1.0,
      hills: 0.75
    };
    estimatedRange *= terrainModifiers[terrain as keyof typeof terrainModifiers] || 1.0;
    
    // Apply AC modifier
    if (acOn) {
      estimatedRange *= 0.9;
    }
    
    // Apply weather modifier
    const weatherModifiers = {
      sunny: 1.0,
      hot: 0.92,
      rainy: 0.88
    };
    estimatedRange *= weatherModifiers[weather as keyof typeof weatherModifiers] || 1.0;
    
    // Apply speed modifier (efficiency drops at high speeds)
    if (speed > 80) {
      estimatedRange *= 0.85;
    } else if (speed > 60) {
      estimatedRange *= 0.93;
    }
    
    estimatedRange = Math.round(estimatedRange);
    
    // Call Lovable AI (Gemini) for analysis
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }
    
    const prompt = `You are an EV efficiency assistant. Analyze this driving data and provide a brief, actionable response (2-3 sentences max):

Battery: ${battery}%
Speed: ${speed} km/h
Terrain: ${terrain}
AC Status: ${acOn ? 'ON' : 'OFF'}
Weather: ${weather}
Calculated Range: ${estimatedRange} km

Explain the estimated range and give 1-2 specific tips to improve efficiency. Be concise and practical.`;
    
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful EV efficiency assistant. Keep responses brief and actionable.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });
    
    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }
    
    const aiData = await aiResponse.json();
    const aiAnalysis = aiData.choices[0].message.content;
    
    return new Response(
      JSON.stringify({ 
        estimatedRange,
        aiAnalysis
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error in analyze-range function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

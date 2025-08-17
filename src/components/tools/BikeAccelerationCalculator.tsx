import { useState, useCallback, useMemo } from 'react';
import {
  BikeConfig,
  RiderConfig,
  TerrainConfig,
  ComparisonResult,
  compareBikeConfigurations,
  solveBikeMotion,
  BIKE_CONFIGS
} from '../../utils/bikePhysics';
import VelocityChart from '../charts/VelocityChart';
import DistanceChart from '../charts/DistanceChart';
import PowerAnalysisChart from '../charts/PowerAnalysisChart';

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  min?: number;
  max?: number;
  step?: number;
  description?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  unit,
  min,
  max,
  step = 0.01,
  description
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-white">
      {label}
      {description && (
        <span className="block text-xs text-white/70 font-normal mt-1">
          {description}
        </span>
      )}
    </label>
    <div className="flex">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        className="flex-1 bg-white/10 border border-white/20 rounded-l-lg px-3 py-2 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      />
      <span className="bg-white/20 border border-l-0 border-white/20 rounded-r-lg px-3 py-2 text-white/80 text-sm">
        {unit}
      </span>
    </div>
  </div>
);

interface BikeAccelerationCalculatorProps {
  onNavigateToInertia?: () => void;
}

const BikeAccelerationCalculator: React.FC<BikeAccelerationCalculatorProps> = ({ onNavigateToInertia }) => {
  // Rider configuration
  const [riderConfig, setRiderConfig] = useState<RiderConfig>({
    P: 250,  // Power in watts
    mf: 85   // Rider mass in kg
  });

  // Terrain configuration
  const [terrainConfig, setTerrainConfig] = useState<TerrainConfig>({
    hm: 7800,    // Total elevation climbed in m
    L: 1100,     // Total distance in km
    ha: 0.33,    // Ascending fraction
    hd: 0.33,    // Descending fraction
    dx: 2000     // Distance between stops in m
  });

  // Custom bike configurations
  const [config1, setConfig1] = useState<BikeConfig & { name: string }>({
    ...BIKE_CONFIGS.bike1
  });

  const [config2, setConfig2] = useState<BikeConfig & { name: string }>({
    ...BIKE_CONFIGS.bike2
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Calculate comparison results
  const comparisonResult = useMemo<ComparisonResult | null>(() => {
    try {
      if (isCalculating) return null;
      return compareBikeConfigurations(riderConfig, config1, config2, terrainConfig);
    } catch (error) {
      console.error('Calculation error:', error);
      return null;
    }
  }, [riderConfig, config1, config2, terrainConfig, isCalculating]);

  // Generate velocity curves for visualization
  const velocityCurves = useMemo(() => {
    if (!comparisonResult) return null;
    
    const solution1 = solveBikeMotion(riderConfig, config1, 0, 300, 5); // 5-second intervals up to 5 minutes
    const solution2 = solveBikeMotion(riderConfig, config2, 0, 300, 5);
    
    const points = [];
    const maxLength = Math.max(solution1.length, solution2.length);
    
    for (let i = 0; i < maxLength; i++) {
      const result1 = solution1[i] || solution1[solution1.length - 1];
      const result2 = solution2[i] || solution2[solution2.length - 1];
      
      if (result1 && result2) {
        points.push({
          time: Math.max(result1.time, result2.time),
          velocity1: result1.velocity * 3.6, // Convert to km/h
          velocity2: result2.velocity * 3.6,
          distance1: result1.distance,
          distance2: result2.distance
        });
      }
    }
    
    return points;
  }, [comparisonResult, riderConfig, config1, config2]);

  const handleCalculate = useCallback(() => {
    setIsCalculating(true);
    // Simulate calculation delay for better UX
    setTimeout(() => setIsCalculating(false), 500);
  }, []);

  const resetToDefaults = useCallback(() => {
    setRiderConfig({ P: 250, mf: 85 });
    setTerrainConfig({
      hm: 7800,
      L: 1100,
      ha: 0.33,
      hd: 0.33,
      dx: 2000
    });
    setConfig1({ ...BIKE_CONFIGS.bike1 });
    setConfig2({ ...BIKE_CONFIGS.bike2 });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
          Bike Acceleration Calculator
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
          Compare bicycle performance for ultra-distance cycling races using differential equation modeling. 
          Analyze the impact of repeated accelerations and complex terrain profiles on race times.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Parameters */}
        <div className="space-y-6">
          {/* Rider Parameters */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Rider Parameters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Power Output"
                value={riderConfig.P}
                onChange={(P) => setRiderConfig(prev => ({ ...prev, P }))}
                unit="W"
                min={50}
                max={500}
                description="Sustained power output during the ride"
              />
              <InputField
                label="Rider Mass"
                value={riderConfig.mf}
                onChange={(mf) => setRiderConfig(prev => ({ ...prev, mf }))}
                unit="kg"
                min={40}
                max={150}
                description="Body weight of the rider"
              />
            </div>
          </div>

          {/* Terrain Parameters */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Ultra-Distance Race Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Total Elevation Climbed"
                value={terrainConfig.hm}
                onChange={(hm) => setTerrainConfig(prev => ({ ...prev, hm }))}
                unit="m"
                min={0}
                max={15000}
                description="Total vertical meters climbed during the race"
              />
              <InputField
                label="Total Distance"
                value={terrainConfig.L}
                onChange={(L) => setTerrainConfig(prev => ({ ...prev, L }))}
                unit="km"
                min={100}
                max={5000}
                description="Total race distance in kilometers"
              />
              <InputField
                label="Climbing Fraction"
                value={Math.round(terrainConfig.ha * 100) / 100}
                onChange={(ha) => setTerrainConfig(prev => ({ ...prev, ha: Math.round(ha * 100) / 100 }))}
                unit=""
                min={0}
                max={1}
                step={0.01}
                description="Fraction of distance spent climbing (0.00-1.00)"
              />
              <InputField
                label="Descending Fraction"
                value={Math.round(terrainConfig.hd * 100) / 100}
                onChange={(hd) => setTerrainConfig(prev => ({ ...prev, hd: Math.round(hd * 100) / 100 }))}
                unit=""
                min={0}
                max={1}
                step={0.01}
                description="Fraction of distance spent descending (0.00-1.00)"
              />
              <div className="md:col-span-2">
                <InputField
                  label="Distance Between Stops"
                  value={terrainConfig.dx}
                  onChange={(dx) => setTerrainConfig(prev => ({ ...prev, dx }))}
                  unit="m"
                  min={100}
                  max={10000}
                  description="Average distance between stops (traffic lights, corners, etc.) requiring acceleration"
                />
              </div>
            </div>
          </div>

          {/* Advanced Bike Parameters */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Bike Configurations</h2>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-white/80 hover:text-white text-sm"
              >
                {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
              </button>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Bike 1</label>
                <select
                  value={config1.name}
                  onChange={(e) => {
                    const preset = Object.values(BIKE_CONFIGS).find(c => c.name === e.target.value);
                    if (preset) setConfig1({ ...preset });
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                >
                  {Object.values(BIKE_CONFIGS).map(config => (
                    <option key={config.name} value={config.name} className="bg-gray-800">
                      {config.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Bike 2</label>
                <select
                  value={config2.name}
                  onChange={(e) => {
                    const preset = Object.values(BIKE_CONFIGS).find(c => c.name === e.target.value);
                    if (preset) setConfig2({ ...preset });
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                >
                  {Object.values(BIKE_CONFIGS).map(config => (
                    <option key={config.name} value={config.name} className="bg-gray-800">
                      {config.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bike 1 Advanced */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">{config1.name} - Advanced</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <InputField
                        label="Moment of Inertia"
                        value={config1.I}
                        onChange={(I) => setConfig1(prev => ({ ...prev, I }))}
                        unit="kg⋅m²"
                        min={0.01}
                        max={1}
                        step={0.001}
                      />
                      {onNavigateToInertia && (
                        <button
                          onClick={onNavigateToInertia}
                          className="text-xs text-blue-400 hover:text-blue-300 underline"
                        >
                          → Calculate wheel inertia
                        </button>
                      )}
                    </div>
                    <InputField
                      label="Wheel Radius"
                      value={config1.r}
                      onChange={(r) => setConfig1(prev => ({ ...prev, r }))}
                      unit="m"
                      min={0.2}
                      max={0.4}
                      step={0.01}
                    />
                    <InputField
                      label="Bike Mass"
                      value={config1.mb}
                      onChange={(mb) => setConfig1(prev => ({ ...prev, mb }))}
                      unit="kg"
                      min={5}
                      max={25}
                      step={0.1}
                    />
                    <InputField
                      label="Rolling Resistance"
                      value={config1.cr}
                      onChange={(cr) => setConfig1(prev => ({ ...prev, cr }))}
                      unit=""
                      min={0.001}
                      max={0.01}
                      step={0.0001}
                    />
                    <InputField
                      label="Drag Coefficient × Area"
                      value={config1.cwA}
                      onChange={(cwA) => setConfig1(prev => ({ ...prev, cwA }))}
                      unit="m²"
                      min={0.1}
                      max={0.8}
                      step={0.01}
                    />
                  </div>
                </div>

                {/* Bike 2 Advanced */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">{config2.name} - Advanced</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <InputField
                        label="Moment of Inertia"
                        value={config2.I}
                        onChange={(I) => setConfig2(prev => ({ ...prev, I }))}
                        unit="kg⋅m²"
                        min={0.01}
                        max={1}
                        step={0.001}
                      />
                      {onNavigateToInertia && (
                        <button
                          onClick={onNavigateToInertia}
                          className="text-xs text-blue-400 hover:text-blue-300 underline"
                        >
                          → Calculate wheel inertia
                        </button>
                      )}
                    </div>
                    <InputField
                      label="Wheel Radius"
                      value={config2.r}
                      onChange={(r) => setConfig2(prev => ({ ...prev, r }))}
                      unit="m"
                      min={0.2}
                      max={0.4}
                      step={0.01}
                    />
                    <InputField
                      label="Bike Mass"
                      value={config2.mb}
                      onChange={(mb) => setConfig2(prev => ({ ...prev, mb }))}
                      unit="kg"
                      min={5}
                      max={25}
                      step={0.1}
                    />
                    <InputField
                      label="Rolling Resistance"
                      value={config2.cr}
                      onChange={(cr) => setConfig2(prev => ({ ...prev, cr }))}
                      unit=""
                      min={0.001}
                      max={0.01}
                      step={0.0001}
                    />
                    <InputField
                      label="Drag Coefficient × Area"
                      value={config2.cwA}
                      onChange={(cwA) => setConfig2(prev => ({ ...prev, cwA }))}
                      unit="m²"
                      min={0.1}
                      max={0.8}
                      step={0.01}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {isCalculating ? 'Calculating...' : 'Calculate Performance'}
            </button>
            <button
              onClick={resetToDefaults}
              className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Loading State */}
          {isCalculating && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                <h2 className="text-xl font-semibold text-white mb-2">Calculating Performance...</h2>
                <p className="text-white/70 text-center">
                  Solving differential equations and comparing bike configurations
                </p>
              </div>
            </div>
          )}
          {/* Comparison Results */}
          {comparisonResult && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Performance Comparison</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{comparisonResult.config1.name}</h3>
                  <div className="space-y-2 text-white/90">
                    <div>Final Speed: <span className="font-semibold">{comparisonResult.config1.finalVelocity.toFixed(1)} km/h</span></div>
                    <div>Total Time: <span className="font-semibold">{(comparisonResult.config1.totalTime / 60).toFixed(1)} min</span></div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{comparisonResult.config2.name}</h3>
                  <div className="space-y-2 text-white/90">
                    <div>Final Speed: <span className="font-semibold">{comparisonResult.config2.finalVelocity.toFixed(1)} km/h</span></div>
                    <div>Total Time: <span className="font-semibold">{(comparisonResult.config2.totalTime / 60).toFixed(1)} min</span></div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-white/80 text-sm mb-1">Time Difference</div>
                <div className={`text-2xl font-bold ${comparisonResult.timeDifference > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.abs(comparisonResult.timeDifference).toFixed(1)} minutes
                </div>
                <div className="text-white/70 text-sm mt-1">
                  {comparisonResult.timeDifference > 0 
                    ? `${comparisonResult.config1.name} is faster` 
                    : `${comparisonResult.config2.name} is faster`}
                </div>
              </div>
            </div>
          )}

          {/* Performance Analysis Chart */}
          {comparisonResult && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Performance Analysis</h2>
              <PowerAnalysisChart 
                data={{
                  config1Name: comparisonResult.config1.name,
                  config2Name: comparisonResult.config2.name,
                  config1Time: comparisonResult.config1.totalTime,
                  config2Time: comparisonResult.config2.totalTime,
                  config1FinalVelocity: comparisonResult.config1.finalVelocity,
                  config2FinalVelocity: comparisonResult.config2.finalVelocity,
                  timeDifference: comparisonResult.timeDifference
                }}
              />
            </div>
          )}

          {/* Velocity Chart */}
          {velocityCurves && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <VelocityChart 
                data={velocityCurves}
                config1Name={config1.name}
                config2Name={config2.name}
              />
            </div>
          )}

          {/* Distance Chart */}
          {velocityCurves && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <DistanceChart 
                data={velocityCurves}
                config1Name={config1.name}
                config2Name={config2.name}
              />
            </div>
          )}

          {/* Data Table */}
          {velocityCurves && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Detailed Data</h2>
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-sm text-white/80">
                  <thead>
                    <tr className="border-b border-white/20 sticky top-0 bg-white/10">
                      <th className="text-left py-2 px-2">Time (s)</th>
                      <th className="text-left py-2 px-2">{config1.name} Velocity</th>
                      <th className="text-left py-2 px-2">{config2.name} Velocity</th>
                      <th className="text-left py-2 px-2">{config1.name} Distance</th>
                      <th className="text-left py-2 px-2">{config2.name} Distance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {velocityCurves.filter((_, i) => i % 6 === 0).map((point, i) => (
                      <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-1 px-2">{point.time}</td>
                        <td className="py-1 px-2">{point.velocity1.toFixed(1)} km/h</td>
                        <td className="py-1 px-2">{point.velocity2.toFixed(1)} km/h</td>
                        <td className="py-1 px-2">{point.distance1.toFixed(0)} m</td>
                        <td className="py-1 px-2">{point.distance2.toFixed(0)} m</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Physics Information */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Physics Model</h2>
            <div className="text-white/90 text-sm space-y-3">
              <p>
                This calculator uses the <a href="https://www.npmjs.com/package/odex" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">odex library</a> to solve the differential equation:
              </p>
              <div className="bg-white/10 rounded p-3 font-mono text-xs">
                ma = P/v - cr×Fn - 0.5×cwA×ρ×v² - Fg×sin(α)
              </div>
              <div className="text-xs space-y-1">
                <div><strong>P:</strong> Power output (W)</div>
                <div><strong>v:</strong> Velocity (m/s)</div>
                <div><strong>m:</strong> Total mass including rotational inertia (kg)</div>
                <div><strong>cr:</strong> Rolling resistance coefficient</div>
                <div><strong>cwA:</strong> Drag coefficient × frontal area (m²)</div>
                <div><strong>ρ:</strong> Air density = 1.2041 kg/m³</div>
                <div><strong>α:</strong> Road gradient angle (rad)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeAccelerationCalculator;

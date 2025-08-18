import { useState, useCallback, useMemo } from 'react';
import WheelDiameterSelector from '../WheelDiameterSelector';
import Warning from '../Warning';

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
  step = 0.1,
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

interface WheelComponents {
  rimWeight: number;      // Gewicht Felge (g)
  rimDiameter: number;    // Durchmesser Felge (mm)
  rimHeight: number;      // Höhe Felge (mm)
  tireWeight: number;     // Gewicht Reifen (g)
  tireThickness: number;  // Dicke Reifen (mm)
  spokesWeight: number;   // Gewicht Speichen (g)
}

interface InertiaResults {
  rimCenterDistance: number;      // Distanz Schwerpunkt Felge (mm)
  rimInertia: number;            // Trägheitsmoment Felge (kg⋅m²)
  tireCenterDistance: number;     // Distanz Schwerpunkt Reifen (mm)
  tireInertia: number;           // Trägheitsmoment Reifen (kg⋅m²)
  spokesInertia: number;         // Trägheitsmoment Speichen (kg⋅m²)
  totalInertia: number;          // Trägheitsmoment Gesamt (kg⋅m²)
  totalInertiaPerWheel: number;  // Per wheel (divide by 2)
}

const MomentOfInertiaCalculator: React.FC = () => {
  const [wheelComponents, setWheelComponents] = useState<WheelComponents>({
    rimWeight: 300,        // g
    rimDiameter: 622,      // mm
    rimHeight: 35,         // mm
    tireWeight: 200,       // g
    tireThickness: 34,     // mm
    spokesWeight: 160      // g
  });

  // Calculate moment of inertia based on the German formula
  const inertiaResults = useMemo<InertiaResults>(() => {
    const { rimWeight, rimDiameter, rimHeight, tireWeight, tireThickness, spokesWeight } = wheelComponents;
    
    // Convert to SI units for calculations
    const rimWeightKg = rimWeight / 1000;  // kg
    const tireWeightKg = tireWeight / 1000; // kg
    const spokesWeightKg = spokesWeight / 1000; // kg
    
    // Calculate center distances (in mm, then convert to m for inertia calculation)
    const rimCenterDistance = rimDiameter / 2 - rimHeight / 2; // mm
    const tireCenterDistance = rimDiameter / 2 + tireThickness / 2; // mm
    
    // Calculate moments of inertia (using the German formulas)
    const rimInertia = rimWeightKg * Math.pow(rimCenterDistance / 1000, 2); // kg⋅m²
    const tireInertia = tireWeightKg * Math.pow(tireCenterDistance / 1000, 2); // kg⋅m²
    
    // Spokes inertia: ((rim_diameter/2 - rim_height)/1000)^3 / 3 * spokes_weight_kg
    const spokesInertia = Math.pow((rimDiameter / 2 - rimHeight) / 1000, 3) / 3 * spokesWeightKg; // kg⋅m²
    
    // Total inertia for both wheels (multiply by 2)
    const totalInertiaPerWheel = rimInertia + tireInertia + spokesInertia;
    const totalInertia = totalInertiaPerWheel * 2;
    
    return {
      rimCenterDistance,
      rimInertia,
      tireCenterDistance,
      tireInertia,
      spokesInertia,
      totalInertia,
      totalInertiaPerWheel
    };
  }, [wheelComponents]);

  const resetToDefaults = useCallback(() => {
    setWheelComponents({
      rimWeight: 300,
      rimDiameter: 622,
      rimHeight: 35,
      tireWeight: 200,
      tireThickness: 34,
      spokesWeight: 160
    });
  }, []);

  const copyToClipboard = useCallback((value: number) => {
    navigator.clipboard.writeText(value.toFixed(6));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
          Moment of Inertia Calculator
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
          Calculate the rotational moment of inertia for bicycle wheels. 
          Essential for accurate bike acceleration modeling and performance analysis.
        </p>
        <Warning message="Estimation, based on assuming equally distributed weight in the rim, tire and spokes." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Parameters */}
        <div className="space-y-6">
          {/* Rim Parameters */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Rim (Felge)</h2>
            <div className="space-y-4">
              <InputField
                label="Rim Weight"
                value={wheelComponents.rimWeight}
                onChange={(rimWeight) => setWheelComponents(prev => ({ ...prev, rimWeight }))}
                unit="g"
                min={100}
                max={1000}
                step={10}
                description="Weight of the rim/wheel body"
              />
              <WheelDiameterSelector
                selectedDiameter={wheelComponents.rimDiameter}
                onDiameterChange={(rimDiameter) => setWheelComponents(prev => ({ ...prev, rimDiameter }))}
                label="Wheel Size"
                description="Select common wheel size or enter custom diameter"
              />
              <InputField
                label="Rim Height"
                value={wheelComponents.rimHeight}
                onChange={(rimHeight) => setWheelComponents(prev => ({ ...prev, rimHeight }))}
                unit="mm"
                min={10}
                max={100}
                step={1}
                description="Height/depth of the rim profile"
              />
            </div>
          </div>

          {/* Tire Parameters */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Tire (Reifen)</h2>
            <div className="space-y-4">
              <InputField
                label="Tire Weight"
                value={wheelComponents.tireWeight}
                onChange={(tireWeight) => setWheelComponents(prev => ({ ...prev, tireWeight }))}
                unit="g"
                min={50}
                max={1000}
                step={10}
                description="Weight of the tire"
              />
              <InputField
                label="Tire Thickness"
                value={wheelComponents.tireThickness}
                onChange={(tireThickness) => setWheelComponents(prev => ({ ...prev, tireThickness }))}
                unit="mm"
                min={15}
                max={60}
                step={1}
                description="Radial thickness of the tire"
              />
            </div>
          </div>

          {/* Spokes Parameters */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Spokes (Speichen)</h2>
            <div className="space-y-4">
              <InputField
                label="Spokes Weight"
                value={wheelComponents.spokesWeight}
                onChange={(spokesWeight) => setWheelComponents(prev => ({ ...prev, spokesWeight }))}
                unit="g"
                min={50}
                max={500}
                step={10}
                description="Total weight of all spokes and nipples"
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4">
            <button
              onClick={resetToDefaults}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Calculation Results */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Calculation Results</h2>
            
            <div className="space-y-4">
              {/* Rim Results */}
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Rim</h3>
                <div className="space-y-2 text-white/90 text-sm">
                  <div className="flex justify-between">
                    <span>Center Distance:</span>
                    <span className="font-mono">{inertiaResults.rimCenterDistance.toFixed(1)} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Moment of Inertia:</span>
                    <span className="font-mono">{inertiaResults.rimInertia.toFixed(6)} kg⋅m²</span>
                  </div>
                </div>
              </div>

              {/* Tire Results */}
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Tire</h3>
                <div className="space-y-2 text-white/90 text-sm">
                  <div className="flex justify-between">
                    <span>Center Distance:</span>
                    <span className="font-mono">{inertiaResults.tireCenterDistance.toFixed(1)} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Moment of Inertia:</span>
                    <span className="font-mono">{inertiaResults.tireInertia.toFixed(6)} kg⋅m²</span>
                  </div>
                </div>
              </div>

              {/* Spokes Results */}
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Spokes</h3>
                <div className="space-y-2 text-white/90 text-sm">
                  <div className="flex justify-between">
                    <span>Moment of Inertia:</span>
                    <span className="font-mono">{inertiaResults.spokesInertia.toFixed(6)} kg⋅m²</span>
                  </div>
                </div>
              </div>

              {/* Total Results */}
              <div className="bg-blue-600/20 border border-blue-400/40 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Total Results</h3>
                <div className="space-y-2 text-white/90">
                  <div className="flex justify-between">
                    <span>Per Wheel:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg">{inertiaResults.totalInertiaPerWheel.toFixed(6)} kg⋅m²</span>
                      <button
                        onClick={() => copyToClipboard(inertiaResults.totalInertiaPerWheel)}
                        className="text-white/60 hover:text-white transition-colors"
                        title="Copy to clipboard"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Both Wheels:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg">{inertiaResults.totalInertia.toFixed(6)} kg⋅m²</span>
                      <button
                        onClick={() => copyToClipboard(inertiaResults.totalInertia)}
                        className="text-white/60 hover:text-white transition-colors"
                        title="Copy to clipboard"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formula Explanation */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Calculation Formulas</h2>
            <div className="text-white/90 text-sm space-y-3">
              <div>
                <h3 className="font-semibold text-white mb-2">Center Distances:</h3>
                <div className="bg-white/10 rounded p-3 font-mono text-xs space-y-1">
                  <div>Rim Center = (Diameter / 2) - (Height / 2)</div>
                  <div>Tire Center = (Diameter / 2) + (Thickness / 2)</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Moments of Inertia:</h3>
                <div className="bg-white/10 rounded p-3 font-mono text-xs space-y-1">
                  <div>I_rim = m_rim × r_rim²</div>
                  <div>I_tire = m_tire × r_tire²</div>
                  <div>I_spokes = ((D/2 - H)/1000)³ / 3 × m_spokes</div>
                  <div>I_total = (I_rim + I_tire + I_spokes) × 2</div>
                </div>
              </div>

              <div className="text-xs space-y-1">
                <div><strong>Where:</strong></div>
                <div>• m = mass (kg), r = radius (m)</div>
                <div>• D = rim diameter, H = rim height</div>
                <div>• Factor of 2 accounts for both wheels</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MomentOfInertiaCalculator;

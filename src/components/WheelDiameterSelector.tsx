import React from 'react';
import { COMMON_WHEEL_SIZES } from '../utils/wheelSizes';

interface WheelDiameterSelectorProps {
  selectedDiameter: number;
  onDiameterChange: (diameter: number) => void;
  onCustomDiameter?: (diameter: number) => void;
  className?: string;
  label?: string;
  description?: string;
}

const WheelDiameterSelector: React.FC<WheelDiameterSelectorProps> = ({
  selectedDiameter,
  onDiameterChange,
  onCustomDiameter,
  className = '',
  label = 'Wheel Size',
  description = 'Select common wheel size or choose custom'
}) => {
  const [isCustom, setIsCustom] = React.useState(false);
  const [customValue, setCustomValue] = React.useState(selectedDiameter);

  // Find the currently selected wheel size or mark as custom
  const selectedWheelSize = COMMON_WHEEL_SIZES.find(
    wheel => wheel.diameter === selectedDiameter && wheel.name !== 'Custom'
  );

  React.useEffect(() => {
    if (!selectedWheelSize && selectedDiameter !== COMMON_WHEEL_SIZES.find(w => w.name === 'Custom')?.diameter) {
      setIsCustom(true);
      setCustomValue(selectedDiameter);
    } else if (selectedWheelSize) {
      setIsCustom(false);
    }
  }, [selectedDiameter, selectedWheelSize]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = event.target.value;
    const wheelSize = COMMON_WHEEL_SIZES.find(w => w.name === selectedName);
    
    if (wheelSize) {
      if (wheelSize.name === 'Custom') {
        setIsCustom(true);
        setCustomValue(selectedDiameter);
      } else {
        setIsCustom(false);
        onDiameterChange(wheelSize.diameter);
      }
    }
  };

  const handleCustomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value) || 0;
    setCustomValue(value);
    if (onCustomDiameter) {
      onCustomDiameter(value);
    } else {
      onDiameterChange(value);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-white">
        {label}
        {description && (
          <span className="block text-xs text-white/70 font-normal mt-1">
            {description}
          </span>
        )}
      </label>
      
      <div className="space-y-3">
        {/* Dropdown selector */}
        <select
          value={isCustom ? 'Custom' : (selectedWheelSize?.name || 'Custom')}
          onChange={handleSelectChange}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        >
          {COMMON_WHEEL_SIZES.map((wheelSize) => (
            <option key={wheelSize.name} value={wheelSize.name} className="bg-gray-800 text-white">
              {wheelSize.name} - {wheelSize.diameter}mm
            </option>
          ))}
        </select>

        {/* Custom diameter input */}
        {isCustom && (
          <div className="flex">
            <input
              type="number"
              value={customValue}
              onChange={handleCustomChange}
              min={200}
              max={800}
              step={1}
              placeholder="Enter diameter in mm"
              className="flex-1 bg-white/10 border border-white/20 rounded-l-lg px-3 py-2 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <span className="bg-white/20 border border-l-0 border-white/20 rounded-r-lg px-3 py-2 text-white/80 text-sm">
              mm
            </span>
          </div>
        )}

        {/* Description of selected wheel size */}
        {!isCustom && selectedWheelSize && (
          <p className="text-xs text-white/60 italic">
            {selectedWheelSize.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default WheelDiameterSelector;
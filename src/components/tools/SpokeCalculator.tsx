import React, { useState, useMemo } from 'react'

interface HubPreset {
  name: string
  leftPCD: number
  rightPCD: number
  leftOffset: number
  rightOffset: number
}

const SpokeCalculator: React.FC = () => {
  const [rimERD, setRimERD] = useState<string>('')
  const [selectedHubPreset, setSelectedHubPreset] = useState<string>('')
  
  // Left side parameters
  const [leftPCD, setLeftPCD] = useState<string>('')
  const [leftOffset, setLeftOffset] = useState<string>('')
  const [leftCrossPattern, setLeftCrossPattern] = useState<string>('3')
  const [leftSpokeCount, setLeftSpokeCount] = useState<string>('16')
  
  // Right side parameters
  const [rightPCD, setRightPCD] = useState<string>('')
  const [rightOffset, setRightOffset] = useState<string>('')
  const [rightCrossPattern, setRightCrossPattern] = useState<string>('3')
  const [rightSpokeCount, setRightSpokeCount] = useState<string>('16')

  // Hub presets - will be expanded later
  const hubPresets: HubPreset[] = [
    { name: 'Standard Road/MTB Front', leftPCD: 58, rightPCD: 58, leftOffset: 32.5, rightOffset: 32.5 },
    { name: 'Standard Road/MTB Rear', leftPCD: 58, rightPCD: 58, leftOffset: 42, rightOffset: 17 },
    { name: 'Shimano 105/Ultegra Front', leftPCD: 52, rightPCD: 52, leftOffset: 32.5, rightOffset: 32.5 },
    { name: 'Shimano 105/Ultegra Rear', leftPCD: 52, rightPCD: 52, leftOffset: 40, rightOffset: 17.5 },
    { name: 'DT Swiss 240s Road Front', leftPCD: 58, rightPCD: 58, leftOffset: 32.5, rightOffset: 32.5 },
    { name: 'DT Swiss 240s Road Rear', leftPCD: 58, rightPCD: 58, leftOffset: 41, rightOffset: 17 },
    { name: 'Chris King R45 Front', leftPCD: 58, rightPCD: 58, leftOffset: 32.5, rightOffset: 32.5 },
    { name: 'Chris King R45 Rear', leftPCD: 58, rightPCD: 58, leftOffset: 42, rightOffset: 17 },
  ]

  const calculateSpokeLength = (
    erd: number,
    pcd: number,
    offset: number,
    crossPattern: number,
    spokeCount: number
  ): number => {
    // Calculate the angle between adjacent spoke holes
    const spokeAngle = (2 * Math.PI) / spokeCount
    
    // Calculate the cross angle (angle between spoke and radial line)
    const crossAngle = crossPattern * spokeAngle
    
    // ERD and PCD radii
    const erdRadius = erd / 2
    const pcdRadius = pcd / 2
    
    // Calculate spoke length using the standard formula
    const length = Math.sqrt(
      Math.pow(erdRadius, 2) + 
      Math.pow(pcdRadius, 2) + 
      Math.pow(offset, 2) - 
      (erdRadius * pcdRadius * Math.cos(crossAngle))
    )

    return Math.round(length * 10) / 10 // Round to 1 decimal place
  }

  const spokeLengths = useMemo(() => {
    const erdNum = parseFloat(rimERD)
    const leftPCDNum = parseFloat(leftPCD)
    const leftOffsetNum = parseFloat(leftOffset)
    const leftCrossNum = parseInt(leftCrossPattern)
    const leftSpokeCountNum = parseInt(leftSpokeCount)
    
    const rightPCDNum = parseFloat(rightPCD)
    const rightOffsetNum = parseFloat(rightOffset)
    const rightCrossNum = parseInt(rightCrossPattern)
    const rightSpokeCountNum = parseInt(rightSpokeCount)

    if (!erdNum) {
      return null
    }

    const results: {
      left?: number
      right?: number
      totalSpokes: number
      isAsymmetric: boolean
    } = {
      totalSpokes: (leftSpokeCountNum || 0) + (rightSpokeCountNum || 0),
      isAsymmetric: leftSpokeCountNum !== rightSpokeCountNum || leftCrossNum !== rightCrossNum
    }

    // Calculate left side if all parameters are available
    if (leftPCDNum && leftOffsetNum && !isNaN(leftCrossNum) && leftSpokeCountNum) {
      results.left = calculateSpokeLength(erdNum, leftPCDNum, leftOffsetNum, leftCrossNum, leftSpokeCountNum * 2)
    }

    // Calculate right side if all parameters are available
    if (rightPCDNum && rightOffsetNum && !isNaN(rightCrossNum) && rightSpokeCountNum) {
      results.right = calculateSpokeLength(erdNum, rightPCDNum, rightOffsetNum, rightCrossNum, rightSpokeCountNum * 2)
    }

    return results
  }, [rimERD, leftPCD, leftOffset, leftCrossPattern, leftSpokeCount, rightPCD, rightOffset, rightCrossPattern, rightSpokeCount])

  const handleHubPresetChange = (presetName: string) => {
    setSelectedHubPreset(presetName)
    if (presetName === '') return

    const preset = hubPresets.find(p => p.name === presetName)
    if (preset) {
      setLeftPCD(preset.leftPCD.toString())
      setRightPCD(preset.rightPCD.toString())
      setLeftOffset(preset.leftOffset.toString())
      setRightOffset(preset.rightOffset.toString())
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            🛞 Advanced Spoke Length Calculator
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Calculate precise spoke lengths for bicycle wheel building with support for asymmetric spoking patterns and separate left/right side configurations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rim & Hub Selection */}
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6">Rim & Hub Setup</h2>
            
            {/* Rim ERD */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">
                Rim ERD (Effective Rim Diameter) - mm
              </label>
              <input
                type="number"
                value={rimERD}
                onChange={(e) => setRimERD(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g., 590"
                step="0.1"
              />
              <p className="text-xs text-white/60 mt-1">
                ERD is measured from nipple seat to nipple seat, not the rim diameter
              </p>
            </div>

            {/* Hub Preset Selection */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">
                Hub Preset (Optional)
              </label>
              <select
                value={selectedHubPreset}
                onChange={(e) => handleHubPresetChange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select a hub preset...</option>
                {hubPresets.map((preset) => (
                  <option key={preset.name} value={preset.name}>
                    {preset.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-white/60 mt-1">
                Selecting a preset will fill in the hub dimensions below
              </p>
            </div>
          </div>

          {/* Left Side Configuration */}
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6">Left Side (Non-Drive)</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Hub PCD - mm
                </label>
                <input
                  type="number"
                  value={leftPCD}
                  onChange={(e) => setLeftPCD(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., 58"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Flange Offset - mm
                </label>
                <input
                  type="number"
                  value={leftOffset}
                  onChange={(e) => setLeftOffset(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., 42"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Cross Pattern
                </label>
                <select
                  value={leftCrossPattern}
                  onChange={(e) => setLeftCrossPattern(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="0">Radial (0 cross)</option>
                  <option value="1">1 Cross</option>
                  <option value="2">2 Cross</option>
                  <option value="3">3 Cross</option>
                  <option value="4">4 Cross</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Number of Spokes
                </label>
                <input
                  type="number"
                  value={leftSpokeCount}
                  onChange={(e) => setLeftSpokeCount(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., 16"
                  min="4"
                  max="36"
                />
              </div>
            </div>
          </div>

          {/* Right Side Configuration */}
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6">Right Side (Drive)</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Hub PCD - mm
                </label>
                <input
                  type="number"
                  value={rightPCD}
                  onChange={(e) => setRightPCD(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., 58"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Flange Offset - mm
                </label>
                <input
                  type="number"
                  value={rightOffset}
                  onChange={(e) => setRightOffset(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., 17"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Cross Pattern
                </label>
                <select
                  value={rightCrossPattern}
                  onChange={(e) => setRightCrossPattern(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="0">Radial (0 cross)</option>
                  <option value="1">1 Cross</option>
                  <option value="2">2 Cross</option>
                  <option value="3">3 Cross</option>
                  <option value="4">4 Cross</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Number of Spokes
                </label>
                <input
                  type="number"
                  value={rightSpokeCount}
                  onChange={(e) => setRightSpokeCount(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., 16"
                  min="4"
                  max="36"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-8 backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-6">Calculation Results</h2>
          
          {spokeLengths && (spokeLengths.left || spokeLengths.right) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Side Result */}
              {spokeLengths.left && (
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    {spokeLengths.left} mm
                  </div>
                  <div className="text-lg text-white/90 mb-2">Left Side Length</div>
                  <div className="text-sm text-white/70">
                    {leftSpokeCount} spokes, {leftCrossPattern} cross
                  </div>
                </div>
              )}

              {/* Right Side Result */}
              {spokeLengths.right && (
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2">
                    {spokeLengths.right} mm
                  </div>
                  <div className="text-lg text-white/90 mb-2">Right Side Length</div>
                  <div className="text-sm text-white/70">
                    {rightSpokeCount} spokes, {rightCrossPattern} cross
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔧</div>
              <div className="text-xl text-white/70 mb-2">
                Enter wheel specifications
              </div>
              <div className="text-white/60">
                Fill in the rim ERD and hub dimensions for at least one side to calculate spoke lengths
              </div>
            </div>
          )}

          {spokeLengths && (spokeLengths.left || spokeLengths.right) && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Summary */}
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-3">Wheel Summary</h3>
                <div className="space-y-2 text-sm text-white/80">
                  <div className="flex justify-between">
                    <span>Total Spokes:</span>
                    <span>{spokeLengths.totalSpokes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pattern Type:</span>
                    <span>{spokeLengths.isAsymmetric ? 'Asymmetric' : 'Symmetric'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rim ERD:</span>
                    <span>{rimERD} mm</span>
                  </div>
                </div>
              </div>

              {/* Ordering Tips */}
              <div className="bg-yellow-600/20 border border-yellow-400/40 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">💡 Ordering Tips</h3>
                <ul className="text-sm text-yellow-200 space-y-1">
                  <li>• Order spokes 1-2mm longer than calculated</li>
                  <li>• Specify left and right side quantities separately</li>
                  <li>• Consider spoke stretch under tension</li>
                  <li>• Verify ERD with rim manufacturer</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Information Section */}
        <div className="mt-8 backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">Understanding Asymmetric Wheel Building</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/80">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Key Concepts</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>ERD:</strong> Measured from nipple seat to nipple seat, typically 20-30mm less than rim diameter</li>
                <li><strong>Asymmetric Spoking:</strong> Different spoke counts or patterns on each side (e.g., 8/16, 0x/2x)</li>
                <li><strong>Flange Offset:</strong> Distance from hub centerline to each flange face</li>
                <li><strong>Cross Pattern:</strong> How many spokes each spoke crosses before reaching the rim</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Common Patterns</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>0x/2x:</strong> Radial non-drive, 2-cross drive side</li>
                <li><strong>1x/3x:</strong> 1-cross non-drive, 3-cross drive side</li>
                <li><strong>16/20:</strong> 16 spokes non-drive, 20 spokes drive side</li>
                <li><strong>Radial Front:</strong> Both sides radial for lightweight builds</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpokeCalculator
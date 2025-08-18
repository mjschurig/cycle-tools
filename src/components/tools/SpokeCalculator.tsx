import React, { useState, useMemo } from 'react'

const SpokeCalculator: React.FC = () => {
  const [rimERD, setRimERD] = useState<string>('')
  const [hubPCD, setHubPCD] = useState<string>('')
  const [flangeOffset, setFlangeOffset] = useState<string>('')
  const [crossPattern, setCrossPattern] = useState<string>('3')
  const [spokeCount, setSpokeCount] = useState<string>('32')

  // Common rim ERD values for quick selection
  const commonERDs = [
    { size: '700c', erd: 622, description: '700c / 29er' },
    { size: '650b', erd: 584, description: '650b / 27.5"' },
    { size: '26"', erd: 559, description: '26" MTB' },
    { size: '24"', erd: 507, description: '24" wheel' },
    { size: '20"', erd: 406, description: '20" BMX/Folding' },
  ]

  // Common hub specifications
  const commonHubs = [
    { name: 'Standard Road/MTB Front', pcd: 58, offset: 32.5 },
    { name: 'Standard Road/MTB Rear Drive', pcd: 58, offset: 17 },
    { name: 'Standard Road/MTB Rear Non-Drive', pcd: 58, offset: 42 },
    { name: 'Shimano 105/Ultegra Front', pcd: 52, offset: 32.5 },
    { name: 'Shimano 105/Ultegra Rear Drive', pcd: 52, offset: 17.5 },
    { name: 'Shimano 105/Ultegra Rear Non-Drive', pcd: 52, offset: 40 },
  ]

  const spokeLength = useMemo(() => {
    const erdNum = parseFloat(rimERD)
    const pcdNum = parseFloat(hubPCD)
    const offsetNum = parseFloat(flangeOffset)
    const crossNum = parseInt(crossPattern)
    const spokeCountNum = parseInt(spokeCount)

    if (!erdNum || !pcdNum || !offsetNum || isNaN(crossNum) || !spokeCountNum) {
      return null
    }

    // Spoke length calculation formula
    // L = sqrt((ERD/2)² + (PCD/2)² + Offset² - ERD * PCD/2 * cos(Cross_angle))
    
    // Calculate the angle between adjacent spoke holes
    const spokeAngle = (2 * Math.PI) / spokeCountNum
    
    // Calculate the cross angle (angle between spoke and radial line)
    const crossAngle = crossNum * spokeAngle
    
    // ERD and PCD radii
    const erdRadius = erdNum / 2
    const pcdRadius = pcdNum / 2
    
    // Calculate spoke length using the standard formula
    const length = Math.sqrt(
      Math.pow(erdRadius, 2) + 
      Math.pow(pcdRadius, 2) + 
      Math.pow(offsetNum, 2) - 
      (erdRadius * pcdRadius * Math.cos(crossAngle))
    )

    return Math.round(length * 10) / 10 // Round to 1 decimal place
  }, [rimERD, hubPCD, flangeOffset, crossPattern, spokeCount])

  const handleERDSelect = (erd: number) => {
    setRimERD(erd.toString())
  }

  const handleHubSelect = (hub: { pcd: number; offset: number }) => {
    setHubPCD(hub.pcd.toString())
    setFlangeOffset(hub.offset.toString())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            🛞 Spoke Length Calculator
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Calculate precise spoke lengths for bicycle wheel building using rim ERD, hub specifications, and lacing patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6">Wheel Specifications</h2>
            
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
                placeholder="e.g., 622"
                step="0.1"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {commonERDs.map((rim) => (
                  <button
                    key={rim.size}
                    onClick={() => handleERDSelect(rim.erd)}
                    className="px-3 py-1 text-xs bg-blue-600/30 hover:bg-blue-600/50 text-white rounded-md transition-colors border border-blue-400/30"
                  >
                    {rim.description}
                  </button>
                ))}
              </div>
            </div>

            {/* Hub PCD */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">
                Hub PCD (Pitch Circle Diameter) - mm
              </label>
              <input
                type="number"
                value={hubPCD}
                onChange={(e) => setHubPCD(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g., 58"
                step="0.1"
              />
            </div>

            {/* Flange Offset */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">
                Flange Offset (from hub center) - mm
              </label>
              <input
                type="number"
                value={flangeOffset}
                onChange={(e) => setFlangeOffset(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g., 32.5"
                step="0.1"
              />
            </div>

            {/* Common Hub Presets */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">
                Common Hub Presets
              </label>
              <div className="space-y-2">
                {commonHubs.map((hub, index) => (
                  <button
                    key={index}
                    onClick={() => handleHubSelect(hub)}
                    className="w-full px-3 py-2 text-sm bg-purple-600/30 hover:bg-purple-600/50 text-white rounded-md transition-colors border border-purple-400/30 text-left"
                  >
                    {hub.name} (PCD: {hub.pcd}mm, Offset: {hub.offset}mm)
                  </button>
                ))}
              </div>
            </div>

            {/* Cross Pattern */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">
                Cross Pattern
              </label>
              <select
                value={crossPattern}
                onChange={(e) => setCrossPattern(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="0">Radial (0 cross)</option>
                <option value="1">1 Cross</option>
                <option value="2">2 Cross</option>
                <option value="3">3 Cross (most common)</option>
                <option value="4">4 Cross</option>
              </select>
            </div>

            {/* Spoke Count */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">
                Total Spoke Count
              </label>
              <select
                value={spokeCount}
                onChange={(e) => setSpokeCount(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="16">16 spokes</option>
                <option value="20">20 spokes</option>
                <option value="24">24 spokes</option>
                <option value="28">28 spokes</option>
                <option value="32">32 spokes</option>
                <option value="36">36 spokes</option>
                <option value="40">40 spokes</option>
              </select>
            </div>
          </div>

          {/* Results Section */}
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6">Calculation Results</h2>
            
            {spokeLength ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-green-400 mb-2">
                    {spokeLength}
                  </div>
                  <div className="text-xl text-white/90 mb-4">millimeters</div>
                  <div className="text-lg text-white/70">
                    Calculated spoke length
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-3">Calculation Summary</h3>
                  <div className="space-y-2 text-sm text-white/80">
                    <div className="flex justify-between">
                      <span>Rim ERD:</span>
                      <span>{rimERD} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hub PCD:</span>
                      <span>{hubPCD} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Flange Offset:</span>
                      <span>{flangeOffset} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cross Pattern:</span>
                      <span>{crossPattern} cross</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Spoke Count:</span>
                      <span>{spokeCount} spokes</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-600/20 border border-yellow-400/40 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-yellow-300 mb-2">💡 Spoke Ordering Tips</h3>
                  <ul className="text-sm text-yellow-200 space-y-1">
                    <li>• Order spokes 1-2mm longer than calculated for safety</li>
                    <li>• Different flanges may need different lengths (rear wheels)</li>
                    <li>• Consider spoke stretch under tension</li>
                    <li>• Verify ERD with rim manufacturer specifications</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔧</div>
                <div className="text-xl text-white/70 mb-2">
                  Enter wheel specifications
                </div>
                <div className="text-white/60">
                  Fill in the rim ERD, hub dimensions, and lacing pattern to calculate spoke length
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-8 backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">Understanding Spoke Length Calculation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/80">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Key Measurements</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>ERD (Effective Rim Diameter):</strong> The diameter at which spokes attach to the rim nipples</li>
                <li><strong>PCD (Pitch Circle Diameter):</strong> The diameter of the circle formed by spoke holes in the hub flange</li>
                <li><strong>Flange Offset:</strong> The distance from the hub's centerline to the flange face</li>
                <li><strong>Cross Pattern:</strong> How many spokes each spoke crosses before reaching the rim</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Formula Used</h3>
              <div className="text-sm font-mono bg-black/30 p-3 rounded">
                L = √[(ERD/2)² + (PCD/2)² + Offset² - ERD × PCD/2 × cos(θ)]
              </div>
              <p className="text-sm mt-2">
                Where θ is the cross angle determined by the lacing pattern and spoke count.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpokeCalculator
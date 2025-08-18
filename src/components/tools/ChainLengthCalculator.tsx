import React, { useState, useEffect } from 'react'

interface ChainLengthCalculatorProps {}

const ChainLengthCalculator: React.FC<ChainLengthCalculatorProps> = () => {
  const [chainstayLength, setChainstayLength] = useState<string>('')
  const [largestChainring, setLargestChainring] = useState<string>('')
  const [largestCassette, setLargestCassette] = useState<string>('')
  const [pulleyTeeth, setPulleyTeeth] = useState<string>('11') // Default for most derailleurs
  const [unit, setUnit] = useState<'inches' | 'mm'>('inches')
  const [result, setResult] = useState<number | null>(null)
  const [chainLinks, setChainLinks] = useState<number | null>(null)

  // Calculate chain length whenever inputs change
  useEffect(() => {
    calculateChainLength()
  }, [chainstayLength, largestChainring, largestCassette, pulleyTeeth, unit])

  const calculateChainLength = () => {
    const C = parseFloat(chainstayLength)
    const F = parseFloat(largestChainring)
    const R = parseFloat(largestCassette)
    const P = parseFloat(pulleyTeeth)

    if (isNaN(C) || isNaN(F) || isNaN(R) || isNaN(P) || C <= 0 || F <= 0 || R <= 0 || P <= 0) {
      setResult(null)
      setChainLinks(null)
      return
    }

    let chainstayInches = C
    if (unit === 'mm') {
      chainstayInches = C / 25.4 // Convert mm to inches
    }

    // Standard chain length formula with pulley consideration
    // L = 2C + (F + R + 2P)/4 + 1
    // Where P is the pulley teeth (typically 11 for most derailleurs)
    const chainLengthInches = 2 * chainstayInches + (F + R + 2 * P) / 4 + 1

    setResult(chainLengthInches)
    
    // Calculate number of links (each link is 0.5 inches)
    const links = Math.ceil(chainLengthInches / 0.5)
    setChainLinks(links)
  }

  const formatResult = (value: number) => {
    if (unit === 'mm') {
      return (value * 25.4).toFixed(1)
    }
    return value.toFixed(2)
  }

  const resetForm = () => {
    setChainstayLength('')
    setLargestChainring('')
    setLargestCassette('')
    setPulleyTeeth('11')
    setResult(null)
    setChainLinks(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
            Chain Length Calculator
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Calculate the optimal chain length for your bicycle drivetrain
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Calculator</h2>
            
            {/* Unit Selection */}
            <div className="mb-6">
              <label className="block text-white/90 text-sm font-medium mb-2">
                Measurement Unit
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="unit"
                    value="inches"
                    checked={unit === 'inches'}
                    onChange={(e) => setUnit(e.target.value as 'inches' | 'mm')}
                    className="mr-2"
                  />
                  <span className="text-white/90">Inches</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="unit"
                    value="mm"
                    checked={unit === 'mm'}
                    onChange={(e) => setUnit(e.target.value as 'inches' | 'mm')}
                    className="mr-2"
                  />
                  <span className="text-white/90">Millimeters</span>
                </label>
              </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Chainstay Length ({unit})
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={chainstayLength}
                  onChange={(e) => setChainstayLength(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder={`Enter chainstay length in ${unit}`}
                />
                <p className="text-xs text-white/60 mt-1">
                  Distance from bottom bracket center to rear axle center
                </p>
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Largest Chainring (teeth)
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={largestChainring}
                  onChange={(e) => setLargestChainring(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., 50"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Largest Cassette Cog (teeth)
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={largestCassette}
                  onChange={(e) => setLargestCassette(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., 28"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Derailleur Pulley Teeth
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={pulleyTeeth}
                  onChange={(e) => setPulleyTeeth(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., 11"
                />
                <p className="text-xs text-white/60 mt-1">
                  Standard derailleur pulleys have 11 teeth
                </p>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="mt-6 p-4 bg-green-600/20 border border-green-400/40 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Results</h3>
                <div className="space-y-2">
                  <p className="text-white/90">
                    <span className="font-medium">Chain Length:</span> {formatResult(result)} {unit}
                  </p>
                  <p className="text-white/90">
                    <span className="font-medium">Number of Links:</span> {chainLinks} links
                  </p>
                  <p className="text-white/90">
                    <span className="font-medium">Chain Length (inches):</span> {result.toFixed(2)}"
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={resetForm}
              className="mt-4 w-full bg-red-600/20 hover:bg-red-600/30 border border-red-400/40 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Formula and Explanation Section */}
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Formula & Explanation</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Chain Length Formula</h3>
                <div className="bg-black/20 p-4 rounded-lg font-mono text-white/90 text-center">
                  L = 2C + (F + R + 2P)/4 + 1
                </div>
                <div className="mt-3 text-sm text-white/80 space-y-1">
                  <p><strong>L</strong> = Chain length (inches)</p>
                  <p><strong>C</strong> = Chainstay length (inches)</p>
                  <p><strong>F</strong> = Teeth on largest chainring</p>
                  <p><strong>R</strong> = Teeth on largest cassette cog</p>
                  <p><strong>P</strong> = Teeth on derailleur pulleys</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">How It Works</h3>
                <div className="space-y-3 text-white/80 text-sm">
                  <div className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <p><strong>2C:</strong> Accounts for the chain running along both the top and bottom of the chainstay</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <p><strong>(F + R + 2P)/4:</strong> Calculates additional length needed to wrap around the largest chainring, cassette cog, and both derailleur pulleys</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <p><strong>+1:</strong> Adds extra length for proper derailleur function and smooth shifting</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Important Notes</h3>
                <div className="space-y-2 text-white/80 text-sm">
                  <div className="flex items-start">
                    <span className="text-yellow-400 mr-2">⚠️</span>
                    <p>Always use the largest chainring and largest cassette cog for calculation</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-yellow-400 mr-2">⚠️</span>
                    <p>Chain links come in pairs - round up to the nearest even number if needed</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-yellow-400 mr-2">⚠️</span>
                    <p>Consider adding an extra link for easier installation and maintenance</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Measurement Tips</h3>
                <div className="space-y-2 text-white/80 text-sm">
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">💡</span>
                    <p>Measure chainstay from the center of the bottom bracket to the center of the rear axle</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">💡</span>
                    <p>Count teeth carefully - some chainrings have wear indicators that aren't teeth</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">💡</span>
                    <p>Most modern derailleur pulleys have 11 teeth, but verify on your specific derailleur</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChainLengthCalculator
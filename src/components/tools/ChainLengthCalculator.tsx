import React, { useState, useEffect, useCallback } from 'react'

interface ChainLengthCalculatorProps {}

const ChainLengthCalculator: React.FC<ChainLengthCalculatorProps> = () => {
  const [chainstayLength, setChainstayLength] = useState<string>('410')
  const [largestChainring, setLargestChainring] = useState<string>('53')
  const [largestCassette, setLargestCassette] = useState<string>('25')
  const [upperPulleyTeeth, setUpperPulleyTeeth] = useState<string>('11')
  const [lowerPulleyTeeth, setLowerPulleyTeeth] = useState<string>('11')
  const [result, setResult] = useState<number | null>(null)
  const [chainLinks, setChainLinks] = useState<number | null>(null)

  const calculateChainLength = useCallback(() => {
    const C = parseFloat(chainstayLength)
    const T1 = parseFloat(largestChainring)
    const T2 = parseFloat(largestCassette)
    const Pu = parseFloat(upperPulleyTeeth)
    const Pl = parseFloat(lowerPulleyTeeth)

    if (isNaN(C) || isNaN(T1) || isNaN(T2) || isNaN(Pu) || isNaN(Pl) || C <= 0 || T1 <= 0 || T2 <= 0 || Pu <= 0 || Pl <= 0) {
      setResult(null)
      setChainLinks(null)
      return
    }

    // Calculate NL (Number of chain Links needed to measure chainstay)
    // NL = C (mm) / 12.7, rounded up to nearest even integer
    const NL = C / 12.7

    // Correct chain length formula:
    // Chain length = 2 × NL + 1/2 × T1 + 1/2 × T2 + (Pu + Pl - 20)
    const chainLengthLinks_raw = 2 * NL + 0.5 * T1 + 0.5 * T2 + (Pu + Pl - 20)

    const chainLengthLinks = Math.ceil(chainLengthLinks_raw / 2) * 2
    
    // Convert chain length from links to mm (each link is 12.7mm)
    const chainLengthMm = chainLengthLinks_raw * 12.7
    setResult(chainLengthMm)
    
    // Set the number of links (rounded to nearest integer)
    setChainLinks(chainLengthLinks)
  }, [chainstayLength, largestChainring, largestCassette, upperPulleyTeeth, lowerPulleyTeeth])

  // Calculate chain length whenever inputs change
  useEffect(() => {
    calculateChainLength()
  }, [calculateChainLength])

  const formatResult = (value: number) => {
    return value.toFixed(1)
  }

  const resetForm = () => {
    setChainstayLength('')
    setLargestChainring('')
    setLargestCassette('')
    setUpperPulleyTeeth('11')
    setLowerPulleyTeeth('11')
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
            


            {/* Input Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Chainstay Length - C (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={chainstayLength}
                  onChange={(e) => setChainstayLength(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter chainstay length in mm"
                />
                <p className="text-xs text-white/60 mt-1">
                  Distance from bottom bracket center to rear axle center (used to calculate NL)
                </p>
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Largest Chainring - T1 (teeth)
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
                  Largest Cassette Cog - T2 (teeth)
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Upper Pulley Teeth
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={upperPulleyTeeth}
                    onChange={(e) => setUpperPulleyTeeth(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g., 11"
                  />
                  <p className="text-xs text-white/60 mt-1">
                    Guide pulley (jockey wheel)
                  </p>
                </div>
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Lower Pulley Teeth
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={lowerPulleyTeeth}
                    onChange={(e) => setLowerPulleyTeeth(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g., 11"
                  />
                  <p className="text-xs text-white/60 mt-1">
                    Tension pulley
                  </p>
                </div>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="mt-6 p-4 bg-green-600/20 border border-green-400/40 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Results</h3>
                <div className="space-y-2">
                  <p className="text-white/90">
                    <span className="font-medium">Chain Length:</span> {formatResult(result)} mm
                  </p>
                  <p className="text-white/90">
                    <span className="font-medium">Number of Links:</span> {chainLinks} links
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
                  Chain length = 2 × NL + 1/2 × T1 + 1/2 × T2 + (Pu + Pl - 20)
                </div>
                <div className="mt-3 text-sm text-white/80 space-y-1">
                  <p><strong>Chain length</strong> = Chain length in links</p>
                  <p><strong>NL</strong> = Number of chain links needed to measure chainstay = C (mm) / 12.7, rounded up to nearest even integer</p>
                  <p><strong>T1</strong> = Teeth on largest chainring</p>
                  <p><strong>T2</strong> = Teeth on largest cassette cog</p>
                  <p><strong>Pu</strong> = Teeth on upper pulley (guide/jockey wheel)</p>
                  <p><strong>Pl</strong> = Teeth on lower pulley (tension pulley)</p>
                  <p><strong>C</strong> = Chainstay length (mm)</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">How It Works</h3>
                <div className="space-y-3 text-white/80 text-sm">
                  <div className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <p><strong>2 × NL:</strong> Accounts for the chain running along both the top and bottom of the chainstay, where NL is the number of chain links needed to span the chainstay</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <p><strong>1/2 × T1 + 1/2 × T2:</strong> Adds half the teeth count of the largest chainring and largest cassette cog to account for chain wrap around these components</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <p><strong>(Pu + Pl - 20):</strong> Adjusts for the derailleur pulleys, subtracting 20 as a standard correction factor for typical pulley configurations</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <p><strong>Chain pitch:</strong> Each chain link is 12.7mm (0.5 inches), so NL = C (mm) / 12.7, rounded up to the nearest even integer</p>
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
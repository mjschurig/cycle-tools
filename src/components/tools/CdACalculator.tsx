import React, { useState, useMemo } from 'react'
import Warning from '../Warning'

interface CdAResult {
  value: number
  method: string
  description: string
  formula: string
}

// Reference values and constants
const REFERENCE_HEIGHT = 178 // cm
const REFERENCE_WEIGHT = 75 // kg
const REFERENCE_BMI = 23

// CdA reference values for different bike types (midpoint of ranges)
const CDA_REFERENCE = {
  'triathlon': 0.215,     // 0.20-0.23
  'road-aero': 0.245,     // 0.23-0.26
  'road-drops': 0.295,    // 0.28-0.31
  'endurance': 0.35       // 0.32-0.38
}

// Bike type offsets relative to road drops position
const BIKE_OFFSETS = {
  'triathlon': -0.065,    // -0.05 to -0.08, using -0.065
  'road-aero': -0.04,     // -0.03 to -0.05, using -0.04
  'road-drops': 0,        // baseline
  'endurance': 0.03       // +0.02 to +0.04, using +0.03
}

const bikeTypes = [
  { id: 'triathlon', name: 'Triathlon bike, full aero tuck', range: '0.20 – 0.23' },
  { id: 'road-aero', name: 'Road race bike + clip-on aero bars', range: '0.23 – 0.26' },
  { id: 'road-drops', name: 'Road race bike, drops position', range: '0.28 – 0.31' },
  { id: 'endurance', name: 'Road endurance / winter bike, tops', range: '0.32 – 0.38' }
]

const methods = [
  { id: 'lookup', name: 'Reference Values' },
  { id: 'height', name: 'Height-Scaled Rule-of-Thumb' },
  { id: 'weight', name: 'Weight Adjustment' },
  { id: 'bmi', name: 'BMI Adjustment' },
  { id: 'combined', name: 'Combined Height + Weight/BMI' },
  { id: 'offset', name: 'Bike-Type Offset Method' }
]

const CdACalculator: React.FC = () => {
  const [height, setHeight] = useState<string>('')
  const [weight, setWeight] = useState<string>('')
  const [bikeType, setBikeType] = useState<string>('triathlon')
  const [method, setMethod] = useState<string>('combined')

  // Auto-calculate BMI
  const bmi = useMemo(() => {
    const h = parseFloat(height)
    const w = parseFloat(weight)
    if (h && w) {
      const heightM = h / 100
      return w / (heightM * heightM)
    }
    return null
  }, [height, weight])

  const cdaResult = useMemo((): CdAResult | null => {
    const h = parseFloat(height)
    const w = parseFloat(weight)
    
    if (!h || !w) return null

    let cda = 0
    let methodDescription = ''
    let formula = ''

    switch (method) {
      case 'lookup':
        cda = CDA_REFERENCE[bikeType as keyof typeof CDA_REFERENCE]
        methodDescription = 'Quick Look-Up Table: Uses reference CdA values for a 75kg, 178cm rider.'
        formula = `CdA = ${cda.toFixed(3)} m² (reference value)`
        break

      case 'height': {
        const heightFactor = Math.pow(h / REFERENCE_HEIGHT, 2)
        cda = CDA_REFERENCE[bikeType as keyof typeof CDA_REFERENCE] * heightFactor
        methodDescription = 'Height-Scaled Rule-of-Thumb: Adjusts reference CdA based on height squared scaling.'
        formula = `CdA = ${CDA_REFERENCE[bikeType as keyof typeof CDA_REFERENCE].toFixed(3)} × (${h}/${REFERENCE_HEIGHT})² = ${cda.toFixed(3)} m²`
        break
      }

      case 'weight': {
        const weightFactor = Math.pow(w / REFERENCE_WEIGHT, 0.3)
        cda = CDA_REFERENCE[bikeType as keyof typeof CDA_REFERENCE] * weightFactor
        methodDescription = 'Weight Adjustment: Adjusts reference CdA based on weight with 0.3 exponent.'
        formula = `CdA = ${CDA_REFERENCE[bikeType as keyof typeof CDA_REFERENCE].toFixed(3)} × (${w}/${REFERENCE_WEIGHT})^0.3 = ${cda.toFixed(3)} m²`
        break
      }

      case 'bmi': {
        if (!bmi) return null
        const bmiFactor = Math.pow(bmi / REFERENCE_BMI, 0.3)
        cda = CDA_REFERENCE[bikeType as keyof typeof CDA_REFERENCE] * bmiFactor
        methodDescription = 'BMI Adjustment: Adjusts reference CdA based on BMI with 0.3 exponent.'
        formula = `CdA = ${CDA_REFERENCE[bikeType as keyof typeof CDA_REFERENCE].toFixed(3)} × (${bmi.toFixed(1)}/${REFERENCE_BMI})^0.3 = ${cda.toFixed(3)} m²`
        break
      }

      case 'combined': {
        const heightFactorComb = Math.pow(h / REFERENCE_HEIGHT, 2)
        const weightFactorComb = Math.pow(w / REFERENCE_WEIGHT, 0.3)
        cda = CDA_REFERENCE[bikeType as keyof typeof CDA_REFERENCE] * heightFactorComb * weightFactorComb
        methodDescription = 'Combined Height + Weight: Applies both height squared and weight 0.3 scaling factors.'
        formula = `CdA = ${CDA_REFERENCE[bikeType as keyof typeof CDA_REFERENCE].toFixed(3)} × (${h}/${REFERENCE_HEIGHT})² × (${w}/${REFERENCE_WEIGHT})^0.3 = ${cda.toFixed(3)} m²`
        break
      }

      case 'offset': {
        // Start with road drops baseline and apply offset
        const baselineCdA = CDA_REFERENCE['road-drops']
        const heightFactorOffset = Math.pow(h / REFERENCE_HEIGHT, 2)
        const weightFactorOffset = Math.pow(w / REFERENCE_WEIGHT, 0.3)
        const adjustedBaseline = baselineCdA * heightFactorOffset * weightFactorOffset
        cda = adjustedBaseline + BIKE_OFFSETS[bikeType as keyof typeof BIKE_OFFSETS]
        methodDescription = 'Bike-Type Offset Method: Starts with road drops baseline, adjusts for rider dimensions, then applies bike-specific offset.'
        formula = `CdA = (${baselineCdA.toFixed(3)} × height_factor × weight_factor) + ${BIKE_OFFSETS[bikeType as keyof typeof BIKE_OFFSETS].toFixed(3)} = ${cda.toFixed(3)} m²`
        break
      }
    }

    return {
      value: cda,
      method: methods.find(m => m.id === method)?.name || method,
      description: methodDescription,
      formula
    }
  }, [height, weight, bikeType, method, bmi])

  const getPerformanceCategory = (cda: number): { category: string; color: string; description: string } => {
    if (cda <= 0.20) return { category: 'Elite Pro', color: 'text-green-400', description: 'World-class aerodynamics' }
    if (cda <= 0.25) return { category: 'Competitive', color: 'text-blue-400', description: 'Strong aerodynamic position' }
    if (cda <= 0.30) return { category: 'Recreational', color: 'text-yellow-400', description: 'Good aerodynamic efficiency' }
    if (cda <= 0.35) return { category: 'Comfort', color: 'text-orange-400', description: 'Moderate aerodynamics' }
    return { category: 'Upright', color: 'text-red-400', description: 'Comfort-focused position' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            CdA Drag Coefficient Estimator
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Calculate aerodynamic drag area for cyclists based on body dimensions and bike setup
          </p>
                  {/* Important Notice */}
      
        <Warning message="Not verified formulas, still in development." />
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Rider Information */}
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-6">Rider Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g., 178"
                    min="140"
                    max="220"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g., 75"
                    min="40"
                    max="150"
                    step="0.1"
                  />
                </div>

                {bmi && (
                  <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                    <div className="text-sm text-white/70">BMI (calculated)</div>
                    <div className="text-lg font-semibold text-white">{bmi.toFixed(1)}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Bike Configuration */}
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-6">Bike Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Bike Type & Position
                  </label>
                  <select
                    value={bikeType}
                    onChange={(e) => setBikeType(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {bikeTypes.map((type) => (
                      <option key={type.id} value={type.id} className="bg-gray-800 text-white">
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-white/60 mt-1">
                    Reference range: {bikeTypes.find(t => t.id === bikeType)?.range} m²
                  </p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Calculation Method
                  </label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {methods.map((m) => (
                      <option key={m.id} value={m.id} className="bg-gray-800 text-white">
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Result */}
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-8 border border-white/20">
              {cdaResult ? (
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-400 mb-4">
                    {cdaResult.value.toFixed(3)}
                  </div>
                  <div className="text-2xl text-white/90 mb-2">m² CdA</div>
                  
                  {(() => {
                    const category = getPerformanceCategory(cdaResult.value)
                    return (
                      <div className="mb-6">
                        <div className={`text-xl font-semibold ${category.color} mb-1`}>
                          {category.category}
                        </div>
                        <div className="text-white/70">
                          {category.description}
                        </div>
                      </div>
                    )
                  })()}

                  <div className="bg-white/10 rounded-lg p-4 text-left">
                    <h3 className="text-lg font-semibold text-white mb-2">Method Used</h3>
                    <p className="text-white/80 mb-3">{cdaResult.description}</p>
                    <div className="bg-black/20 rounded p-3 font-mono text-sm text-blue-300">
                      {cdaResult.formula}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🚴‍♂️</div>
                  <div className="text-xl text-white/70 mb-2">
                    Enter rider information
                  </div>
                  <div className="text-white/60">
                    Fill in your height and weight to calculate CdA
                  </div>
                </div>
              )}
            </div>

            {/* Reference Table */}
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-6">Reference Values</h2>
              <div className="text-sm text-white/70 mb-4">
                Typical CdA ranges for 70-75kg rider (Reference: 178cm, 75kg, BMI 23)
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 text-white font-medium">Position / Bike Type</th>
                      <th className="text-right py-3 text-white font-medium">Typical CdA (m²)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bikeTypes.map((type) => (
                      <tr 
                        key={type.id}
                        className={`border-b border-white/10 ${type.id === bikeType ? 'bg-blue-600/20' : ''}`}
                      >
                        <td className="py-3 text-white/90">{type.name}</td>
                        <td className="py-3 text-right text-white/90">{type.range}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>


      </div>
    </div>
  )
}

export default CdACalculator
/**
 * Chain Length Calculation Utilities
 * 
 * This module provides functions to calculate bicycle chain length
 * based on drivetrain specifications.
 */

export interface ChainLengthInputs {
  chainstayLength: number // in inches
  largestChainring: number // number of teeth
  largestCassette: number // number of teeth
  upperPulleyTeeth: number // number of teeth on upper derailleur pulley
  lowerPulleyTeeth: number // number of teeth on lower derailleur pulley
}

export interface ChainLengthResult {
  chainLengthInches: number
  chainLengthMm: number
  numberOfLinks: number
  formula: string
  breakdown: {
    chainstayComponent: number
    drivetrainComponent: number
    slackComponent: number
  }
}

/**
 * Calculate chain length using the standard bicycle chain length formula
 * 
 * Formula: L = 2C + (F + R + Pu + Pl)/4 + 1
 * Where:
 * - L = Chain length (inches)
 * - C = Chainstay length (inches)
 * - F = Teeth on largest chainring
 * - R = Teeth on largest cassette cog
 * - Pu = Teeth on upper derailleur pulley
 * - Pl = Teeth on lower derailleur pulley
 * 
 * @param inputs - Chain length calculation inputs
 * @returns Chain length calculation results
 */
export function calculateChainLength(inputs: ChainLengthInputs): ChainLengthResult {
  const { chainstayLength, largestChainring, largestCassette, upperPulleyTeeth, lowerPulleyTeeth } = inputs

  // Validate inputs
  if (chainstayLength <= 0 || largestChainring <= 0 || largestCassette <= 0 || upperPulleyTeeth <= 0 || lowerPulleyTeeth <= 0) {
    throw new Error('All input values must be positive numbers')
  }

  if (chainstayLength > 30) {
    throw new Error('Chainstay length seems too large (>30 inches). Please check your measurement.')
  }

  if (largestChainring > 60 || largestCassette > 60) {
    throw new Error('Chainring or cassette teeth count seems too large (>60). Please verify your input.')
  }

  if (upperPulleyTeeth > 20 || lowerPulleyTeeth > 20) {
    throw new Error('Pulley teeth count seems too large (>20). Please verify your input.')
  }

  // Calculate components
  const chainstayComponent = 2 * chainstayLength
  const drivetrainComponent = (largestChainring + largestCassette + upperPulleyTeeth + lowerPulleyTeeth) / 4
  const slackComponent = 1

  // Total chain length
  const chainLengthInches = chainstayComponent + drivetrainComponent + slackComponent

  // Convert to mm
  const chainLengthMm = chainLengthInches * 25.4

  // Calculate number of links (each link is 0.5 inches)
  const numberOfLinks = Math.ceil(chainLengthInches / 0.5)

  // Generate formula string
  const formula = `L = 2(${chainstayLength}) + (${largestChainring} + ${largestCassette} + ${upperPulleyTeeth} + ${lowerPulleyTeeth})/4 + 1 = ${chainLengthInches.toFixed(2)} inches`

  return {
    chainLengthInches,
    chainLengthMm,
    numberOfLinks,
    formula,
    breakdown: {
      chainstayComponent,
      drivetrainComponent,
      slackComponent
    }
  }
}

/**
 * Convert chain length from millimeters to inches
 */
export function mmToInches(mm: number): number {
  return mm / 25.4
}

/**
 * Convert chain length from inches to millimeters
 */
export function inchesToMm(inches: number): number {
  return inches * 25.4
}

/**
 * Round chain length to nearest half-link
 */
export function roundToHalfLink(chainLengthInches: number): number {
  return Math.round(chainLengthInches * 2) / 2
}

/**
 * Get recommended chain length with safety margin
 */
export function getRecommendedChainLength(inputs: ChainLengthInputs, safetyLinks: number = 2): ChainLengthResult {
  const baseResult = calculateChainLength(inputs)
  
  // Add safety links
  const safetyInches = safetyLinks * 0.5
  const recommendedLengthInches = baseResult.chainLengthInches + safetyInches
  
  return {
    ...baseResult,
    chainLengthInches: recommendedLengthInches,
    chainLengthMm: recommendedLengthInches * 25.4,
    numberOfLinks: baseResult.numberOfLinks + safetyLinks,
    formula: `${baseResult.formula} + ${safetyLinks} safety links = ${recommendedLengthInches.toFixed(2)} inches`
  }
}
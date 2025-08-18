/**
 * Chain Length Calculator Tests
 * 
 * Comprehensive test suite to verify the accuracy of chain length calculations
 * based on known test cases and edge conditions.
 */

import {
  calculateChainLength,
  mmToInches,
  inchesToMm,
  roundToHalfLink,
  getRecommendedChainLength,
  ChainLengthInputs
} from '../chainLength'

describe('Chain Length Calculator', () => {
  describe('calculateChainLength', () => {
    test('should calculate chain length correctly for standard road bike setup', () => {
      const inputs: ChainLengthInputs = {
        chainstayLength: 16.0,
        largestChainring: 50,
        largestCassette: 28,
        pulleyTeeth: 11
      }

      const result = calculateChainLength(inputs)

      // Expected: L = 2(16) + (50 + 28 + 2(11))/4 + 1 = 32 + 25 + 1 = 58
      expect(result.chainLengthInches).toBeCloseTo(58.0, 2)
      expect(result.numberOfLinks).toBe(116) // 58 / 0.5 = 116
      expect(result.chainLengthMm).toBeCloseTo(1473.2, 1)
    })

    test('should calculate chain length correctly for mountain bike setup', () => {
      const inputs: ChainLengthInputs = {
        chainstayLength: 17.5,
        largestChainring: 42,
        largestCassette: 36,
        pulleyTeeth: 12
      }

      const result = calculateChainLength(inputs)

      // Expected: L = 2(17.5) + (42 + 36 + 2(12))/4 + 1 = 35 + 25.5 + 1 = 61.5
      expect(result.chainLengthInches).toBeCloseTo(61.5, 2)
      expect(result.numberOfLinks).toBe(123) // ceil(61.5 / 0.5) = 123
    })

    test('should calculate chain length correctly for gravel bike setup', () => {
      const inputs: ChainLengthInputs = {
        chainstayLength: 16.8,
        largestChainring: 46,
        largestCassette: 40,
        pulleyTeeth: 11
      }

      const result = calculateChainLength(inputs)

      // Expected: L = 2(16.8) + (46 + 40 + 2(11))/4 + 1 = 33.6 + 27 + 1 = 61.6
      expect(result.chainLengthInches).toBeCloseTo(61.6, 2)
      expect(result.numberOfLinks).toBe(124) // ceil(61.6 / 0.5) = 124
    })

    test('should handle small chainring and cassette setup', () => {
      const inputs: ChainLengthInputs = {
        chainstayLength: 15.0,
        largestChainring: 34,
        largestCassette: 25,
        pulleyTeeth: 11
      }

      const result = calculateChainLength(inputs)

      // Expected: L = 2(15) + (34 + 25 + 2(11))/4 + 1 = 30 + 20.25 + 1 = 51.25
      expect(result.chainLengthInches).toBeCloseTo(51.25, 2)
      expect(result.numberOfLinks).toBe(103) // ceil(51.25 / 0.5) = 103
    })

    test('should handle large chainring and cassette setup', () => {
      const inputs: ChainLengthInputs = {
        chainstayLength: 18.0,
        largestChainring: 53,
        largestCassette: 32,
        pulleyTeeth: 11
      }

      const result = calculateChainLength(inputs)

      // Expected: L = 2(18) + (53 + 32 + 2(11))/4 + 1 = 36 + 26.75 + 1 = 63.75
      expect(result.chainLengthInches).toBeCloseTo(63.75, 2)
      expect(result.numberOfLinks).toBe(128) // ceil(63.75 / 0.5) = 128
    })

    test('should provide correct breakdown components', () => {
      const inputs: ChainLengthInputs = {
        chainstayLength: 16.0,
        largestChainring: 50,
        largestCassette: 28,
        pulleyTeeth: 11
      }

      const result = calculateChainLength(inputs)

      expect(result.breakdown.chainstayComponent).toBe(32.0) // 2 * 16
      expect(result.breakdown.drivetrainComponent).toBe(25.0) // (50 + 28 + 22) / 4
      expect(result.breakdown.slackComponent).toBe(1.0)
    })

    test('should generate correct formula string', () => {
      const inputs: ChainLengthInputs = {
        chainstayLength: 16.0,
        largestChainring: 50,
        largestCassette: 28,
        pulleyTeeth: 11
      }

      const result = calculateChainLength(inputs)

      expect(result.formula).toContain('L = 2(16)')
      expect(result.formula).toContain('(50 + 28 + 2(11))/4')
      expect(result.formula).toContain('58.00 inches')
    })
  })

  describe('Input validation', () => {
    test('should throw error for negative chainstay length', () => {
      const inputs: ChainLengthInputs = {
        chainstayLength: -1,
        largestChainring: 50,
        largestCassette: 28,
        pulleyTeeth: 11
      }

      expect(() => calculateChainLength(inputs)).toThrow('All input values must be positive numbers')
    })

    test('should throw error for zero chainring teeth', () => {
      const inputs: ChainLengthInputs = {
        chainstayLength: 16,
        largestChainring: 0,
        largestCassette: 28,
        pulleyTeeth: 11
      }

      expect(() => calculateChainLength(inputs)).toThrow('All input values must be positive numbers')
    })

    test('should throw error for excessive chainstay length', () => {
      const inputs: ChainLengthInputs = {
        chainstayLength: 35,
        largestChainring: 50,
        largestCassette: 28,
        pulleyTeeth: 11
      }

      expect(() => calculateChainLength(inputs)).toThrow('Chainstay length seems too large')
    })

    test('should throw error for excessive chainring teeth', () => {
      const inputs: ChainLengthInputs = {
        chainstayLength: 16,
        largestChainring: 70,
        largestCassette: 28,
        pulleyTeeth: 11
      }

      expect(() => calculateChainLength(inputs)).toThrow('Chainring or cassette teeth count seems too large')
    })
  })

  describe('Unit conversion functions', () => {
    test('should convert mm to inches correctly', () => {
      expect(mmToInches(25.4)).toBeCloseTo(1.0, 3)
      expect(mmToInches(406.4)).toBeCloseTo(16.0, 3)
      expect(mmToInches(508.0)).toBeCloseTo(20.0, 3)
    })

    test('should convert inches to mm correctly', () => {
      expect(inchesToMm(1.0)).toBeCloseTo(25.4, 1)
      expect(inchesToMm(16.0)).toBeCloseTo(406.4, 1)
      expect(inchesToMm(20.0)).toBeCloseTo(508.0, 1)
    })

    test('should round to half-link correctly', () => {
      expect(roundToHalfLink(50.1)).toBe(50.0)
      expect(roundToHalfLink(50.3)).toBe(50.5)
      expect(roundToHalfLink(50.6)).toBe(50.5)
      expect(roundToHalfLink(50.8)).toBe(51.0)
    })
  })

  describe('Recommended chain length with safety margin', () => {
    test('should add default 2 safety links', () => {
      const inputs: ChainLengthInputs = {
        chainstayLength: 16.0,
        largestChainring: 50,
        largestCassette: 28,
        pulleyTeeth: 11
      }

      const baseResult = calculateChainLength(inputs)
      const recommendedResult = getRecommendedChainLength(inputs)

      expect(recommendedResult.chainLengthInches).toBeCloseTo(baseResult.chainLengthInches + 1.0, 2)
      expect(recommendedResult.numberOfLinks).toBe(baseResult.numberOfLinks + 2)
    })

    test('should add custom safety links', () => {
      const inputs: ChainLengthInputs = {
        chainstayLength: 16.0,
        largestChainring: 50,
        largestCassette: 28,
        pulleyTeeth: 11
      }

      const baseResult = calculateChainLength(inputs)
      const recommendedResult = getRecommendedChainLength(inputs, 4)

      expect(recommendedResult.chainLengthInches).toBeCloseTo(baseResult.chainLengthInches + 2.0, 2)
      expect(recommendedResult.numberOfLinks).toBe(baseResult.numberOfLinks + 4)
    })
  })

  describe('Real-world test cases', () => {
    test('Test Case 1: Standard road bike (from research)', () => {
      // Chainstay: 16", Chainring: 50T, Cassette: 28T, Pulleys: 11T each
      const inputs: ChainLengthInputs = {
        chainstayLength: 16.0,
        largestChainring: 50,
        largestCassette: 28,
        pulleyTeeth: 11
      }

      const result = calculateChainLength(inputs)
      
      // Expected from formula: 2*16 + (50+28+22)/4 + 1 = 32 + 25 + 1 = 58
      expect(result.chainLengthInches).toBeCloseTo(58.0, 1)
    })

    test('Test Case 2: Endurance road bike (from research)', () => {
      // Chainstay: 17.5", Chainring: 53T, Cassette: 30T, Pulleys: 11T each
      const inputs: ChainLengthInputs = {
        chainstayLength: 17.5,
        largestChainring: 53,
        largestCassette: 30,
        pulleyTeeth: 11
      }

      const result = calculateChainLength(inputs)
      
      // Expected from formula: 2*17.5 + (53+30+22)/4 + 1 = 35 + 26.25 + 1 = 62.25
      expect(result.chainLengthInches).toBeCloseTo(62.25, 1)
    })

    test('Test Case 3: Compact road bike (from research)', () => {
      // Chainstay: 15", Chainring: 48T, Cassette: 25T, Pulleys: 11T each
      const inputs: ChainLengthInputs = {
        chainstayLength: 15.0,
        largestChainring: 48,
        largestCassette: 25,
        pulleyTeeth: 11
      }

      const result = calculateChainLength(inputs)
      
      // Expected from formula: 2*15 + (48+25+22)/4 + 1 = 30 + 23.75 + 1 = 54.75
      expect(result.chainLengthInches).toBeCloseTo(54.75, 1)
    })

    test('Test Case 4: Mountain bike with large cassette', () => {
      // Chainstay: 17", Chainring: 32T, Cassette: 50T, Pulleys: 12T each
      const inputs: ChainLengthInputs = {
        chainstayLength: 17.0,
        largestChainring: 32,
        largestCassette: 50,
        pulleyTeeth: 12
      }

      const result = calculateChainLength(inputs)
      
      // Expected from formula: 2*17 + (32+50+24)/4 + 1 = 34 + 26.5 + 1 = 61.5
      expect(result.chainLengthInches).toBeCloseTo(61.5, 1)
    })

    test('Test Case 5: Single speed conversion', () => {
      // Chainstay: 16.5", Chainring: 42T, Cassette: 16T, No pulleys (0T)
      const inputs: ChainLengthInputs = {
        chainstayLength: 16.5,
        largestChainring: 42,
        largestCassette: 16,
        pulleyTeeth: 0 // Single speed has no derailleur pulleys
      }

      // This should throw an error due to 0 pulley teeth
      expect(() => calculateChainLength(inputs)).toThrow('All input values must be positive numbers')
    })
  })

  describe('Edge cases and boundary conditions', () => {
    test('should handle very small bike setup', () => {
      const inputs: ChainLengthInputs = {
        chainstayLength: 12.0, // Very short chainstay
        largestChainring: 28,  // Small chainring
        largestCassette: 16,   // Small cassette
        pulleyTeeth: 9         // Small pulleys
      }

      const result = calculateChainLength(inputs)
      
      // Should still calculate without error
      expect(result.chainLengthInches).toBeGreaterThan(0)
      expect(result.numberOfLinks).toBeGreaterThan(0)
    })

    test('should handle large bike setup within limits', () => {
      const inputs: ChainLengthInputs = {
        chainstayLength: 20.0, // Long chainstay
        largestChainring: 56,  // Large chainring
        largestCassette: 42,   // Large cassette
        pulleyTeeth: 14        // Large pulleys
      }

      const result = calculateChainLength(inputs)
      
      // Should calculate correctly
      expect(result.chainLengthInches).toBeGreaterThan(60)
      expect(result.numberOfLinks).toBeGreaterThan(120)
    })

    test('should handle decimal inputs correctly', () => {
      const inputs: ChainLengthInputs = {
        chainstayLength: 16.25,
        largestChainring: 50,
        largestCassette: 28,
        pulleyTeeth: 11
      }

      const result = calculateChainLength(inputs)
      
      // Should handle decimals without error
      expect(result.chainLengthInches).toBeCloseTo(58.5, 1)
    })
  })
})
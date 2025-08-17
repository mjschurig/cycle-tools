import * as odex from 'odex';

// Physical constants
const g = 9.81; // gravity (m/s²)
const rho = 1.2041; // air density (kg/m³)

export interface BikeConfig {
  // Bike parameters
  I: number;      // Moment of inertia (kg⋅m²)
  r: number;      // Wheel radius (m)
  mb: number;     // Bike mass (kg)
  cr: number;     // Rolling resistance coefficient
  cwA: number;    // Drag coefficient × frontal area (m²)
}

export interface RiderConfig {
  P: number;      // Power (W)
  mf: number;     // Rider mass (kg)
}

export interface TerrainConfig {
  hm: number;     // Total elevation climbed (m)
  L: number;      // Total distance (km)
  ha: number;     // Fraction of distance ascending (0-1)
  hd: number;     // Fraction of distance descending (0-1)
  dx: number;     // Distance between stops (m)
}

export interface SimulationResult {
  time: number;
  velocity: number; // m/s
  distance: number; // m
}

export interface ComparisonResult {
  config1: {
    name: string;
    finalVelocity: number; // km/h
    totalTime: number; // seconds
  };
  config2: {
    name: string;
    finalVelocity: number; // km/h
    totalTime: number; // seconds
  };
  timeDifference: number; // minutes
}

/**
 * Calculate bicycle acceleration based on power, resistance forces, and terrain
 * Ported from MATLAB acceleration.m
 */
export function calculateAcceleration(
  P: number,    // Power (W)
  v: number,    // Velocity (m/s)
  m: number,    // Total mass (kg)
  I: number,    // Moment of inertia (kg⋅m²)
  r: number,    // Wheel radius (m)
  cr: number,   // Rolling resistance coefficient
  cwA: number,  // Drag coefficient × frontal area (m²)
  alpha: number // Road gradient angle (rad)
): number {
  const ma = m + I / r; // Effective mass including rotational inertia
  const Fg = m * g;
  const Fn = Fg * Math.cos(alpha); // Normal force
  const Fh = Fg * Math.sin(alpha); // Gravitational component along road
  
  // Power force - rolling resistance - aerodynamic drag - gravitational component
  const acceleration = P / v / ma - cr * Fn / ma - cwA * rho * v * v / ma / 2 - Fh / ma;
  
  return acceleration;
}

/**
 * Solve the differential equation for bicycle motion
 * Returns solution data points for the specified time range
 */
export function solveBikeMotion(
  riderConfig: RiderConfig,
  bikeConfig: BikeConfig,
  alpha: number = 0, // Road gradient angle (rad)
  maxTime: number = 600, // Maximum simulation time (s)
  timeStep: number = 0.1 // Time step for data points (s)
): SimulationResult[] {
  const { P, mf } = riderConfig;
  const { I, r, mb, cr, cwA } = bikeConfig;
  const m = mb + mf; // Total mass
  
  // Create the differential equation function
  // y[0] = velocity (m/s), y[1] = distance (m)
  // dy[0]/dt = acceleration, dy[1]/dt = velocity
  const dydt = (_t: number, y: number[]): number[] => {
    const v = Math.max(y[0], 0.001); // Prevent division by zero
    const acceleration = calculateAcceleration(P, v, m, I, r, cr, cwA, alpha);
    return [acceleration, y[0]];
  };
  
  // Set up the ODE solver
  const solver = new odex.Solver(dydt, 2, { 
    absoluteTolerance: 1e-8,
    relativeTolerance: 1e-6
  });
  
  // Initial conditions: very small initial velocity, zero distance
  const solution = solver.integrate(0, [0.001, 0]);
  
  // Generate solution points
  const results: SimulationResult[] = [];
  for (let t = 0; t <= maxTime; t += timeStep) {
    const result = solution(t);
    results.push({
      time: t,
      velocity: result[0],
      distance: result[1]
    });
  }
  
  return results;
}

/**
 * Find the time when the bike travels a specific distance
 */
export function findTimeAtDistance(
  solutionData: SimulationResult[],
  targetDistance: number
): number {
  // Find the first point where distance exceeds target
  for (let i = 0; i < solutionData.length - 1; i++) {
    const current = solutionData[i];
    const next = solutionData[i + 1];
    
    if (current.distance <= targetDistance && next.distance >= targetDistance) {
      // Linear interpolation between the two points
      const ratio = (targetDistance - current.distance) / (next.distance - current.distance);
      return current.time + ratio * (next.time - current.time);
    }
  }
  
  // If target distance is not reached, return the last time point
  return solutionData[solutionData.length - 1].time;
}

/**
 * Simulate bicycle performance over a complex terrain profile
 * Ported from MATLAB bike_acceleration.m
 */
export function simulateTerrainPerformance(
  riderConfig: RiderConfig,
  bikeConfig: BikeConfig,
  terrainConfig: TerrainConfig
): number {
  const { hm, L, ha, hd, dx } = terrainConfig;
  
  // Calculate terrain segments (convert km to m)
  const La = L * ha * 1000; // Ascending distance (m)
  const Ld = L * hd * 1000; // Descending distance (m)
  const L0 = (L - L * ha - L * hd) * 1000; // Flat distance (m)
  
  // Number of dx segments in each terrain type
  const Na = La / dx; // Number of ascending segments
  const Nd = Ld / dx; // Number of descending segments
  const N0 = L0 / dx; // Number of flat segments
  
  // Calculate gradient angles
  const alphaa = Math.atan(hm / La); // Ascending angle
  const alphad = Math.atan(-hm / Ld); // Descending angle
  
  let totalTime = 0;
  
  // Flat section
  if (N0 > 0) {
    const flatSolution = solveBikeMotion(riderConfig, bikeConfig, 0, 600, 0.1);
    const flatTime = findTimeAtDistance(flatSolution, dx);
    totalTime += N0 * flatTime;
  }
  
  // Ascending section
  if (Na > 0) {
    const climbSolution = solveBikeMotion(riderConfig, bikeConfig, alphaa, 600, 0.1);
    const climbTime = findTimeAtDistance(climbSolution, dx);
    totalTime += Na * climbTime;
  }
  
  // Descending section
  if (Nd > 0) {
    const descentSolution = solveBikeMotion(riderConfig, bikeConfig, alphad, 600, 0.1);
    const descentTime = findTimeAtDistance(descentSolution, dx);
    totalTime += Nd * descentTime;
  }
  
  return totalTime;
}

/**
 * Compare two bike configurations over the same terrain
 */
export function compareBikeConfigurations(
  riderConfig: RiderConfig,
  config1: BikeConfig & { name: string },
  config2: BikeConfig & { name: string },
  terrainConfig: TerrainConfig
): ComparisonResult {
  // Simulate both configurations
  const time1 = simulateTerrainPerformance(riderConfig, config1, terrainConfig);
  const time2 = simulateTerrainPerformance(riderConfig, config2, terrainConfig);
  
  // Get final velocities on flat ground
  const solution1 = solveBikeMotion(riderConfig, config1, 0, 600, 1);
  const solution2 = solveBikeMotion(riderConfig, config2, 0, 600, 1);
  
  const finalResult1 = solution1[solution1.length - 1];
  const finalResult2 = solution2[solution2.length - 1];
  
  return {
    config1: {
      name: config1.name,
      finalVelocity: finalResult1.velocity * 3.6, // Convert to km/h
      totalTime: time1
    },
    config2: {
      name: config2.name,
      finalVelocity: finalResult2.velocity * 3.6, // Convert to km/h
      totalTime: time2
    },
    timeDifference: (time2 - time1) / 60 // Convert to minutes
  };
}

// Predefined bike configurations
export const BIKE_CONFIGS = {
  bike1: {
    name: 'Bike 1',
    I: 0.096,
    r: 0.29,
    mb: 11,
    cr: 0.0029,
    cwA: 0.31
  },
  bike2: {
    name: 'Bike 2',
    I: 0.096,
    r: 0.34,
    mb: 7.5,
    cr: 0.0029,
    cwA: 0.33
  }
} as const;

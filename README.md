# CdA Drag Coefficient Estimator

A comprehensive web-based tool for calculating the aerodynamic drag area (CdA) of cyclists based on rider dimensions and bike setup.

## Features

- **Multiple Calculation Methods**: Choose from 6 different estimation methods
- **Comprehensive Bike Types**: Support for triathlon, road race, endurance bikes
- **Real-time Calculations**: Instant BMI calculation and CdA estimation
- **Modern Interface**: Clean, responsive design with detailed results
- **Formula Verification**: All formulas verified against cycling aerodynamics research

## Calculation Methods

### 1. Quick Look-Up Table
Uses reference CdA values for a standard 75kg, 178cm rider across different bike types.

### 2. Height-Scaled Rule-of-Thumb
Adjusts CdA based on height using the formula:
```
CdA = CdA_ref × (height_you / height_ref)²
```

### 3. Weight Adjustment
Modifies CdA based on weight using:
```
CdA = CdA_table × (weight / 75kg)^0.3
```

### 4. BMI Adjustment
Similar to weight adjustment but using BMI:
```
CdA = CdA_table × (BMI / 23)^0.3
```

### 5. Combined Height + Weight/BMI
Applies both height and weight scaling factors:
```
CdA = CdA_ref × (H/H_ref)² × (W/W_ref)^0.3
```

### 6. Bike-Type Offset Method
Starts with road drops baseline and applies bike-specific offsets.

## Reference Values

| Position / Bike Type | Typical CdA (m²) |
|---------------------|------------------|
| Triathlon bike, full aero tuck | 0.20 – 0.23 |
| Road race bike + clip-on aero bars | 0.23 – 0.26 |
| Road race bike, drops | 0.28 – 0.31 |
| Road endurance / winter bike, tops | 0.32 – 0.38 |

## Usage

1. Open `cda-estimator.html` in any modern web browser
2. Enter your height and weight (BMI will be calculated automatically)
3. Select your bike type and riding position
4. Choose the calculation method you prefer
5. Click "Calculate CdA" to see your estimated drag coefficient

## Important Notes

- These formulas provide starting values only
- Real wind-tunnel or field testing will always provide more accurate results
- Values are valid for riders in race kit, helmet, and normal hydration setup
- Air density assumed to be ρ ≈ 1.2 kg·m⁻³ (sea level)

## Formula Verification

All formulas have been verified against cycling aerodynamics research and match the examples provided in professional cycling literature. The tool includes built-in validation using known test cases.

## Browser Compatibility

Works with all modern browsers including Chrome, Firefox, Safari, and Edge. No additional dependencies required.
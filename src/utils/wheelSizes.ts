export interface WheelSize {
  name: string;
  diameter: number; // in mm
  description: string;
}

// Common bicycle wheel sizes with their diameters in mm
export const COMMON_WHEEL_SIZES: WheelSize[] = [
  {
    name: '700C (Road)',
    diameter: 622,
    description: 'Standard road bike wheel (700x23c, 700x25c, etc.)'
  },
  {
    name: '650B (27.5")',
    diameter: 584,
    description: 'Mountain bike and gravel bike wheel'
  },
  {
    name: '26" MTB',
    diameter: 559,
    description: 'Traditional mountain bike wheel'
  },
  {
    name: '29" (29er)',
    diameter: 622,
    description: 'Large mountain bike wheel (same diameter as 700C)'
  },
  {
    name: '24" Kids',
    diameter: 507,
    description: 'Common children\'s bike wheel'
  },
  {
    name: '20" BMX/Folding',
    diameter: 406,
    description: 'BMX and folding bike wheel'
  },
  {
    name: '16" Kids',
    diameter: 349,
    description: 'Small children\'s bike wheel'
  },
  {
    name: '12" Kids',
    diameter: 203,
    description: 'Very small children\'s bike wheel'
  }
];
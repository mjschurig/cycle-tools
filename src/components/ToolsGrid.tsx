import React from 'react'

interface ToolsGridProps {
  setActiveSection: (section: string) => void
}

const ToolsGrid: React.FC<ToolsGridProps> = ({ setActiveSection }) => {
  const tools = [
    {
      id: 'bike-acceleration',
      title: 'Bike Performance Calculator',
      description: 'Advanced physics simulation comparing bike configurations over complex terrain using differential equations',
      icon: '🚴‍♂️',
      features: ['Differential Equations', 'Terrain Simulation', 'Bike Comparison'],
      featured: true,
    },
    {
      id: 'moment-of-inertia',
      title: 'Moment of Inertia Calculator',
      description: 'Calculate rotational inertia of bicycle wheels from rim, tire, and spoke specifications',
      icon: '⚙️',
      features: ['Wheel Components', 'Rotational Physics', 'Precise Calculations'],
      featured: true,
    },
    {
      id: 'gear-ratio',
      title: 'Gear Ratio Calculator',
      description: 'Calculate gear ratios, gear inches, and development for optimal performance',
      icon: '⚙️',
      features: ['Chainring & Cassette', 'Gear Inches', 'Development'],
    },
    {
      id: 'speed',
      title: 'Speed Calculator',
      description: 'Determine speed based on cadence, gear ratio, and wheel size',
      icon: '💨',
      features: ['Speed from Cadence', 'Time & Distance', 'Performance Metrics'],
    },
    {
      id: 'power',
      title: 'Power Calculator',
      description: 'Calculate power output, watts per kilogram, and training zones',
      icon: '⚡',
      features: ['Power Output', 'W/kg Ratio', 'Training Zones'],
    },
    {
      id: 'tire-pressure',
      title: 'Tire Pressure Calculator',
      description: 'Optimal tire pressure based on weight, tire size, and conditions',
      icon: '🛞',
      features: ['Weight-based PSI', 'Road & Off-road', 'Weather Conditions'],
    },
    {
      id: 'wheel-size',
      title: 'Wheel Size Calculator',
      description: 'Convert between different wheel size standards and measurements',
      icon: '🔄',
      features: ['Size Conversion', 'ISO Standards', 'Circumference'],
    },
    {
      id: 'cadence',
      title: 'Cadence Calculator',
      description: 'Optimize your pedaling cadence for efficiency and performance',
      icon: '🔄',
      features: ['RPM Optimization', 'Efficiency Zones', 'Training Guide'],
    },
    {
      id: 'spoke-length',
      title: 'Spoke Length Calculator',
      description: 'Calculate precise spoke lengths for bicycle wheel building',
      icon: '🛞',
      features: ['ERD & Hub Specs', 'Cross Patterns', 'Wheel Building'],
      featured: true,
    },
    {
      id: 'chain-length',
      title: 'Chain Length Calculator',
      description: 'Calculate optimal chain length for your drivetrain with different pulley sizes',
      icon: '🔗',
      features: ['Chainstay Length', 'Pulley Wheels', 'Drivetrain Specs'],
      featured: true,
    },
    {
      id: 'cda-calculator',
      title: 'CdA Drag Coefficient Estimator',
      description: 'Calculate aerodynamic drag area based on rider dimensions and bike setup',
      icon: '💨',
      features: ['Multiple Methods', 'Bike Type Analysis', 'Performance Categories'],
      featured: true,
    },
  ]

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 drop-shadow-lg">
          Available Tools
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className={`backdrop-blur-md rounded-xl p-6 border transition-all duration-300 cursor-pointer group ${
                tool.featured 
                  ? 'bg-blue-600/20 border-blue-400/40 hover:bg-blue-600/30' 
                  : 'bg-white/10 border-white/20 hover:bg-white/20'
              }`}
              onClick={() => setActiveSection(tool.id)}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {tool.icon}
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3">
                {tool.title}
              </h3>
              
              <p className="text-white/80 mb-4 text-sm leading-relaxed">
                {tool.description}
              </p>
              
              <div className="space-y-2">
                {tool.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-white/70 text-sm">
                    <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <span className="inline-flex items-center text-white/80 text-sm group-hover:text-white transition-colors">
                  Open Tool
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ToolsGrid

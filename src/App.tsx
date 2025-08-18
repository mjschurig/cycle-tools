import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import ToolsGrid from './components/ToolsGrid'
import Footer from './components/Footer'
import BikeAccelerationCalculator from './components/tools/BikeAccelerationCalculator'
import MomentOfInertiaCalculator from './components/tools/MomentOfInertiaCalculator'
import SpokeCalculator from './components/tools/SpokeCalculator'
import CdACalculator from './components/tools/CdACalculator'

function App() {
  const [activeSection, setActiveSection] = useState('home')

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 w-full">
        {activeSection === 'home' && (
          <>
            <Hero />
            <ToolsGrid setActiveSection={setActiveSection} />
          </>
        )}
        {activeSection === 'bike-acceleration' && (
          <BikeAccelerationCalculator 
            onNavigateToInertia={() => setActiveSection('moment-of-inertia')}
          />
        )}
        {activeSection === 'moment-of-inertia' && <MomentOfInertiaCalculator />}
        {activeSection === 'spoke-length' && <SpokeCalculator />}
        {activeSection === 'cda-calculator' && <CdACalculator />}
        {activeSection !== 'home' && activeSection !== 'bike-acceleration' && activeSection !== 'moment-of-inertia' && activeSection !== 'spoke-length' && activeSection !== 'cda-calculator' && (
          <div className="max-w-4xl mx-auto px-4 py-16 min-h-[60vh] flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
              {getSectionTitle(activeSection)}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl">
              Tool implementation coming soon...
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

function getSectionTitle(section: string): string {
  const titles: Record<string, string> = {
    'gear-ratio': 'Gear Ratio Calculator',
    'speed': 'Speed Calculator',
    'power': 'Power Calculator',
    'tire-pressure': 'Tire Pressure Calculator',
    'wheel-size': 'Wheel Size Calculator',
    'cadence': 'Cadence Calculator',
    'bike-acceleration': 'Bike Acceleration Calculator',
    'moment-of-inertia': 'Moment of Inertia Calculator',
    'spoke-length': 'Spoke Length Calculator',
    'cda-calculator': 'CdA Drag Coefficient Estimator'
  }
  return titles[section] || 'Cycle Tools'
}

export default App

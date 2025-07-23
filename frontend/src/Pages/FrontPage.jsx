import React from 'react'
import HeroSection from '../components/HeroSection'
import EnvironmentSection from '../components/EnvironmentSection'
import InsightGrid from '../components/InsightGrid'
import EducationalSection from '../components/EducationalSection'

const FrontPage = () => {
  return (
    <div>
      <HeroSection />
      <InsightGrid/>
      <EnvironmentSection/>
      <EducationalSection />
    </div>
  )
}

export default FrontPage

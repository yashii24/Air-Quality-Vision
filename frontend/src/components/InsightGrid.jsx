import React from 'react'
import MapSection from './MapSection'
import StationRanking from './StationRanking'

const InsightGrid = () => {
  return (
    <section className="p-8 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        <div className="mt-8 md:mt-0 ">
          <MapSection/>
        </div>
        
        <div className="mt-8 md:mt-0 ">
          <StationRanking/>
        </div>
        

      </div>
    </section>
  )
}

export default InsightGrid

import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-black text-white p-6 text-sm">
        <div className="flex flex-row items-center justify-between max-w-7xl mx-auto">
            <div>
              <p>
                Air Quality Vision
                <br />
                Your go-to source for air quality data!
              </p>
            </div>
            <div className="">
                <div className='pb-1 hover:underline'>Help</div>
                <div className='pb-1 hover:underline'>FAQ</div>
                <div className='pb-1 hover:underline'>Customer Support</div>
                <div className='pb-1 hover:underline'>Contact Us</div>
            </div>
        </div>
    </footer>
  )
}

export default Footer
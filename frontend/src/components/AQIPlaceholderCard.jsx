import React from 'react';

export default function AQIPlaceholderCard() {
  const funFacts = [
    "Delhi's air has more layers than an onion!",
    "Your breath deserves better data!",
    "Even plants are waiting for AQI info...",
    "This air is so clean, our sensors can't detect it! (Just kidding)",
    "Pro tip: Trees are nature's air purifiers 🌳",
    "Did you know? The Taj Mahal wears a mask sometimes"
  ];

  const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];

  return (
    <div className="h-full w-full rounded-xl border-4 border-dashed border-gray-200 shadow-sm p-6 bg-gray-50 text-center flex items-center justify-center">
      <div className="flex flex-col items-center justify-center h-full">
              <svg 
        className="w-24 h-24 text-blue-300 mb-4 animate-float" 
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M47.5 35.5c0-6.9-5.6-12.5-12.5-12.5-1.9 0-3.7.4-5.4 1.1-1-3.5-4.1-6.1-7.8-6.1-4.7 0-8.5 3.8-8.5 8.5 0 .9.1 1.7.3 2.5-3.2 1.2-5.5 4.2-5.5 7.7 0 4.7 3.8 8.5 8.5 8.5h25.5c5.2 0 9.5-4.3 9.5-9.5 0-5.2-4.3-9.5-9.5-9.5z" 
          fill="currentColor"
        />
        <path 
          d="M30 24c1.3 0 2.6.3 3.8.8.8-2.8 3.2-4.8 6.2-4.8 3.6 0 6.5 2.9 6.5 6.5 0 .6-.1 1.2-.2 1.8 2.4.9 4.1 3.1 4.1 5.7 0 3.4-2.8 6.2-6.2 6.2H14.5c-3.6 0-6.5-2.9-6.5-6.5 0-2.7 1.6-4.9 4-5.8-.1-.5-.2-1-.2-1.5 0-4.1 3.4-7.5 7.5-7.5 2.9 0 5.5 1.7 6.7 4.2.8-.3 1.6-.4 2.5-.4z" 
          fill="white" 
          opacity="0.7"
        />
      </svg>
        
        <h3 className="text-xl font-medium text-gray-600 mb-2">
          Air Quality Data Loading...
        </h3>
        
        <p className="text-gray-500 mb-4">
          {randomFact}
        </p>
        
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
        
        <p className="text-xs text-gray-400 mt-6">
          Try selecting a station or check back later
        </p>
      </div>
    </div>
  );
}
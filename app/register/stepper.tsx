import React from 'react';

export default function Stepper({ steps, currentStep } : { steps: string[], currentStep: number }) {
  const totalSteps = steps.length;
  // Obliczanie procentu postępu: (aktualny krok / liczba kroków) * 100
  // Używamy Math.max(0, ...) na wypadek gdyby currentStep był mniejszy niż 1
  const progress = Math.max(0, (currentStep / totalSteps) * 100);

  return (
    <div className="w-full">
      {/* 1. Wskaźniki Kroków */}
      <div className="flex justify-between items-center mb-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <React.Fragment key={stepNumber}>
              {/* Ikona/Kółko Kroku */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300
                    ${isCompleted ? 'bg-indigo-600 text-white' : isActive ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-500'}
                    ${!isActive && !isCompleted ? 'hover:bg-gray-300 cursor-pointer' : ''}
                  `}
                >
                  {isCompleted ? (
                    // Ikona 'Zakończono' (Checkmark)
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    // Numer Kroku
                    <span className="font-semibold">{stepNumber}</span>
                  )}
                </div>
                {/* Tytuł Kroku */}
                <span className={`text-sm mt-2 transition-colors duration-300 ${isActive ? 'text-indigo-600 font-medium' : 'text-gray-600'}`}>
                  {step}
                </span>
              </div>

              {/* Linia łącząca (tylko dla kroków 1 do n-1) */}
              {index < totalSteps - 1 && (
                <div className="flex-1 h-1 bg-gray-200 mx-1 relative">
                  <div
                    className={`absolute top-0 left-0 h-full transition-all duration-300 
                      ${isCompleted ? 'bg-indigo-600' : 'bg-transparent'}
                    `}
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  ></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* 2. Pasek Postępu (Progress Bar) */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="mt-2 text-right text-sm text-gray-600">
        Krok {currentStep} z {totalSteps}
      </div>
    </div>
  );
};
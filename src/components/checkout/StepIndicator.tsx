const steps = [
  { number: 1, label: 'Contact' },
  { number: 2, label: 'Shipping' },
  { number: 3, label: 'Review' },
]

interface StepIndicatorProps {
  currentStep: number
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Checkout progress" className="mb-8">
      <ol className="flex items-center gap-2">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep
          const isCompleted = step.number < currentStep

          return (
            <li key={step.number} className="flex items-center gap-2 flex-1">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? '✓' : step.number}
              </div>
              <span
                className={`text-sm hidden sm:inline ${
                  isActive
                    ? 'font-semibold text-gray-900'
                    : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './api/queryClient'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <h1 className="text-3xl font-bold text-center py-8">
          Checkout — Coming soon
        </h1>
      </div>
    </QueryClientProvider>
  )
}

export default App

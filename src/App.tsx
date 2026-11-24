import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './api/queryClient'
import { CatalogPage } from './pages/CatalogPage'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <CatalogPage />
      </div>
    </QueryClientProvider>
  )
}

export default App

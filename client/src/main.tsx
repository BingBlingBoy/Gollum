import React from 'react'
import ReactDOM from 'react-dom/client'
import Index from './pages/home/Index.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  }
])

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />  
    </QueryClientProvider>
  </React.StrictMode>,
)

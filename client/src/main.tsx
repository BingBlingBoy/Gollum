import React from 'react'
import ReactDOM from 'react-dom/client'
import Index from './pages/home/Index.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import Search from './pages/search/Search.tsx'
import { Auth0Provider } from '@auth0/auth0-react'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/search",
    element: <Search />
  },
])

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-ftsp6tecm57igbfm.us.auth0.com"
      clientId="NBgD3yK4jQJoLzPd5hjZyWOLJJMMnBKi"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />  
      </QueryClientProvider>
    </Auth0Provider>
  </React.StrictMode>,
)

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
import Profile from './pages/profile/Profile.tsx'
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
  {
    path: "/profile",
    element: <Profile />
  }
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
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />  
      </QueryClientProvider>
    </Auth0Provider>
  </React.StrictMode>,
)

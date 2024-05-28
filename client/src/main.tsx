import React from 'react'
import ReactDOM from 'react-dom/client'
import Index from './pages/home/Index.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />  
  </React.StrictMode>,
)
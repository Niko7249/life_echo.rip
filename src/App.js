import MyGlobe from "./MyGlobe";
import Header from "./Components/Header";

import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  BrowserRouter,
  Routes,
  Route 
} from 'react-router-dom';
import Dashboard from "./Dashboard";
import { useEffect } from "react";

function Layout() {
  return (
      <>
        <Header />
        <Outlet />
      </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [  
      {
        path: '/',
        element: <MyGlobe />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
    ]
  }
])

function App() {

  return (
    <RouterProvider router={router}/>
    // <div className="w-screen h-screen">
    //   <MyGlobe />
    // </div>
  );
}

export default App;

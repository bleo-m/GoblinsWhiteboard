import React from 'react';

import { Analytics } from '@vercel/analytics/react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

import App from './App.jsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { WhiteboardProvider } from './contexts/WhiteboardContext.tsx';
import ErrorPage from './pages/error-page.tsx';
import Home from './pages/Home.tsx';
import LoginPage from './pages/LoginPage.tsx';
import WhiteboardLabelingPage from './pages/WhiteboardLabeling.tsx';
import WhiteboardsSelection from './pages/WhiteboardSelection.tsx';
import PrivateRoutes from './privateRoutes.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<App />}>
        <Route index element={<Home />} />
      </Route>
      <Route element={<PrivateRoutes protectAgainstLoggedIn={true} />}>
        <Route path="/auth" element={<LoginPage />} />
      </Route>
      <Route element={<PrivateRoutes />}>
        <Route
          element={
            <WhiteboardProvider>
              <App />
            </WhiteboardProvider>
          }
        >
          <Route path="whiteboards" element={<WhiteboardsSelection />} />
          <Route
            path="whiteboards/:whiteboardID/label"
            element={<WhiteboardLabelingPage />}
          />
        </Route>
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <main>
      <AuthProvider>
        <RouterProvider router={router} />
        <Analytics />
      </AuthProvider>
    </main>
  </React.StrictMode>,
);

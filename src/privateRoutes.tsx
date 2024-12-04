import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from './contexts/AuthContext';

interface PrivateRoutesProps {
  protectAgainstLoggedIn?: boolean;
}

/**
 * A component that handles private routes based on the user's authentication status. By default, protects routes
 * from users who are NOT logged in.
 *
 * @param {PrivateRoutesProps} props - The properties for the PrivateRoutes component.
 * @param {boolean} props.protectAgainstLoggedIn - A flag indicating whether the route should be protected from logged-in users.
 * @returns {JSX.Element} - The appropriate route component based on the user's authentication status.
 */
export default function PrivateRoutes({
  protectAgainstLoggedIn = false,
}: PrivateRoutesProps) {
  const { currentUser } = useAuth();
  if (protectAgainstLoggedIn) {
    // Protect the route against logged-in users, such as in the case of a login page
    return currentUser ? <Navigate to="/" /> : <Outlet />;
  } else {
    return currentUser ? <Outlet /> : <Navigate to="/auth" />;
  }
}

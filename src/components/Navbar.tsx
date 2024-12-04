import './Navbar.css';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const APP_NAME = 'WHITEBOARD LABELING';
  const nagivate = useNavigate();
  const { currentUser, signOutUser } = useAuth();

  const onSignOutClicked = () => {
    if (signOutUser) {
      signOutUser();
    }
  };

  return (
    <nav className="navbar">
      <div className="title" onClick={() => nagivate('/')}>
        {APP_NAME}
      </div>
      <div className="navbarButtonGroup">
        {currentUser ? (
          <>
            <div className="NavbarUserName inline text-[16px] font-bold mr-4">
              {`Hello, ${currentUser.displayName ?? ''}!`}
            </div>
            <button className="navbarButton inline" onClick={onSignOutClicked}>
              Sign Out
            </button>
          </>
        ) : (
          <button
            className="navbarButton"
            onClick={() => {
              nagivate('/auth');
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

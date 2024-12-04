import { useNavigate } from 'react-router-dom';

import './Home.css';
import Record from '../components/Record';
import '../pages/MobileButtons.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="splashTextContainer">
        <h1>WELCOME!</h1>
        <h2>Lets label some whiteboards.</h2>
        <div className="splashParagraphContainer">
          <div className="splashPageButtonGroupContainer">
            <button
              className="mobileButton"
              onClick={() => navigate('/whiteboards')}
            >
              START LABELING
            </button>
          </div>
        </div>
      </div>

      <Record stationIcon={'/whiteUnitCircle.png'} />
    </>
  );
};

export default Home;

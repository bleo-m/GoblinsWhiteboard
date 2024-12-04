import './BottomTab.css';
import 'remixicon/fonts/remixicon.css';

const BottomTab = () => {
  return (
    <div className="BottomTab">
      <div
        className="icon-container"
        onClick={() => {
          window.open('https://www.github.com/bleo-m', '_blank');
        }}
      >
        <i className="ri-github-line social_icons"></i>
        <p>Github</p>
      </div>
    </div>
  );
};

export default BottomTab;

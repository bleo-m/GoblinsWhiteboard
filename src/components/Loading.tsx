import { waveform, dotPulse, quantum, dotSpinner } from 'ldrs';
import './Loading.css';

type loadingProps = {
  orbit?: boolean;
  nuclear?: boolean;
  dot?: boolean;
};

const Loading = ({
  orbit = false,
  nuclear = false,
  dot = false,
}: loadingProps) => {
  waveform.register();
  dotPulse.register();
  quantum.register();
  dotSpinner.register();
  return (
    <div className="loadingComponent">
      {orbit && <l-dot-pulse size="30" speed="1.1" color="white"></l-dot-pulse>}
      {nuclear && <l-quantum size="100" speed="1.8" color="white"></l-quantum>}
      {!nuclear && !orbit && !dot && (
        <l-waveform size="35" stroke="3.5" speed="1" color="white"></l-waveform>
      )}
      {dot && (
        <l-dot-spinner size="55" speed=".75" color="white"></l-dot-spinner>
      )}
    </div>
  );
};

export default Loading;

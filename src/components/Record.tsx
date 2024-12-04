import './Record.css';

type props = {
  stationIcon: string;
};

/**
 * Taken from a past project I worked on with a spinnig vinyl record.
 * A bit over-engineered for its purpose in the splash-page of this whiteboard project,
 * but it makes sense in its original context.
 */
const Record = ({ stationIcon }: props) => {
  return (
    <div className="record">
      <img
        className="animate-spin-slow stationIcon"
        src={stationIcon}
        alt="unit-circle"
      />
    </div>
  );
};

export default Record;

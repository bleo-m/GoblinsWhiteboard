import React from 'react';

import { Link } from 'react-router-dom';

import ExportChunks from '@/components/ExportCSV';
import { useWhiteboardContext } from '@/contexts/WhiteboardContext';

const WhiteboardSelectionPage: React.FC = () => {
  const { whiteboards } = useWhiteboardContext();

  return (
    <div className="overflow-scroll h-full">
      <ExportChunks />
      <h1 className="mt-4">Select a Whiteboard</h1>
      {whiteboards.length === 0 ? (
        <p>Loading whiteboards...</p>
      ) : (
        <div className="flex flex-wrap">
          {whiteboards.map((wb) => (
            <div className="mb-20 mr-4" key={wb.id}>
              <Link to={`/whiteboards/${wb.id}/label`}>
                {wb.id}
                <img
                  src={wb.image_url}
                  alt={`Whiteboard ${wb.id}`}
                  style={{ maxWidth: '200px', marginRight: '10px' }}
                />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WhiteboardSelectionPage;

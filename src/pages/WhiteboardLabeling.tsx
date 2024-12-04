import React, { useState, useRef, useEffect } from 'react';

import Konva from 'konva'; // Import Konva for its types
import { Stage, Layer, Image as KonvaImage, Rect, Text } from 'react-konva';
import { useParams, useNavigate } from 'react-router-dom';
import { type Chunk } from 'server/users/whiteboards/collection';
import useImage from 'use-image';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useWhiteboardContext } from '@/contexts/WhiteboardContext';

type WhiteboardParams = {
  whiteboardID: string;
};

const CONFIDENCE_COLORS = {
  high: 'rgba(0, 255, 0, 0.25)',
  medium: 'rgba(255, 255, 0, 0.25)',
  low: 'rgba(255, 0, 0, 0.25)',
};

const WhiteboardLabelingPage = () => {
  const { whiteboardID } = useParams<WhiteboardParams>();
  const navigate = useNavigate();
  const { whiteboards } = useWhiteboardContext();
  const { currentUser } = useAuth();
  const currentWhiteboard = whiteboards.find(
    (whiteboard) => whiteboard.id === whiteboardID,
  );

  // States
  const [image] = useImage(currentWhiteboard?.image_url || '');
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [activelySelecting, setActivelySelecting] = useState(false);
  const [currentChunk, setCurrentChunk] = useState<Chunk | null>(null);
  const [loading, setLoading] = useState(false);

  // Get chunks from the database if they exist
  useEffect(() => {
    const fetchChunks = async () => {
      if (currentUser) {
        const response = await fetch(
          `/api/users/${currentUser.uid}/whiteboards/${whiteboardID}`,
          {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
              useridtoken: (await currentUser?.getIdToken(true)) ?? '',
            },
          },
        );

        if (response.ok) {
          const { chunks } = await response.json();
          console.log('da chunks', chunks);
          setChunks(chunks);
        } else {
          console.error('Failed to fetch chunks. Maybe they do not exist yet.');
        }
      }
    };
    fetchChunks();
  }, [currentUser, whiteboardID]);

  const stageRef = useRef<Konva.Stage | null>(null);

  // Handlers for drawing and labeling chunks
  const handleMouseDown = () => {
    if (currentChunk) return;
    const pos = stageRef.current?.getPointerPosition();
    if (pos) {
      const newChunk: Chunk = {
        coordinates: { x: pos.x, y: pos.y },
        dimensions: { width: 0, height: 0 },
        transcription: '',
        confidence: 'high',
      };
      setCurrentChunk(newChunk);
      setActivelySelecting(true);
    }
  };

  const handleMouseMove = () => {
    if (activelySelecting && currentChunk) {
      const pos = stageRef.current?.getPointerPosition();
      if (pos) {
        const width = pos.x - currentChunk.coordinates.x;
        const height = pos.y - currentChunk.coordinates.y;
        const dimensions = { width, height };
        setCurrentChunk({ ...currentChunk, dimensions });
      }
    }
  };

  const handleMouseUp = () => {
    if (currentChunk) {
      // setChunks([...chunks, currentChunk]);
      setActivelySelecting(false);
      // setCurrentChunk(null); // Reset the current chunk after selection
    }
  };

  return (
    <div className="h-full overflow-scroll">
      <Button
        variant="secondary"
        onClick={() => {
          navigate('/whiteboards');
        }}
      >
        Back to Whiteboards
      </Button>
      <h1>Label Whiteboard {whiteboardID}</h1>
      {image && (
        <Stage
          width={image.width}
          height={image.height}
          ref={stageRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            <KonvaImage
              image={image}
              x={0}
              y={0}
              width={image.width}
              height={image.height}
            />

            {/* Render selected chunks */}
            {chunks.map((chunk, index) => (
              <React.Fragment key={index}>
                <Rect
                  x={chunk.coordinates.x}
                  y={chunk.coordinates.y}
                  width={chunk.dimensions.width}
                  height={chunk.dimensions.height}
                  stroke="black"
                  strokeWidth={2}
                  fill={CONFIDENCE_COLORS[chunk.confidence]}
                />
                <Text
                  x={chunk.coordinates.x}
                  y={chunk.coordinates.y - 20}
                  text={`#${index} Conf: ${chunk.confidence} | Transcription: ${chunk.transcription}`}
                  fontSize={14}
                  fill="black"
                />
              </React.Fragment>
            ))}

            {/* Render the current selection while drawing */}
            {currentChunk && (
              <Rect
                x={currentChunk.coordinates.x}
                y={currentChunk.coordinates.y}
                width={currentChunk.dimensions.width}
                height={currentChunk.dimensions.height}
                stroke="red"
                strokeWidth={2}
                dash={[10, 5]} // Dashed border for selection
              />
            )}
          </Layer>
        </Stage>
      )}

      {/* Labeling inputs */}
      {currentChunk && (
        <div className="flex flex-col items-start">
          <h2 className="font-bold mb-4">Label the Selected Chunk</h2>
          <div className="flex items-start">
            <label>Transcription:</label>
            <textarea
              className="border border-white bg-transparent ml-4"
              value={currentChunk.transcription}
              onChange={(e) =>
                setCurrentChunk({
                  ...currentChunk,
                  transcription: e.target.value,
                })
              }
            />
          </div>
          <br />
          <label>
            Confidence:
            <select
              className="border border-white bg-transparent ml-4"
              value={currentChunk.confidence}
              onChange={(e) =>
                setCurrentChunk({
                  ...currentChunk,
                  confidence: e.target.value as 'high' | 'medium' | 'low',
                })
              }
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <br />
          <div className="flex space-x-4">
            <Button
              variant={'secondary'}
              onClick={() => {
                setCurrentChunk(null); // Reset the current chunk without saving
                setActivelySelecting(false); // Stop the selection process
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (currentChunk) {
                  setChunks([...chunks, currentChunk]);
                  setCurrentChunk(null); // Reset after labeling
                }
              }}
            >
              Create Chunk
            </Button>
          </div>
        </div>
      )}

      {/* Chunks list */}
      <div className="mt-4">
        <h2 className="font-bold">Labeled Chunks</h2>
        {chunks.length === 0 ? (
          <p>No chunks labeled yet.</p>
        ) : (
          <ul>
            {chunks.map((chunk, index) => (
              <li key={index} className="flex items-center space-x-4">
                <span>
                  {`Chunk ${index + 1}: ${chunk.transcription} (Confidence: ${
                    chunk.confidence
                  })`}
                </span>
                <Button
                  variant={'secondary'}
                  onClick={() => {
                    const updatedChunks = chunks.filter((_, i) => i !== index);
                    setChunks(updatedChunks);
                  }}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Save changes */}
      <Button
        disabled={currentUser === null || loading}
        onClick={async () => {
          if (currentUser) {
            setLoading(true);
            console.log('Saving chunks to backend...', chunks);

            const response = await fetch(
              `/api/users/${currentUser.uid}/whiteboards/${whiteboardID}`,
              {
                method: 'PUT',
                headers: {
                  'content-type': 'application/json',
                  useridtoken: (await currentUser?.getIdToken(true)) ?? '',
                },
                body: JSON.stringify({ whiteboardID, chunks }),
              },
            );

            if (response.ok) {
              console.log('Chunks saved successfully');
            } else {
              console.error('Failed to save chunks');
            }
            setLoading(false);
          }
        }}
      >
        {loading ? 'Saving...' : 'Save whiteboard'}
      </Button>
    </div>
  );
};

export default WhiteboardLabelingPage;

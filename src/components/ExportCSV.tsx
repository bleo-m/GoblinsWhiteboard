import { useState, useEffect } from 'react';

import Papa from 'papaparse';
import { type Chunk } from 'server/users/whiteboards/collection';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

type WhiteboardServerData = {
  id: string;
  chunks: Chunk[];
};

const ExportChunks = () => {
  const [whiteboards, setWhiteboards] = useState<WhiteboardServerData[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const exportChunksToCSV = (whiteboards: WhiteboardServerData[]) => {
    setLoading(true);
    // Format the data for CSV
    const formattedData: Array<{
      whiteboardId: string;
      x: number;
      y: number;
      transcription: string;
      confidence: string;
    }> = [];
    whiteboards.forEach((whiteboard) => {
      whiteboard.chunks.forEach((chunk: Chunk) => {
        formattedData.push({
          whiteboardId: whiteboard.id,
          x: chunk.coordinates.x,
          y: chunk.coordinates.y,
          transcription: chunk.transcription,
          confidence: chunk.confidence,
        });
      });
    });

    console.log(formattedData);
    setLoading(false);
    // Convert to CSV string
    const csv = Papa.unparse(formattedData);

    // Create a Blob from the CSV string
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    // Create a link element for downloading
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'chunks_data.csv');
      link.click();
    }
  };

  // Get chunks from the database if they exist
  useEffect(() => {
    const fetchChunks = async () => {
      if (currentUser) {
        const response = await fetch(
          `/api/users/${currentUser.uid}/whiteboards`,
          {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
              useridtoken: (await currentUser?.getIdToken(true)) ?? '',
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setWhiteboards(data);
          console.log('fetched whiteboards', data);
        } else {
          console.error('Failed to fetch chunks. Maybe they do not exist yet.');
        }
      }
    };
    fetchChunks();
  }, [currentUser]);

  return (
    <Button disabled={loading} onClick={() => exportChunksToCSV(whiteboards)}>
      EXPORT DATA
    </Button>
  );
};

export default ExportChunks;

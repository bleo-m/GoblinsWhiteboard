import { DocumentData } from 'firebase-admin/firestore';

import { type Chunk } from './collection.js';

type WhiteboardResponse = {
  id: string;
  chunks: Chunk[];
};

/**
 * Transform a whiteboardID and whiteboard DocumentData object into an object
 * with all the information needed by the frontend
 *
 * @param {DocumentData} whiteboardData - A whiteboard's info on its fields + its ID injected in collection.ts
 * @returns {whiteboardResponse} - The whiteboard response
 */
const constructWhiteboardResponse = (
  whiteboardData: DocumentData,
): WhiteboardResponse => {
  return {
    id: whiteboardData._id,
    chunks: whiteboardData.chunks,
  };
};

export { constructWhiteboardResponse };

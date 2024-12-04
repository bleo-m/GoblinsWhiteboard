import { DocumentData, getFirestore } from 'firebase-admin/firestore';

import { firebaseApp } from '../../../api/firebase.js';

const db = getFirestore(firebaseApp);

export type Chunk = {
  coordinates: { x: number; y: number };
  dimensions: { width: number; height: number };
  transcription: string;
  confidence: 'high' | 'medium' | 'low';
};

class WhiteboardCollection {
  /**
   * Find all whiteboards belonging to a given user.
   *
   * @param {string} userID - The ID of the user whose whiteboards will be returned
   * @return {DocumentData[]} - An array of all the whiteboards and their field values
   */
  static async findAllWhiteboardsByUserID(
    userID: string,
  ): Promise<DocumentData[]> {
    const whiteboardsSnapshot = (
      await db.collection(`users/${userID}/whiteboards`).get()
    ).docs;
    const whiteboards = whiteboardsSnapshot.map((docSnapshot) => ({
      _id: docSnapshot.id,
      ...docSnapshot.data(),
    }));

    return whiteboards;
  }

  /**
   * Find a whiteboard belonging to a user by its ID.
   *
   * @param {string} whiteboardID - the ID of the whiteboard to look up
   * @param { string } userID - the ID of the user
   * @return {DocumentData | undefined} - The requested whiteboard's data
   */
  static async findWhiteboardByID(
    whiteboardID: string,
    userID: string,
  ): Promise<DocumentData | undefined> {
    const whiteboardRef = db
      .collection(`users/${userID}/whiteboards`)
      .doc(whiteboardID);
    const whiteboardsSnapshot = await whiteboardRef.get();
    const whiteboard = whiteboardsSnapshot.data();
    if (!whiteboardsSnapshot.exists) {
      return undefined;
    }
    return { ...whiteboard, _id: whiteboardsSnapshot.id };
  }

  /**
   * Upsert a whiteboard in the user's whiteboard collection.
   *
   * @param {string} userID - The ID of the user to upsert the whiteboard for.
   * @param {string} whiteboardID - The ID of the whiteboard to upsert.
   * @param {Array} chunks - The chunks to be upserted to the whiteboard.
   */
  static async upsertWhiteboard(
    userID: string,
    whiteboardID: string,
    chunks: Chunk[],
  ): Promise<DocumentData | undefined> {
    const whiteboardRef = db
      .collection(`users/${userID}/whiteboards`)
      .doc(whiteboardID);

    await whiteboardRef.set(
      {
        chunks,
      },
      { merge: true },
    );

    return { _id: whiteboardRef.id, ...(await whiteboardRef.get()).data() };
  }
}

export default WhiteboardCollection;

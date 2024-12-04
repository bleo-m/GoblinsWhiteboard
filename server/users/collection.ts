import { DocumentData, getFirestore } from 'firebase-admin/firestore';

import { firebaseApp } from '../../api/firebase.js';

const db = getFirestore(firebaseApp);

class UserCollection {
  /**
   * Find user by ID.
   *
   * @param {string} userID - the ID of the user to look up
   * @return {DocumentData | undefined} - The requested user's snapshot
   */
  static async findUserByID(userID: string): Promise<DocumentData | undefined> {
    const userRef = db.collection('users').doc(userID);
    const user = (await userRef.get()).data();
    return user;
  }

  /**
   * Find all users.
   *
   * @return {DocumentData[]} - An array of all the users and their field values
   */
  static async findAllUsers(): Promise<DocumentData[]> {
    const userSnapshots = (await db.collection('users').get()).docs;
    const users = userSnapshots.map((snapshot) => snapshot.data());
    return users;
  }

  /**
   * Create a new user.
   */
  static async createUser(
    name: string,
    email: string,
    userID: string,
  ): Promise<DocumentData | undefined> {
    const userRef = db.collection('users').doc(userID);
    await userRef.set({ name, email });

    const user = (await userRef.get()).data();
    return user;
  }

  /**
   * Update user data by ID.
   */
  static async updateUserByID(
    userID: string,
    data: { name?: string; email?: string },
  ): Promise<DocumentData | undefined> {
    const userRef = db.collection('users').doc(userID);
    await userRef.update(data);

    const user = (await userRef.get()).data();
    return user;
  }
}

export default UserCollection;

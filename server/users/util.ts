import { DocumentData } from 'firebase-admin/firestore';

type UserResponse = {
  name: string;
  email: string;
};

/**
 * Transform a User DocumentData object into an object
 * with all the information needed by the frontend
 *
 * @param {DocumentData} userData - A user's info on its fields
 * @returns {UserResponse} - The user response
 */
const constructUserResponse = (userData: DocumentData): UserResponse => {
  return {
    name: userData.name,
    email: userData.email,
  };
};

export { constructUserResponse };

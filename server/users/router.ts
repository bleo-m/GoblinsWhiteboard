import express from 'express';

import UserCollection from './collection.js';
import { checkUserIsLoggedInMiddleware } from './middleware.js';
import { constructUserResponse } from './util.js';
import WhiteboardCollection from './whiteboards/collection.js';
import { constructWhiteboardResponse } from './whiteboards/util.js';

const router = express.Router();

/**
 * Get all whiteboards for a user
 *
 * @name GET /api/users/:userID/whiteboards
 *
 * @return {whiteboardResponse[]} - A list of all whiteboards of the user
 * @throws {404} - if no user with given userID exists
 */
/**
 * Get one whiteboard with a given ID for a user
 * @name GET /api/users/:userID/whiteboards/:whiteboardID
 *
 * @return {whiteboardResponse} - The whiteboard with the given ID
 * @throws {404} - if no whiteboard with given ID exists
 */
router.get(
  '/:userID/whiteboards/:whiteboardID?',
  [checkUserIsLoggedInMiddleware],
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    // Check if whiteboardID parameter was supplied
    if (req.params.whiteboardID !== undefined) {
      next();
      return;
    }

    const userID = req.params.userID as string;

    try {
      const whiteboards =
        await WhiteboardCollection.findAllWhiteboardsByUserID(userID);
      const whiteboardsResponse = whiteboards.map((whiteboards) =>
        constructWhiteboardResponse(whiteboards),
      );
      console.log({ whiteboardsResponse, whiteboards, userID });

      res.status(200).json(whiteboardsResponse);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: 'Error with getting whiteboards' });
    }
  },
  [],
  async (req: express.Request, res: express.Response) => {
    const userID = req.params.userID as string;
    const whiteboardID = req.params.whiteboardID as string;

    try {
      const whiteboard = await WhiteboardCollection.findWhiteboardByID(
        whiteboardID,
        userID,
      );
      if (whiteboard === undefined) {
        res.status(404).send('Whiteboard not found');
        return;
      }
      const whiteboardResponse = constructWhiteboardResponse(whiteboard);

      res.status(200).json(whiteboardResponse);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: 'Error with getting whiteboards' });
    }
  },
);

/**
 * Get a user with the given ID
 *
 * @name GET /api/users/:userID
 *
 * @return {UserResponse} - The user response
 * @throws {404} - if no user with that ID exists
 */
router.get(
  '/:userID',
  [checkUserIsLoggedInMiddleware],
  async (req: express.Request, res: express.Response) => {
    const userID = req.params.userID as string;
    const user = await UserCollection.findUserByID(userID);
    if (user === undefined) {
      res.status(404).send('User not found');
      return;
    }
    const userResponse = constructUserResponse(user);

    res.status(200).json(userResponse);
  },
);

/**
 * Get all users
 *
 * @name GET /api/users
 *
 * @return {UserResponse[]} - A list of all users
 */
router.get(
  '/',
  [checkUserIsLoggedInMiddleware],
  async (_req: express.Request, res: express.Response) => {
    const users = await UserCollection.findAllUsers();
    const usersResponse = users.map((user) => constructUserResponse(user));

    res.status(200).json(usersResponse);
  },
);

/**
 * Create a new user
 *
 * @name POST /api/users
 *
 * @param {string} email - The user's email
 * @param {string} name - The user's name
 * @return {UserResponse} - The created user
 */
router.post('/', async (req: express.Request, res: express.Response) => {
  const { email, name, userID } = req.body;
  if (!email || !name || !userID) {
    res.status(400).send('Email, name, and userID are required');
    return;
  }

  try {
    const newUser = await UserCollection.createUser(name, email, userID);
    if (newUser === undefined) {
      res.status(400).send('User could not be created');
      return;
    }
    const userResponse = constructUserResponse(newUser);

    res.status(201).json(userResponse);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'Error with creating user' });
  }
});

/**
 * Update a whiteboard with the given ID for a user
 *
 * @name PUT /api/users/:userID/whiteboards/:whiteboardID
 *
 * @param {Chunk[]} chunks - The chunks to update the whiteboard with
 * @return {WhiteboardResponse} - The updated whiteboard
 * @throws {404} - if no whiteboard with that ID exists
 */
router.put(
  '/:userID/whiteboards/:whiteboardID',
  [checkUserIsLoggedInMiddleware],
  async (req: express.Request, res: express.Response) => {
    const userID = req.params.userID as string;
    const whiteboardID = req.params.whiteboardID as string;
    const { chunks } = req.body;

    const whiteboard = await WhiteboardCollection.upsertWhiteboard(
      userID,
      whiteboardID,
      chunks,
    );
    if (whiteboard === undefined) {
      res.status(404).send('Whiteboard not found');
      return;
    }
    const whiteboardResponse = constructWhiteboardResponse(whiteboard);

    res.status(200).json(whiteboardResponse);
  },
);

/**
 * Update a user with the given ID
 *
 * @name PATCH /api/users/:userID
 *
 * @return {UserResponse} - The updated user response
 */
router.put(
  '/:userID',
  [checkUserIsLoggedInMiddleware],
  async (req: express.Request, res: express.Response) => {
    const userID = req.params.userID as string;
    const data = req.body;
    const user = await UserCollection.updateUserByID(userID, data);
    if (user === undefined) {
      res.status(404).send('User not found');
      return;
    }
    const userResponse = constructUserResponse(user);

    res.status(200).json(userResponse);
  },
);

export { router as userRouter };

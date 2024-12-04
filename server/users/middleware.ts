import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';

const checkUserIsLoggedInMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userIDToken = req.headers.useridtoken as string;
  if (!userIDToken) {
    return res.status(401).json({ error: 'User is not logged in' });
  }
  let userID = '';

  getAuth()
    .verifyIdToken(userIDToken)
    .then((decodedToken) => {
      userID = decodedToken.uid;
      res.locals.userID = userID;
      next();
    })
    .catch((e) => {
      console.log(e);
      return res.status(401).json({ error: 'Invalid ID token' });
    });
};

export { checkUserIsLoggedInMiddleware };

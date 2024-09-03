import pkg from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const { verify } = pkg;

const validateToken = (req, res, next) => {
  try {
    const accessToken = req.header("Authorization").split(" ")[1];
    if (!accessToken) {
      console.log("test1")
      return res.sendStatus(401);
    }

    const payload = verify(accessToken, process.env.APP_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.sendStatus(401);
  }
}

export { validateToken };
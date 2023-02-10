import { expressjwt as jwt } from "express-jwt";
import { JWT_SECRETKEY } from "../config.json";
import R from "../utils/R";

function useJwt() {
  return jwt({
    secret: JWT_SECRETKEY,
    algorithms: ["HS256"],
  }).unless({
    path: ["/api/user/login", "/api/user/register", "/static"],
  });
}

export function useJwtAuth() {
  // @ts-ignore
  return (err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
      res.json(R.fail(R.AUTH_ERR, Error("Invalid Token.")));
    }
  };
}

export default useJwt;

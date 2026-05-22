

import { UnAuthenticatedErr, UnauthorizedErr } from "../errors/customErors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;

    if (!token || token === 'logout') {
    throw new UnAuthenticatedErr(
      "Authentication invalid - Please sign in"
    );
  }

  try {
    const { userId, role, phoneNumber } = verifyJWT(token);
    req.user = { userId, role,phoneNumber };
    next();
  } catch (error) {
    throw new UnAuthenticatedErr(
      "Authentication invalid - Please sign in"
    );
  }
};


// Optional authentication - doesn't throw error if no user
  export const optionalAuth = (req, res, next) => {
    const token = req.cookies.token;
    // If no token or logout token, set user to null and continue
    if (!token || token === 'logout') {
      
      req.user = null;
      return next();
    }
    try {
      const { userId, role, phoneNumber } = verifyJWT(token);
      req.user = { userId, role,phoneNumber };
      next();
    } catch (error) {
      // If token is invalid, just set user to null instead of throwing error
      req.user = null;
      next();
    }
  };


export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedErr("Unauthorized to access this route");
    }
    next();
  };
};



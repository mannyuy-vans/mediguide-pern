declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        authUserId: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
      };
    }
  }
}

export {};
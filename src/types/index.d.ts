export interface JwtPayload {
  sub: string;
  preferred_username: string;
  email: string;
  realm_access: {
    roles: string[];
  };
}

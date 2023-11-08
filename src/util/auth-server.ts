export const verifyToken = (token: string) => {
  const expectedToken = process.env.TOKEN;
  return token === expectedToken;
}
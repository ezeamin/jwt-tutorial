export const decodePayload = (token: string) => {
  const payload = token.split('.')[1];
  const decodedPayload = JSON.parse(atob(payload));

  return decodedPayload;
};

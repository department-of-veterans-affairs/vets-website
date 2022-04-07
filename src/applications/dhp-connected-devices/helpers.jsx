export const authorizeWithVendor = async authUrl => {
  return fetch(authUrl).then(response => response.json());
};

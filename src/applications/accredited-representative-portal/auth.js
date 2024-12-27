import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';

let user = null;

export async function fetchUser() {
  try {
    user = await apiRequest('/accredited_representative_portal/v0/user');
    return user;
  } catch (error) {
    user = null;
    throw error;
  }
}

export function getUser() {
  return user;
}

export function isAuthenticated() {
  return user !== null;
}

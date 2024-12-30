import { redirect } from 'react-router';
import { fetchUser, isAuthenticated } from './auth';
import { SIGN_IN_URL } from './constants';

export async function userLoader() {
  try {
    const user = await fetchUser();
    if (!isAuthenticated()) {
      redirect(SIGN_IN_URL);
    }
    return user;
  } catch (error) {
    redirect(SIGN_IN_URL);
    return null;
  }
}

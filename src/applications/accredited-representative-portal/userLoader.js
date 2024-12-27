import { redirect } from 'react-router';
import { isAuthenticated } from './auth';
import { SIGN_IN_URL } from './constants';

export async function userLoader() {
  try {
    // const user = await fetchUser();
    const user = { profile: { firstName: 'John', lastName: 'Doe' } };
    if (!isAuthenticated()) {
      redirect(SIGN_IN_URL);
    }
    return user;
  } catch (error) {
    redirect(SIGN_IN_URL);
    return null;
  }
}

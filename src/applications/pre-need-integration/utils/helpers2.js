import { isAuthorizedAgent, isVeteran } from './helpers';

// Helper functions to check authentication status for veteran applicant details pages
export const isLoggedInVeteran = formData => {
  const isLoggedIn = formData?.['view:loginState']?.isLoggedIn || false;
  const isVet = isVeteran(formData);
  const isAgent = isAuthorizedAgent(formData);
  return !isAgent && isVet && isLoggedIn;
};

export const isNotLoggedInVeteran = formData => {
  const isLoggedIn = formData?.['view:loginState']?.isLoggedIn || false;
  const isVet = isVeteran(formData);
  const isAgent = isAuthorizedAgent(formData);
  return !isAgent && isVet && !isLoggedIn;
};

export const isLoggedInVeteranPreparer = formData => {
  const isLoggedIn = formData?.['view:loginState']?.isLoggedIn || false;
  const isVet = isVeteran(formData);
  const isAgent = isAuthorizedAgent(formData);
  return isAgent && isVet && isLoggedIn;
};

export const isNotLoggedInVeteranPreparer = formData => {
  const isLoggedIn = formData?.['view:loginState']?.isLoggedIn || false;
  const isVet = isVeteran(formData);
  const isAgent = isAuthorizedAgent(formData);
  return isAgent && isVet && !isLoggedIn;
};

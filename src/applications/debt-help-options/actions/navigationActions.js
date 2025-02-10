// ./actions/navigationActions.js
import { browserHistory } from 'react-router';

export const navigateTo = (page, outcome = null) => {
  let newUrl;
  if (page === 'intro') {
    newUrl = '/manage-va-debt/debt-help-options/intro';
  } else if (page === 'results') {
    newUrl = '/manage-va-debt/debt-help-options/results';
  } else {
    newUrl = `/manage-va-debt/debt-help-options/${page}`;
  }
  browserHistory.push(newUrl);

  return {
    type: 'NAVIGATE_TO',
    payload: { page, outcome },
  };
};

export const navigateBack = () => {
  browserHistory.goBack();
  return {
    type: 'NAVIGATE_BACK',
  };
};

export const resetNavigation = () => ({
  type: 'RESET_NAVIGATION',
});

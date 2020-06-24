// libs
import { createSelector } from 'reselect';

const formSelector = state => state.form;
const navigationSelector = state => state.navigation;
const userSelector = state => state.user;

const preSubmitInfoSelector = formConfig => formConfig?.preSubmitInfo;

const preSubmitSelector = createSelector(
  preSubmitInfoSelector,
  (preSubmitInfo = {}) => {
    return {
      required: false,
      field: 'AGREED',
      label: 'I agree to the terms and conditions.',
      error: 'You must accept the agreement before submitting.',
      ...preSubmitInfo,
    };
  },
);

const showLoginModalSelector = createSelector(
  navigationSelector,
  state => state.showLoginModal,
);

export {
  formSelector,
  preSubmitSelector,
  showLoginModalSelector,
  userSelector,
};

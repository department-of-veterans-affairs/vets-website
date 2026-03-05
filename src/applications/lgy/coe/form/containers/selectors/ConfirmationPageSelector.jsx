import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getFormData } from 'platform/forms-system/src/js/state/selectors';
import ConfirmationPage from '../ConfirmationPage';
import ConfirmationPage2 from '../ConfirmationPage2';
import { TOGGLE_KEY } from '../../constants';

// Changed this from Intro version for testing purposes including using Boolean instead of !!
export const shouldUseNewConfirmation = formData =>
  Boolean(formData?.[`view:${TOGGLE_KEY}`]);

export const ConfirmationPageSelector = props => {
  const formData = useSelector(getFormData) || {};
  const ConfirmationPageComponent = shouldUseNewConfirmation(formData)
    ? ConfirmationPage2
    : ConfirmationPage;
  return <ConfirmationPageComponent {...props} />;
};

ConfirmationPageSelector.propTypes = {
  route: PropTypes.object,
};

export default ConfirmationPageSelector;

import React from 'react';
import PropTypes from 'prop-types';
import { APPOINTMENT_TYPES } from '../../../utils/constants';
import CancelPageLayoutRequest from './CancelPageLayoutRequest';
import CancelPageLayout from './CancelPageLayout';

export default function CancelPageContent({ type }) {
  if (
    APPOINTMENT_TYPES.request === type ||
    APPOINTMENT_TYPES.ccRequest === type
  )
    return <CancelPageLayoutRequest />;

  return <CancelPageLayout />;
}
CancelPageContent.propTypes = {
  type: PropTypes.string,
};

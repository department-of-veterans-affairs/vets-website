import PropTypes from 'prop-types';
import React from 'react';
import { APPOINTMENT_TYPES } from '../../../utils/constants';
import CancelPageLayout from './CancelPageLayout';
import CancelPageLayoutRequest from './CancelPageLayoutRequest';

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

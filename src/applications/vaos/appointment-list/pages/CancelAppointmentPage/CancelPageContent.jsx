import PropTypes from 'prop-types';
import React from 'react';
import CancelPageLayout from './CancelPageLayout';
import CancelPageLayoutRequest from './CancelPageLayoutRequest';

export default function CancelPageContent({ appointment, isRequest }) {
  if (isRequest) return <CancelPageLayoutRequest appointment={appointment} />;

  return <CancelPageLayout appointment={appointment} />;
}
CancelPageContent.propTypes = {
  appointment: PropTypes.object,
  isRequest: PropTypes.bool,
};

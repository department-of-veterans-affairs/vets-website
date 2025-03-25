import PropTypes from 'prop-types';
import React from 'react';
import CancelPageLayout from './CancelPageLayout';
import CancelPageLayoutRequest from './CancelPageLayoutRequest';

export default function CancelPageContent({ isRequest }) {
  if (isRequest) return <CancelPageLayoutRequest />;

  return <CancelPageLayout />;
}
CancelPageContent.propTypes = {
  isRequest: PropTypes.bool,
};

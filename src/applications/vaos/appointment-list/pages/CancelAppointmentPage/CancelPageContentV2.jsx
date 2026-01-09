import PropTypes from 'prop-types';
import React from 'react';
import CancelPageLayout from './CancelPageLayoutV2';
import CancelPageLayoutRequest from './CancelPageLayoutRequestV2';

export default function CancelPageContent({ data: appointment }) {
  if (appointment.pending) return <CancelPageLayoutRequest />;

  return <CancelPageLayout data={appointment} />;
}
CancelPageContent.propTypes = {
  data: PropTypes.object,
};

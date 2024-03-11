import React from 'react';
import PropTypes from 'prop-types';
import MissingFileOverview from '../components/File/MissingFileOverview';

export const optionalDescription =
  'These files are not required to complete your application, but may prevent delays in your processing time.';
export const requiredDescription =
  'These files are required to complete your application';

export default function SupportingDocumentsPage({
  contentAfterButtons,
  data,
  goBack,
  goForward,
  setFormData,
}) {
  const OverviewComp = MissingFileOverview({
    contentAfterButtons,
    data,
    goBack,
    goForward,
    disableLinks: false,
    setFormData,
    showConsent: false,
  });
  return <>{OverviewComp}</>;
}

SupportingDocumentsPage.propTypes = {
  contentAfterButtons: PropTypes.object,
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  setFormData: PropTypes.func,
};

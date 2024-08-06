import React from 'react';
import PropTypes from 'prop-types';
import { REQUIRED_FILES, OPTIONAL_FILES } from '../config/constants';
import MissingFileOverview from '../../shared/components/fileUploads/MissingFileOverview';

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
    fileNameMap: { ...REQUIRED_FILES, ...OPTIONAL_FILES },
    requiredFiles: REQUIRED_FILES,
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

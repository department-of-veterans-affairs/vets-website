import React from 'react';
import PropTypes from 'prop-types';
import { requiredFiles } from '../config/constants';
import MissingFileOverview from '../../shared/components/fileUploads/MissingFileOverview';
import { prefixFileNames } from './MissingFileConsentPage';

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
    fileNameMap: prefixFileNames(data, requiredFiles),
    requiredFiles,
    nonListNameKey: 'applicantName',
    showNameHeader: false,
    showFileBullets: true,
    showRequirementHeaders: false,
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

import React from 'react';
import { REQUIRED_FILES, OPTIONAL_FILES } from '../config/constants';
import MissingFileOverview, {
  MissingFileConsentPagePropTypes,
} from '../../shared/components/fileUploads/MissingFileOverview';
import { CHAMPVA_FAX_NUMBER } from '../../shared/constants';

export function MissingFileConsentPage(props) {
  const OverviewComp = MissingFileOverview({
    contentAfterButtons: props.contentAfterButtons,
    data: props.data,
    goBack: props.goBack,
    goForward: props.goForward,
    setFormData: props.setFormData,
    disableLinks: true,
    heading: <></>,
    showMail: true,
    faxNum: CHAMPVA_FAX_NUMBER,
    showConsent: true,
    fileNameMap: { ...REQUIRED_FILES, ...OPTIONAL_FILES },
    requiredFiles: REQUIRED_FILES,
  });
  return <>{OverviewComp}</>;
}

MissingFileConsentPage.propTypes = MissingFileConsentPagePropTypes;

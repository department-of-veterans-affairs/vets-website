import React from 'react';
import { requiredFiles, optionalFiles } from '../config/requiredUploads';
import MissingFileOverview, {
  MissingFileConsentPagePropTypes,
} from '../../shared/components/fileUploads/MissingFileOverview';

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
    showConsent: true,
    fileNameMap: { ...requiredFiles, ...optionalFiles },
    requiredFiles,
  });
  return <>{OverviewComp}</>;
}

MissingFileConsentPage.propTypes = MissingFileConsentPagePropTypes;

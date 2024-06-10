import React from 'react';
import {
  requiredFiles,
  office,
  officeAddress,
  officeFaxNum,
} from '../config/constants';
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
    fileNameMap: { ...requiredFiles },
    requiredFiles,
    nonListNameKey: 'applicantName',
    mailingAddress: officeAddress,
    officeName: office,
    faxNum: officeFaxNum,
    showNameHeader: false,
    showRequirementHeaders: false,
  });
  return <>{OverviewComp}</>;
}

MissingFileConsentPage.propTypes = MissingFileConsentPagePropTypes;

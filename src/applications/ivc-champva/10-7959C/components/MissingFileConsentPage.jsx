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

/**
 * Adds applicant's name to front of all user-friendly file descriptions and
 * adds primary/secondary health insurance company names to associated file descriptions.
 * E.g., turns "Primary health insurance card" into "Jimmy's Blue Cross card"
 *
 * @param {object} formData standard form data object
 * @param {object} fileNames object mapping file upload property keys to user-friendly names
 * @returns object mapping file upload property keys to user-friendly names
 */
export function prefixFileNames(formData, fileNames) {
  const prefixed = {};
  const pi = 'Primary health insurance';
  const si = 'Secondary health insurance';
  Object.keys(fileNames).forEach(key => {
    prefixed[key] = `${fileNames[key]}`
      .replace(pi, formData?.applicantPrimaryProvider ?? pi)
      .replace(si, formData?.applicantSecondaryProvider ?? si);
  });
  return prefixed;
}

export function MissingFileConsentPage(props) {
  const fileNames = prefixFileNames(props.data, requiredFiles);

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
    fileNameMap: fileNames,
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

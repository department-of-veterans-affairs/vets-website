import React from 'react';
import PropTypes from 'prop-types';
import { requiredFiles } from '../config/constants';
import MissingFileOverview from '../../shared/components/fileUploads/MissingFileOverview';

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
  });
  return <>{OverviewComp}</>;
}

MissingFileConsentPage.propTypes = {
  form: PropTypes.shape({
    pages: PropTypes.object,
    data: PropTypes.shape({
      applicants: PropTypes.array,
      statementOfTruthSignature: PropTypes.string,
      veteransFullName: {
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      },
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      response: PropTypes.shape({ confirmationNumber: PropTypes.string }),
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
};

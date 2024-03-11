import React from 'react';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  optionalDescription,
  requiredDescription,
} from './SupportingDocumentsPage';
import MissingFileOverview from '../components/File/MissingFileOverview';

const requiredWarningHeading = (
  <VaAlert uswds status="warning">
    <h2>You have not uploaded all required supporting documents</h2>
    <p>{requiredDescription}</p>
  </VaAlert>
);

const optionalWarningHeading = (
  <VaAlert uswds status="warning">
    <h2>You have not uploaded all optional supporting documents</h2>
    <p>{optionalDescription}</p>
  </VaAlert>
);

export function MissingFileConsentPage(props) {
  const OverviewComp = MissingFileOverview({
    contentAfterButtons: props.contentAfterButtons,
    data: props.data,
    goBack: props.goBack,
    goForward: props.goForward,
    setFormData: props.setFormData,
    disableLinks: true,
    heading: <></>,
    optionalWarningHeading: <>{optionalWarningHeading}</>,
    requiredWarningHeading: <>{requiredWarningHeading}</>,
    showMail: true,
    showConsent: true,
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

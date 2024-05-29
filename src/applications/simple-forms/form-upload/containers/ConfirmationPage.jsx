import React from 'react';

import {
  VaAlert,
  VaBreadcrumbs,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import {
  getBreadcrumbList,
  getFormNumber,
  getFormUploadContent,
  handleRouteChange,
} from '../helpers';

const ConfirmationPage = () => {
  const history = useHistory();
  const location = useLocation();
  const fullName = useSelector(state => state?.user?.profile?.userFullName);
  const { state } = location;
  const { confirmationNumber, submittedAt } = state;
  const formNumber = getFormNumber(location);
  const formUploadContent = getFormUploadContent(formNumber);
  const breadcrumbList = getBreadcrumbList(formNumber);

  const onRouteChange = ({ detail }) => handleRouteChange({ detail }, history);

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <VaBreadcrumbs
        breadcrumbList={breadcrumbList}
        onRouteChange={onRouteChange}
      />
      <h1>{`Upload VA Form ${formNumber}`}</h1>
      <p>{formUploadContent}</p>
      <VaAlert
        close-btn-aria-label="Close notification"
        status="success"
        visible
      >
        <h2 slot="headline">You submitted your form</h2>
        <p className="vads-u-margin-y--0">
          Right now your form is pending processing. We’ll review your
          submission and contact you if we have any questions.
        </p>
      </VaAlert>
      <div className="inset">
        <h3 className="vads-u-margin-top--0">Your submission information</h3>
        <h4>Who submitted this form</h4>
        <p>
          {fullName.first} {fullName.last}
        </p>
        <h4>Confirmation number</h4>
        <p>{confirmationNumber}</p>
        <h4>Date submitted</h4>
        <p>{format(submittedAt, 'MMMM d, yyyy')}</p>

        <h4>Confirmation for your records</h4>
        <p>You can print this confirmation page for your records</p>
        <va-button
          className="usa-button vads-u-margin-top--0 screen-only"
          onClick={window.print}
          text="Print this page"
        />
      </div>
      <a className="vads-c-action-link--green vads-u-margin-y--2" href="/">
        Go back to VA.gov
      </a>
    </div>
  );
};

export default ConfirmationPage;

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
    <div className="row">
      <div className="usa-width-two-thirds medium-8 columns">
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
        <div className="action-bar-arrow vads-u-margin-bottom--4">
          <div className="vads-u-background-color--primary vads-u-padding--1">
            <a className="vads-c-action-link--white" href="/">
              Go back to VA.gov
            </a>
          </div>
        </div>
        <div className="need-help-footer">
          <h2 className="vads-u-padding-bottom--0p5 vads-u-font-size--h3 vads-u-border-bottom--2px vads-u-border-color--primary">
            Need help?
          </h2>
          <p>
            You can call us at <va-telephone contact="8772228387" /> (
            <va-telephone contact="8008778339" tty />
            ). We’re here Monday through Friday, 8:00 a.m to 9:00 p.m ET.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;

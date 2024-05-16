import React from 'react';

import {
  VaAlert,
  VaBreadcrumbs,
  VaProcessList,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useHistory, useLocation } from 'react-router-dom';
import {
  getBreadcrumbList,
  getFormNumber,
  getFormUploadContent,
  handleRouteChange,
} from '../helpers';

const ConfirmationPage = () => {
  const history = useHistory();
  const location = useLocation();
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
      <h2>What happens next</h2>
      <VaProcessList>
        <li>
          <h3>We review your submission</h3>
          <p>
            First someone reviews your form and routes it to the team who will
            process it.
          </p>
        </li>
        <li>
          <h3>Check the status of your submission</h3>
          <p>
            You can track the status while it’s being processed. If the status
            doesn’t change in the next [2 weeks], contact us.
          </p>
        </li>
        <li>
          <h3>We’ll process your statement</h3>
          <p>
            After we review your submission, we’ll process it and reach out to
            you if we need any additional information.
          </p>
        </li>
      </VaProcessList>
    </div>
  );
};

export default ConfirmationPage;

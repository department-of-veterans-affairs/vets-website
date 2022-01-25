import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import { CoeDocumentUpload } from './CoeDocumentUpload';
import { CoeDocumentList } from './CoeDocumentList';
import { MoreQuestions } from './MoreQuestions';
import moment from 'moment';

export const CoePending = props => (
  <div className="row vads-u-margin-bottom--7">
    <div className="medium-8 columns">
      <va-alert status="warning">
        <h2 slot="headline" className="vads-u-font-size--h3">
          We’re reviewing your request for a COE
        </h2>
        <p>
          You requested a COE on:{' '}
          {moment(props.applicationCreateDate).format('MMMM DD, YYYY')}
        </p>
        <p>
          If you qualify for a Certificate of Eligibility, we’ll notify you by
          email or mail to let you know how to get your COE.
        </p>
      </va-alert>
      {props.uploadsNeeded ? <CoeDocumentUpload /> : ''}
      <CoeDocumentList notOnUploadPage={props.notOnUploadPage} />
      <h2>Should I apply again?</h2>
      <p className="vads-u-margin-bottom--0">
        No. We’re reviewing your current application, and submitting a new
        application won’t affect our decision or speed-up the process.
      </p>
      <p>
        If more than 5 business days have passed since you submitted your
        application and you haven’t heard back, please don’t apply again. Call
        our toll-free number at <Telephone contact={'877-827-3702'} />.
      </p>
      <MoreQuestions />
    </div>
  </div>
);

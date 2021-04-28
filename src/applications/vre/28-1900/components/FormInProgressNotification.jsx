import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { VRE_ROOT_URL } from '../constants';

const FormInProgressNotification = () => (
  <div className="row vads-u-margin-bottom--1">
    <div className="usa-width-two-thirds medium-8 columns">
      <article>
        <FormTitle title="Veteran Readiness and Employment" />
        <p>
          Equal to VA Form 28-1900 (Vocational Rehabilitation for Claimants With
          Service-Connected Disabilities)
        </p>
        <AlertBox
          status="info"
          headline="We’re still working on this feature"
          content={
            <>
              <p>
                We’re rolling out the Veteran Readiness and Employment form in
                stages. It’s not quite ready yet. Please check back again soon.{' '}
              </p>
              <a
                href={VRE_ROOT_URL}
                className="u-vads-display--block u-vads-margin-top--2"
              >
                Return to Veteran Readiness and Employment page
              </a>
            </>
          }
        />
      </article>
    </div>
  </div>
);

export default FormInProgressNotification;

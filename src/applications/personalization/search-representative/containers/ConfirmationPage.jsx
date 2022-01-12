import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.schemaform-title > h1');
    scrollToTop('topScrollElement');
  }

  render() {
    return (
      <>
        <p>
          Appointment of Veterans Service Organization as Claimant's
          Representative (VA Form 21-22)
        </p>

        <va-alert status="info">
          <h2 slot="headline" className="vads-u-font-size--h3">
            Your partially completed form is ready
          </h2>
          <p>
            We have filled out VA Form 21-22 with the information you provided.
            Download then print your form so that both you and your
            representative can sign it.
          </p>
          <a
            className="vads-u-font-size--base vads-u-display--block vads-u-margin-top--2"
            href="#"
          >
            <i
              aria-hidden="true"
              className="fas fa-download vads-u-padding-right--1"
            />
            Download your VA Form 21-22
          </a>
        </va-alert>

        <h2>When can my representative begin helping me?</h2>

        <p className="vads-u-margin-bottom--3">
          Your representative can begin helping you only after we've received
          and processed your signed form. At that point, we've officially
          appointed your representative.
        </p>
      </>
    );
  }
}

export default ConfirmationPage;

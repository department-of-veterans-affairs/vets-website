import React from 'react';
import MockAuthButton from '../components/MockAuthButton';

export default function MockAuth() {
  return (
    <section className="login">
      <va-banner
        type="warning"
        headline="Only available for local and development environments"
        visible
      />
      <div className="container">
        <div className="container">
          <div className="row">
            <div className="columns small-12">
              <h1
                id="signin-signup-modal-title"
                className="vads-u-margin-top--2 vads-u-color--gray-dark medium-screen:vads-u-margin-top--1 medium-screen:vads-u-margin-bottom--2"
              >
                Mocked authentication
              </h1>
            </div>
          </div>
          <div className="row">
            <div className="columns small-12" id="sign-in-wrapper">
              <MockAuthButton />
            </div>
          </div>
          <div className="row">
            <div className="columns small-12">
              <div className="vads-u-padding-bottom--2p5 fed-warning--v2 vads-u-color--gray-dark">
                <p className="vads-u-font-size--base">
                  Use the instructions found in the vets-api-mockdata repository
                  to{' '}
                  <a href="https://github.com/department-of-veterans-affairs/vets-api-mockdata#mock-data">
                    create a mocked user
                  </a>
                  .
                </p>
                <p className="vads-u-font-size--base">
                  Read through our{' '}
                  <a href="https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/identity/Products/Mocked%20Authentication#readme">
                    documentation
                  </a>{' '}
                  to find more information on how to use Mocked Authentication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

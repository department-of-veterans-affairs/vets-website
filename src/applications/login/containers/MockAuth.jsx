import React from 'react';
import MockAuthButton from '../components/MockAuthButton';

export default function MockAuth() {
  return (
    <section className="login">
      <div className="container">
        <div className="container">
          <div className="row">
            <div className="columns small-12">
              <h1
                id="signin-signup-modal-title"
                className="vads-u-margin-top--2 vads-u-color--gray-dark medium-screen:vads-u-margin-top--1 medium-screen:vads-u-margin-bottom--2"
              >
                Mock Authentication
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
                  Mocked authentication is only available in the development and
                  localhost environments. Read more about{' '}
                  <a href="https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/identity/Mocked%20Authentication">
                    {' '}
                    mock authentication{' '}
                  </a>{' '}
                  and how to use it on GitHub.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

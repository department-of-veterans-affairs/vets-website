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
                Mocked Auth
              </h1>
            </div>
          </div>
          <div className="row">
            <div className="columns small-12" id="sign-in-wrapper">
              <MockAuthButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

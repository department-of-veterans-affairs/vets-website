import React from 'react';

const FlipperContent = props => {
  if (props.loggedIn === false) {
    return (
      <div className="va-sign-in-alert usa-alert usa-alert-continue">
        <div className="usa-alert-body">
          <p className="vads-u-font-family--serif vads-u-font-size--lg usa-alert-heading vads-u-font-weight--bold">
            Please sign in to view dependents added to your VA disability
            benefits
          </p>
          <p className="vads-u-margin-top--1p5">
            Try signing in with your <strong>DS Logon, My HealtheVet,</strong>
            or <strong>ID.me</strong> account. If you don’t have any of those
            accounts, you can create one.
          </p>
          <button
            onClick={props.toggleModal}
            className="usa-button-primary va-button-primary"
          >
            Sign in or create an account
          </button>
        </div>
      </div>
    );
  }
  return (
    <a
      href="/disability/view-dependents/"
      className="usa-button-primary va-button-primary"
    >
      View your dependents
    </a>
  );
};
export default FlipperContent;

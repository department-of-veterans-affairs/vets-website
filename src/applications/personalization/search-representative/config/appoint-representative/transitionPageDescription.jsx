import React from 'react';
import { connect } from 'react-redux';

const TransitionPageDescription = props => {
  return (
    <>
      <va-alert status="warning">
        <h3 slot="headline">You aren’t finished yet</h3>
        <div>
          <p>
            Your representation is not official until the completed form has
            been signed by both you and your selected representative and has
            been proccessed by the VA.{' '}
          </p>
        </div>
      </va-alert>
      <p className="vads-u-padding-top--4 vads-u-padding-bottom--4">
        After you have contacted the accredited representative you want to use
        to find out if they’re available, continue this form to create a
        pre-filled PDF Form to submit.
      </p>
      <div className="vads-u-margin-top--4 vads-u-background-color--gray-lightest vads-u-padding--4">
        <p className="vads-u-margin-top--0 vads-u-font-size--h3 vads-u-font-family--serif vads-u-font-weight--bold">
          {props?.formData?.representativeData?.name}
        </p>
        <p className="vads-u-font-weight--bold">
          {props?.formData?.representativeData?.type}
        </p>
        <p>{props?.formData?.representativeData?.address}</p>
        <p>{props?.formData?.representativeData?.city}</p>
        <p className="vads-u-margin-bottom--0">
          {props?.formData?.representativeData?.phone}
        </p>
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    formData: state.form.data,
  };
}

export default connect(
  mapStateToProps,
  {},
)(TransitionPageDescription);

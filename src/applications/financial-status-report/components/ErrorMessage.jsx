import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

const ErrorMessage = ({ errorCode }) => {
  return (
    errorCode === 'FSR_SERVER_ERROR' && (
      <div className="row vads-u-margin-bottom--3">
        <AlertBox
          status="error"
          headline="We're sorry. Something went wrong on our end."
        >
          <div>
            <p>
              You can't submit a Financial Status Report (5655) because
              something went wrong on our end.
            </p>
          </div>
        </AlertBox>
      </div>
    )
  );
};

const mapStateToProps = state => ({
  errorCode: state.fsr.errorCode,
});
export default connect(mapStateToProps)(ErrorMessage);

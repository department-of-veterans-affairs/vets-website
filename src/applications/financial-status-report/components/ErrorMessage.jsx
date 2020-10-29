import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

const ErrorMessage = ({ errorCode }) => {
  let content;

  if (errorCode === 'FSR_SERVER_ERROR') {
    content = (
      <AlertBox
        status="error"
        headline="We're sorry. Something went wrong on our end."
      >
        <div>
          <p>
            You can't submit a Financial Status Report (5655) because something
            went wrong on our end.
          </p>
        </div>
      </AlertBox>
    );
  }

  return content;
};

const mapStateToProps = state => ({
  errorCode: state.fsr.errorCode,
});
export default connect(mapStateToProps)(ErrorMessage);

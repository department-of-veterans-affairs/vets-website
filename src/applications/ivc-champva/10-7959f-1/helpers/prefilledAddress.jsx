import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const PrefilledAddress = props => {
  const { isLoggedIn } = props;
  return isLoggedIn ? (
    <div>
      <VaAlert>
        <p>
          We’ve prefilled some of your information from your account. If you
          need to correct anything, you can edit the form fields below.
        </p>
      </VaAlert>
    </div>
  ) : (
    <div />
  );
};

PrefilledAddress.propTypes = {
  isLoggedIn: PropTypes.bool,
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.user.login.currentlyLoggedIn,
  };
};

export default connect(mapStateToProps)(PrefilledAddress);

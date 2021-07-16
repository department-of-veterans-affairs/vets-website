import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import BackToHome from '../components/BackToHome';
// import Footer from '../components/Footer';
import { focusElement } from 'platform/utilities/ui';

const Error = () => {
  useEffect(() => {
    focusElement('h1');
  }, []);
  return (
    <div className="vads-l-grid-container vads-u-padding-y--5 ">
      <va-alert status="error">
        <h1 tabIndex="-1" slot="headline">
          We couldn't check you in
        </h1>
        <p>
          We're sorry. Something went wrong on our end. Check in with a staff
          member or call us at [clinic/facility phone number].
        </p>
      </va-alert>
      {/* <Footer header={'Not sure where to wait?'} /> */}
      <BackToHome />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    appointment: state.checkInData?.appointment,
  };
};
const mapDispatchToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Error);

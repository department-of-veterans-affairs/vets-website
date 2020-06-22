import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { VeteranInformationViewComponent } from '../components/VeteranInformationViewComponent';

const VeteranInformation = ({ user }) => {
  const [veteran, setVeteran] = useState({});
  useEffect(
    () => {
      setVeteran(user);
    },
    [user],
  );
  return (
    <>
      {user?.verified &&
        user?.status === 'OK' && <VeteranInformationViewComponent {...user} />}
    </>
  );
};

const mapStateToProps = state => ({
  user: state.user.profile,
});

export default connect(mapStateToProps)(VeteranInformation);

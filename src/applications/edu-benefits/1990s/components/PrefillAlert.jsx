import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import { connect } from 'react-redux';

const PrefillAlert = ({ user, formContext }) => {
  return formContext.prefilled && user.userFullName.first !== null ? (
    <AlertBox
      status="info"
      content="This is the personal information we have on file for you."
    />
  ) : null;
};

const mapStateToProps = state => ({
  user: state.user.profile,
});

export default connect(mapStateToProps)(PrefillAlert);

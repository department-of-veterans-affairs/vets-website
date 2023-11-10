import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { connect } from 'react-redux';

const PrefillAlert = ({ user, formContext }) => {
  return formContext.prefilled && user.userFullName.first !== null ? (
    <VaAlert status="info" visible>
      This is the personal information we have on file for you.
    </VaAlert>
  ) : null;
};

const mapStateToProps = state => ({
  user: state.user.profile,
});

export default connect(mapStateToProps)(PrefillAlert);

import React from 'react';
import { connect } from 'react-redux';
import PhoneField from './PhoneField';
import ReceiveTextMessages from '../containers/ReceiveTextMessages';
import { FIELD_NAMES } from '../constants';
import { profileShowNotifications } from '../selectors';

class MobilePhone extends React.Component {
  render() {
    return (
      <>
        <PhoneField
          title="Mobile phone number"
          fieldName={FIELD_NAMES.MOBILE_PHONE}
        />
        {this.props.showNotifications && (
          <ReceiveTextMessages
            title="Mobile phone number"
            fieldName={FIELD_NAMES.MOBILE_PHONE}
          />
        )}
      </>
    );
  }
}

export function mapStateToProps(state) {
  return {
    showNotifications: profileShowNotifications(state),
  };
}

export default connect(
  mapStateToProps,
  null,
)(MobilePhone);

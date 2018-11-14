import React from 'react';
import PropTypes from 'prop-types';

import { API_ROUTES, FIELD_NAMES } from '../../constants';

import { isValidEmail } from '../../../../../../platform/forms/validations';

import Vet360ProfileField from '../../containers/ProfileField';
import EmailEditModal from './EditModal';

import EmailView from './View';

export default class EmailField extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    fieldName: PropTypes.oneOf([FIELD_NAMES.EMAIL]).isRequired,
  };

  convertNextValueToCleanData(value) {
    const { id, emailAddress } = value;

    return {
      id,
      emailAddress,
    };
  }

  validateCleanData({ emailAddress: email }) {
    return {
      emailAddress:
        email && isValidEmail(email)
          ? ''
          : 'Please enter your email address again, following a standard format like name@domain.com.',
    };
  }

  render() {
    return (
      <Vet360ProfileField
        title={this.props.title}
        fieldName={this.props.fieldName}
        apiRoute={API_ROUTES.EMAILS}
        convertNextValueToCleanData={this.convertNextValueToCleanData}
        validateCleanData={this.validateCleanData}
        Content={EmailView}
        EditModal={EmailEditModal}
      />
    );
  }
}

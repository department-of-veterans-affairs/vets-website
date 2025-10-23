import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { maskBankInformation, hasNewBankInformation } from '../utils';

export class PaymentReviewView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: props.formData,
      name: props.name,
    };
  }

  render() {
    const { formData, name } = this.state;
    let value = formData;
    if (formData === undefined) {
      if (
        !hasNewBankInformation(
          _.get(this.props.data, 'view:bankAccount.bankAccount', {}),
        )
      ) {
        // Use prefill data
        const propName = `bank${name
          .substring(0, 1)
          .toUpperCase()}${name.substring(1)}`;
        const prefillBankAccount = _.get(
          this.props.data,
          'prefillBankAccount',
          {},
        );
        value = _.get(prefillBankAccount, propName, '');
      }
    } else if (name === 'accountNumber' || name === 'routingNumber') {
      value = maskBankInformation(value, 4);
    } else if (name === 'accountType' && value.length > 0) {
      value = value.charAt(0).toUpperCase() + value.substr(1);
    }
    return <span>{value}</span>;
  }
}

const mapStateToProps = store => ({
  data: store.form.data,
});

export default connect(mapStateToProps)(PaymentReviewView);

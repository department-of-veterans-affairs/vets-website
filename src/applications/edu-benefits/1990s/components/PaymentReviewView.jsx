import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import mask from 'platform/forms-system/src/js/utilities/ui/mask-string';

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
      const bankAccount = _.get(
        this.props.data,
        'view:directDeposit.bankAccount',
        {},
      );
      value = _.get(bankAccount, name, '');
    } else if (name === 'accountNumber' || name === 'routingNumber') {
      value = mask(value, 4);
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

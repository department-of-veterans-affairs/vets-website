import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

class PaymentReviewView extends React.Component {
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
    return <span>{value}</span>;
  }
}

const mapStateToProps = store => ({
  data: store.form.data,
});

export default connect(mapStateToProps)(PaymentReviewView);

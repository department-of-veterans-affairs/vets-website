import React from 'react';

import { getLabel } from '../../utils/helpers';
import { accountTypes } from '../../utils/options-for-select';

export default class DirectDepositReview extends React.Component {
  render() {
    return (
      <table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Account type:</td>
            <td>{getLabel(accountTypes, this.props.data.bankAccount.accountType.value)}</td>
          </tr>
          <tr>
            <td>Account number:</td>
            <td>{this.props.data.bankAccount.accountNumber.value}</td>
          </tr>
          <tr>
            <td>Routing number:</td>
            <td>{this.props.data.bankAccount.routingNumber.value}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

DirectDepositReview.propTypes = {
  data: React.PropTypes.object.isRequired
};

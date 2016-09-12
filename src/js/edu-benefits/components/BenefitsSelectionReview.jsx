import React from 'react';

import { getLabel } from '../utils/helpers';
import { relinquishableBenefits } from '../utils/options-for-select';

export default class BenefitsSelectionReview extends React.Component {
  render() {
    return (
      <table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Chapter 33 - Post-9/11 GI Bill:</td>
            <td>{this.props.data.chapter33 ? 'Yes' : 'No'}</td>
          </tr>
        </tbody>
        {this.props.data.chapter33
          ? <tbody>
            <tr>
              <td>I elect to receive Chapter 33 education benefits in lieu of the education benefit(s) I am relinquishing below:</td>
              <td>{getLabel(relinquishableBenefits, this.props.data.benefitsRelinquished.value)}</td>
            </tr>
          </tbody>
          : null}
        <tbody>
          <tr>
            <td>Chapter 30 - Montgomery GI Bill Educational Assistance Program:</td>
            <td>{this.props.data.chapter30 ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td>Chapter 1606 - Montgomery GI Bill - Selected Reserve Educational Assistance Program:</td>
            <td>{this.props.data.chapter1606 ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td>Chapter 32 / Section 903 - Post-Vietnam Era Veterans' Educational Assistance Program:</td>
            <td>{this.props.data.chapter32 ? 'Yes' : 'No'}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

BenefitsSelectionReview.propTypes = {
  data: React.PropTypes.object.isRequired
};

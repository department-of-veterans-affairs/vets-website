import React from 'react';

import { getLabel, displayDateIfValid, showRelinquishedEffectiveDate } from '../../utils/helpers';
import { relinquishableBenefits } from '../../utils/options-for-select';

export default class BenefitsSelectionReview extends React.Component {
  render() {
    return (
      <table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Post-9/11 GI Bill (Chapter 33)</td>
            <td>{this.props.data.chapter33 ? 'Yes' : 'No'}</td>
          </tr>
        </tbody>
        {this.props.data.chapter33
          ? <tbody>
            <tr>
              <td>I elect to receive Chapter 33 education benefits in lieu of the education benefit(s) I am giving up below:</td>
              <td>{getLabel(relinquishableBenefits, this.props.data.benefitsRelinquished.value)}</td>
            </tr>
            {showRelinquishedEffectiveDate(this.props.data.benefitsRelinquished.value)
              ? <tr>
                <td>Effective date:</td>
                <td>{displayDateIfValid(this.props.data.benefitsRelinquishedDate)}</td>
              </tr>
              : null}
          </tbody>
          : null}
        <tbody>
          <tr>
            <td>Montgomery GI Bill (MGIB or Chapter 30) Education Assistance Program:</td>
            <td>{this.props.data.chapter30 ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td>Montgomery GI Bill Selected Reserve (MGIB-SR or Chapter 1606) Educational Assistance Program</td>
            <td>{this.props.data.chapter1606 ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td>Post-Vietnam Era Veterans' Educational Assistance Program (VEAP or chapter 32)</td>
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

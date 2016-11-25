import React from 'react';

import { getLabel, displayDateIfValid, showRelinquishedEffectiveDate } from '../../utils/helpers';
import { relinquishableBenefits } from '../../utils/options-for-select';

export default class BenefitsRelinquishmentReview extends React.Component {
  render() {
    return (
      <table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>I choose to get Chapter 33 education benefits instead of the education benefit(s) listed here:</td>
            <td>{getLabel(relinquishableBenefits, this.props.data.benefitsRelinquished.value)}</td>
          </tr>
          {showRelinquishedEffectiveDate(this.props.data.benefitsRelinquished.value)
            ? <tr>
              <td>Effective date:</td>
              <td>{displayDateIfValid(this.props.data.benefitsRelinquishedDate)}</td>
            </tr>
            : null}
        </tbody>
      </table>
    );
  }
}

BenefitsRelinquishmentReview.propTypes = {
  data: React.PropTypes.object.isRequired
};

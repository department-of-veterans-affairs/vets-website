import React from 'react';

import { getLabel, displayDateIfValid, showRelinquishedEffectiveDate } from '../../utils/helpers';
import { relinquishableBenefits } from '../../utils/options-for-select';

export default class BenefitsSelectionReview extends React.Component {
  render() {
    return (
      <table className="review usa-table-borderless">
        <tbody>
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
      </table>
    );
  }
}

BenefitsSelectionReview.propTypes = {
  data: React.PropTypes.object.isRequired
};

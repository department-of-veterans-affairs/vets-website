import React from 'react';

import { getListOfBenefits } from '../../utils/helpers';

export default class BenefitsSelectionReview extends React.Component {
  render() {
    return (
      <table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Benefits selection:</td>
            <td>{getListOfBenefits(this.props.data).map((benefit, index) => <span key={index}>{index === 0 ? null : <br/>}{benefit}</span>)}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

BenefitsSelectionReview.propTypes = {
  data: React.PropTypes.object.isRequired
};

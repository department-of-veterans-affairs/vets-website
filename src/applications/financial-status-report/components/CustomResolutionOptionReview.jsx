import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { fsrReasonDisplay, getDebtName } from '../utils/helpers';

const CustomResolutionOptionReview = props => {
  const { data, pagePerItemIndex } = props;
  const { selectedDebtsAndCopays = [] } = data;
  const [debtIndex] = useState(pagePerItemIndex);
  const [currentDebt] = useState(selectedDebtsAndCopays[debtIndex || 0]);

  return (
    <div>
      <div className="form-review-panel-page-header-row">
        <h4 className="vads-u-font-size--h5">{getDebtName(currentDebt)} </h4>
      </div>
      <dt>
        Resolution Option: {fsrReasonDisplay(currentDebt.resolutionOption)}{' '}
        <br />{' '}
      </dt>
      <dd>
        {currentDebt.resolutionOption === 'waiver'
          ? ''
          : `Amount: $${currentDebt.resolutionComment}`}
      </dd>
      <br />
    </div>
  );
};

CustomResolutionOptionReview.propTypes = {
  selectedDebtsAndCopays: PropTypes.array,
};

export default CustomResolutionOptionReview;

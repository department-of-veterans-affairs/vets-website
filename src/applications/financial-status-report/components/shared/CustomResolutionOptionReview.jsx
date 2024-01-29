import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { currency } from '../../utils/helpers';
import { deductionCodes } from '../../constants/deduction-codes';
import { RESOLUTION_OPTION_TYPES, DEBT_TYPES } from '../../constants';

const CustomResolutionOptionReview = props => {
  const formData = useSelector(state => state.form.data);
  const { selectedDebtsAndCopays = [] } = formData;

  const currentDebt = selectedDebtsAndCopays[props.pagePerItemIndex];

  const getDebtTitle = debt => {
    if (debt.debtType === DEBT_TYPES.COPAY) {
      return `${currency(debt?.pHAmtDue)} for ${debt.station.facilityName}`;
    }
    if (debt.debtType === DEBT_TYPES.DEBT) {
      return `${currency(debt.currentAr)} overpayment for ${deductionCodes[
        debt.deductionCode
      ] || debt.benefitType}`;
    }
    return 'Debt';
  };

  const getReliefOption = debt => {
    if (debt.resolutionOption === RESOLUTION_OPTION_TYPES.MONTHLY) {
      return 'Extended monthly payments';
    }
    if (debt.resolutionOption === RESOLUTION_OPTION_TYPES.COMPROMISE) {
      return 'Compromise';
    }
    if (debt.resolutionOption === RESOLUTION_OPTION_TYPES.WAIVER) {
      return 'Waiver';
    }
    return 'Other';
  };

  const getReliefOptionValue = debt => {
    if (
      debt.resolutionOption === RESOLUTION_OPTION_TYPES.MONTHLY ||
      debt.resolutionOption === RESOLUTION_OPTION_TYPES.COMPROMISE
    ) {
      return `${currency(debt.resolutionComment)}`;
    }
    if (debt.resolutionOption === RESOLUTION_OPTION_TYPES.WAIVER) {
      return `${debt.resolutionWaiverCheck ? 'Yes' : 'No'}`;
    }
    return 'Other';
  };

  const getReliefOptionValueDescription = debt => {
    if (debt.resolutionOption === RESOLUTION_OPTION_TYPES.MONTHLY) {
      return 'Monthly payment amount';
    }
    if (debt.resolutionOption === RESOLUTION_OPTION_TYPES.COMPROMISE) {
      return 'One-time payment amount';
    }
    if (debt.resolutionOption === RESOLUTION_OPTION_TYPES.WAIVER) {
      return 'Confirm agree to waiver';
    }
    return 'Other';
  };

  return (
    <div>
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {getDebtTitle(currentDebt)}
        </h4>
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>Relief option</dt>
          <dd>
            <strong>{getReliefOption(currentDebt)}</strong>
          </dd>
        </div>
        <div className="review-row">
          <dt>{getReliefOptionValueDescription(currentDebt)}</dt>
          <dd>
            <strong>{getReliefOptionValue(currentDebt)}</strong>
          </dd>
        </div>
      </dl>

      <br />
    </div>
  );
};

CustomResolutionOptionReview.propTypes = {
  children: PropTypes.object,
  data: PropTypes.object,
  pagePerItemIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CustomResolutionOptionReview;

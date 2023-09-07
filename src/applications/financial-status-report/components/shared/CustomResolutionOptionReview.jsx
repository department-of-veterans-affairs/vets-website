import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { fsrReasonDisplay, getDebtName } from '../../utils/helpers';

const CustomResolutionOptionReview = ({ children }) => {
  const formData = useSelector(state => state.form.data);
  const { selectedDebtsAndCopays = [] } = formData;
  const { formContext } = children.props;
  const currentDebt =
    selectedDebtsAndCopays[formContext?.pagePerItemIndex || 0];

  return (
    <div className="review-row">
      <dt>{getDebtName(currentDebt)}</dt>
      <dd>{fsrReasonDisplay(currentDebt.resolutionOption)}</dd>
    </div>
  );
};

CustomResolutionOptionReview.propTypes = {
  children: PropTypes.object,
};

export default CustomResolutionOptionReview;

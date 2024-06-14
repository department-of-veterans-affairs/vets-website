import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getDebtName, currency } from '../../utils/helpers';

const CustomResolutionReview = ({ children }) => {
  const formData = useSelector(state => state.form.data);
  const { selectedDebtsAndCopays = [] } = formData;
  const { formContext } = children.props;
  const currentDebt =
    selectedDebtsAndCopays[formContext?.pagePerItemIndex || 0];
  const compromiseAmount = currentDebt?.resolutionComment || 0;

  return (
    <div className="review-row">
      <dt>
        Resolution amount for <strong>{getDebtName(currentDebt)}</strong>
      </dt>
      <dd>{currency(compromiseAmount)}</dd>
    </div>
  );
};

CustomResolutionReview.propTypes = {
  children: PropTypes.object,
};

export default CustomResolutionReview;

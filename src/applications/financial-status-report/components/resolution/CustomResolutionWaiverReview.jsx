import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getDebtName } from '../../utils/helpers';

const CustomResolutionWaiverReview = ({ children }) => {
  const formData = useSelector(state => state.form.data);
  const { selectedDebtsAndCopays = [] } = formData;
  const { formContext } = children.props;
  const currentDebt =
    selectedDebtsAndCopays[formContext?.pagePerItemIndex || 0];

  return (
    <div className="review-row">
      <dt>
        Agreed to resolution waiver for{' '}
        <strong>{getDebtName(currentDebt)}</strong>?
      </dt>
      <dd>
        <p className="vads-u-margin-y--0 vads-u-margin-x--1">
          {currentDebt.resolutionWaiverCheck ? 'Yes' : 'No'}
        </p>
      </dd>
    </div>
  );
};

CustomResolutionWaiverReview.propTypes = {
  children: PropTypes.object,
};

export default CustomResolutionWaiverReview;

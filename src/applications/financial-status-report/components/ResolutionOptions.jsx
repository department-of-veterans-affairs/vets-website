import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';

const ResolutionOptions = ({ formContext }) => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);

  const { selectedDebtsAndCopays = [] } = formData;
  const currentDebt = selectedDebtsAndCopays[formContext.pagePerItemIndex];

  const onChange = ({ target }) => {
    const newlySelectedDebtsAndCopays = selectedDebtsAndCopays.map(debt => {
      if (debt.id === currentDebt.id) {
        return { ...debt, resolutionOption: target.value };
      }
      return debt;
    });

    return dispatch(
      setData({
        ...formData,
        selectedDebtsAndCopays: newlySelectedDebtsAndCopays,
      }),
    );
  };

  return (
    <div>
      <div>
        <input
          type="radio"
          checked={currentDebt.resolutionOption === 'waiver'}
          name="resolution-option-waiver"
          id="radio-waiver"
          value="waiver"
          className="vads-u-width--auto"
          onChange={onChange}
        />
        <label htmlFor="radio-waiver" className="vads-u-margin--0">
          <span className="vads-u-display--block vads-u-font-weight--bold vads-u-margin-left--3 vads-u-margin-top--neg2p5">
            Debt forgiveness (waiver)
          </span>
          <span className="vads-u-display--block vads-u-font-size--sm vads-u-margin-left--3">
            If we accept your request, we will stop collection on and forgive
            (or "waive") the debt.
          </span>
        </label>
      </div>
      {currentDebt.debtType === 'COPAY' ? (
        ''
      ) : (
        <div>
          <input
            type="radio"
            checked={currentDebt.resolutionOption === 'monthly'}
            name="resolution-option-monthly"
            id="radio-monthly"
            value="monthly"
            className="vads-u-width--auto"
            onChange={onChange}
          />
          <label htmlFor="radio-monthly">
            <span className="vads-u-display--block vads-u-font-weight--bold vads-u-margin-left--3 vads-u-margin-top--neg2p5">
              Extended monthly payments
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm vads-u-margin-left--3">
              If we accept your request, you can make smaller monthly payments
              for up to 5 years with either monthly offsets or a monthly payment
              plan.
            </span>
          </label>
        </div>
      )}
      <div>
        <input
          type="radio"
          checked={currentDebt.resolutionOption === 'compromise'}
          name="resolution-option-compromise"
          id="radio-compromise"
          value="compromise"
          className="vads-u-width--auto"
          onChange={onChange}
        />
        <label htmlFor="radio-compromise">
          <span className="vads-u-display--block vads-u-font-weight--bold vads-u-margin-left--3 vads-u-margin-top--neg2p5">
            Compromise
          </span>
          <span className="vads-u-display--block vads-u-font-size--sm vads-u-margin-left--3">
            If you’re unable to pay the debt in full or make smaller monthly
            payments, we can consider a smaller, one-time payment to resolve
            your debt.
          </span>
        </label>
      </div>
    </div>
  );
};

ResolutionOptions.propTypes = {
  formContext: PropTypes.shape({
    pagePerItemIndex: PropTypes.string.isRequired,
  }),
};

export default ResolutionOptions;

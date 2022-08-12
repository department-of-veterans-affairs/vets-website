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
    return dispatch(
      setData({
        ...formData,
        selectedDebtsAndCopays: [
          ...selectedDebtsAndCopays.slice(0, formContext.pagePerItemIndex),
          {
            ...currentDebt,
            resolutionOption: target.value,
          },
          ...selectedDebtsAndCopays.slice(formContext.pagePerItemIndex + 1),
        ],
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
          onChange={onChange}
        />
        <label htmlFor="radio-waiver">
          <span className="vads-u-display--block vads-u-font-weight--bold">
            Debt forgiveness (waiver)
          </span>
          <span className="vads-u-display--block vads-u-font-size--sm">
            If we accept your request, we will stop collection on and forgive
            (or "waive") the debt.
          </span>
        </label>
        <input
          type="radio"
          checked={currentDebt.resolutionOption === 'monthly'}
          name="resolution-option-monthly"
          id="radio-monthly"
          value="monthly"
          onChange={onChange}
        />
        <label htmlFor="radio-monthly">
          <span className="vads-u-display--block vads-u-font-weight--bold">
            Extended monthly payments
          </span>
          <span className="vads-u-display--block vads-u-font-size--sm">
            If we accept your request, you can make smaller monthly payments for
            up to 5 years with either monthly offsets or a monthly payment plan.
          </span>
        </label>
        <input
          type="radio"
          checked={currentDebt.resolutionOption === 'compromise'}
          name="resolution-option-compromise"
          id="radio-compromise"
          value="compromise"
          onChange={onChange}
        />
        <label htmlFor="radio-compromise">
          <span className="vads-u-display--block vads-u-font-weight--bold">
            Compromise
          </span>
          <span className="vads-u-display--block vads-u-font-size--sm">
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

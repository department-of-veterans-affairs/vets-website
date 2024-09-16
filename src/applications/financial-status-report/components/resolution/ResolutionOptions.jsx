import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { RESOLUTION_OPTION_TYPES } from '../../constants';

const ResolutionOptions = ({ formContext }) => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);
  const isEditing = formContext.onReviewPage ? !formContext.reviewMode : true;

  const { selectedDebtsAndCopays = [] } = formData;
  const currentDebt = selectedDebtsAndCopays[formContext.pagePerItemIndex];

  const onResolutionChange = ({ target }) => {
    const newlySelectedDebtsAndCopays = selectedDebtsAndCopays.map(debt => {
      if (debt.id === currentDebt.id) {
        return {
          ...debt,
          resolutionOption: target.value,
          resolutionWaiverCheck: false,
          resolutionComment: '',
        };
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

  const waiverText = `If we approve your request, we’ll stop collection and waive the debt.`;
  const monthlyText = `If you can’t pay the debt in full or make smaller monthly payments, we can consider a smaller, one-time payment to resolve your debt.`;
  const compromiseText = `If we approve your request, you can make smaller monthly payments for up to 5 years with either monthly offsets or a monthly payment plan.`;

  const renderResolutionSelectionText = () => {
    switch (currentDebt.resolutionOption) {
      case RESOLUTION_OPTION_TYPES.WAIVER:
        return waiverText;
      case RESOLUTION_OPTION_TYPES.MONTHLY:
        return monthlyText;
      case RESOLUTION_OPTION_TYPES.COMPROMISE:
        return compromiseText;
      default:
        return <></>;
    }
  };

  // Error message handling
  const resolutionError =
    formContext.submitted && !currentDebt.resolutionOption;
  const resolutionErrorMessage = 'Please select a resolution option';

  const label = 'Select relief option: ';
  const options = [
    {
      value: 'waiver',
      label: waiverText,
    },
    {
      value: 'monthly',
      label: monthlyText,
    },
    {
      value: 'compromise',
      label: compromiseText,
    },
  ];

  return (
    <div
      className={
        resolutionError
          ? 'error-line vads-u-margin-y--3 vads-u-padding-left--1 vads-u-margin-left--neg1p5'
          : 'vads-u-margin-left--2 vads-u-margin-top--4'
      }
    >
      {resolutionError && (
        <span
          className="vads-u-font-weight--bold vads-u-color--secondary-dark"
          role="alert"
        >
          <span className="sr-only">Error</span>
          <p>{resolutionErrorMessage}</p>
        </span>
      )}
      {!isEditing && <>{renderResolutionSelectionText()}</>}
      {isEditing && (
        <div>
          <VaRadio
            className="vads-u-margin-y--2 "
            label={label}
            onVaValueChange={onResolutionChange}
          >
            {options.map((option, index) => (
              <VaRadioOption
                key={`${option.value}-${index}`}
                id={`resolution-option-${index}`}
                name="resolution-option"
                label={option.label}
                value={option.value}
                checked={currentDebt.resolutionOption === option.value}
                ariaDescribedby={
                  currentDebt.resolutionOption === option.value
                    ? option.value
                    : null
                }
                className="no-wrap vads-u-margin-y--3 vads-u-margin-left--2 "
              />
            ))}
          </VaRadio>
        </div>
      )}
    </div>
  );
};

export default ResolutionOptions;

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { RESOLUTION_OPTION_TYPES, DEBT_TYPES } from '../../constants';
import { setFocus, isNullOrUndefinedOrEmpty } from '../../utils/fileValidation';

const ResolutionOptions = ({ formContext }) => {
  const dispatch = useDispatch();
  const [selectionError, setSelectionError] = useState(null);
  const formData = useSelector(state => state.form.data);
  const isEditing = formContext.onReviewPage ? !formContext.reviewMode : true;

  const { selectedDebtsAndCopays = [] } = formData;
  const currentDebt = selectedDebtsAndCopays[formContext.pagePerItemIndex];

  const [isResolutionOptionSelected, setIsResolutionOptionSelected] = useState(
    !isNullOrUndefinedOrEmpty(currentDebt.resolutionOption),
  );

  useEffect(
    () => {
      if (formContext.submitted && !isResolutionOptionSelected) {
        setSelectionError('Please select a resolution option for this debt');
        setFocus('VaRadio');
      } else {
        setSelectionError(null);
      }
    },
    [formContext.submitted, isResolutionOptionSelected],
  );

  const onResolutionChange = target => {
    const newlySelectedDebtsAndCopays = selectedDebtsAndCopays.map(debt => {
      if (debt.id === currentDebt.id) {
        setIsResolutionOptionSelected(true);
        return {
          ...debt,
          resolutionOption: target.detail.value,
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
  const monthlyText = `If we approve your request, you can make smaller monthly payments for up to 5 years with either monthly offsets or a monthly payment plan.`;
  const compromiseText = `If you can’t pay the debt in full or make smaller monthly payments, we can consider a smaller, one-time payment to resolve your debt.`;

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

  const label = 'Select relief option: ';
  const debtOptions = [
    {
      value: 'waiver',
      label: 'Waiver',
      description: waiverText,
    },
    {
      value: 'monthly',
      label: 'Extended monthly payments',
      description: monthlyText,
    },
    {
      value: 'compromise',
      label: 'Compromise',
      description: compromiseText,
    },
  ];

  const copayOptions = [
    {
      value: 'waiver',
      label: 'Waiver',
      description: waiverText,
    },
    {
      value: 'compromise',
      label: 'Compromise',
      description: compromiseText,
    },
  ];

  return (
    <div>
      {!isEditing && <>{renderResolutionSelectionText()}</>}
      {isEditing && (
        <VaRadio
          className="vads-u-margin-y-top--2 resolution-option-radio"
          label={label}
          onVaValueChange={onResolutionChange}
          error={selectionError}
          required
        >
          {currentDebt.debtType !== DEBT_TYPES.COPAY &&
            debtOptions.map((option, index) => (
              <VaRadioOption
                key={`${option.value}-${index}`}
                id={`resolution-option-${index}`}
                description={option.description}
                name="resolution-option"
                label={option.label}
                value={option.value}
                checked={currentDebt.resolutionOption === option.value}
                ariaDescribedby={
                  currentDebt.resolutionOption === option.value
                    ? option.value
                    : null
                }
              />
            ))}
          {currentDebt.debtType === DEBT_TYPES.COPAY &&
            copayOptions.map((option, index) => (
              <VaRadioOption
                key={`${option.value}-${index}`}
                id={`resolution-option-${index}`}
                description={option.description}
                name="resolution-option"
                label={option.label}
                value={option.value}
                checked={currentDebt.resolutionOption === option.value}
                ariaDescribedby={
                  currentDebt.resolutionOption === option.value
                    ? option.value
                    : null
                }
              />
            ))}
        </VaRadio>
      )}
    </div>
  );
};

ResolutionOptions.propTypes = {
  formContext: PropTypes.object,
  option: PropTypes.object,
  label: PropTypes.string,
  formData: PropTypes.object,
  currentDebt: PropTypes.object,
};

export default ResolutionOptions;

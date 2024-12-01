import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { RESOLUTION_OPTION_TYPES } from '../../constants';
import { setFocus } from '../../utils/fileValidation';

const ResolutionWaiverAgreement = ({ formContext }) => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);

  const { selectedDebtsAndCopays = [] } = formData;
  const [selectionError, setSelectionError] = useState(null);
  const currentDebt =
    selectedDebtsAndCopays[formContext?.pagePerItemIndex || 0];

  const [isWaiverChecked, setIsWaiverChecked] = useState(
    currentDebt.resolutionOption === RESOLUTION_OPTION_TYPES.WAIVER &&
      currentDebt.resolutionWaiverCheck === true,
  );

  useEffect(
    () => {
      if (formContext.submitted && !isWaiverChecked) {
        setSelectionError('Please check the box below to continue');
        setFocus('va-checkbox');
      } else {
        setSelectionError(null);
      }
    },
    [formContext.submitted, isWaiverChecked],
  );

  const onWaiverChecked = () => {
    const newlySelectedDebtsAndCopays = selectedDebtsAndCopays.map(debt => {
      if (debt.id === currentDebt.id) {
        return {
          ...debt,
          resolutionWaiverCheck: !isWaiverChecked,
        };
      }
      return debt;
    });
    setIsWaiverChecked(!isWaiverChecked);

    return dispatch(
      setData({
        ...formData,
        selectedDebtsAndCopays: newlySelectedDebtsAndCopays,
      }),
    );
  };

  const checkboxLabel =
    currentDebt.debtType === 'COPAY'
      ? `By checking this box, I understand that I’m requesting forgiveness for my copay debt.`
      : `By checking this box, I’m agreeing that I understand that waiving
      education debt will reduce any remaining education benefit I may
      have.`;

  return (
    <>
      <p>
        You selected: <span className="vads-u-font-weight--bold">Waiver</span>
      </p>
      <p className="vads-u-margin-top--2">
        If we approve your request, we’ll stop collection on and waive the debt.
      </p>
      <VaCheckbox
        checked={isWaiverChecked}
        description={null}
        error={selectionError}
        hint={null}
        label={checkboxLabel}
        onVaChange={onWaiverChecked}
        required
      />
    </>
  );
};

// pagePerItemIndex is string in form, and populates as number in review page edit mode
ResolutionWaiverAgreement.propTypes = {
  formContext: PropTypes.shape({
    pagePerItemIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    submitted: PropTypes.bool,
  }),
};

export default ResolutionWaiverAgreement;

import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';

import { RESOLUTION_OPTION_TYPES } from '../../constants';

const ResolutionWaiverAgreement = ({ formContext }) => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);

  const { selectedDebtsAndCopays = [] } = formData;
  const currentDebt =
    selectedDebtsAndCopays[formContext?.pagePerItemIndex || 0];

  const isWaiverChecked =
    currentDebt.resolutionOption === RESOLUTION_OPTION_TYPES.WAIVER &&
    currentDebt.resolutionWaiverCheck === true;

  const onWaiverChecked = () => {
    const newlySelectedDebtsAndCopays = selectedDebtsAndCopays.map(debt => {
      if (debt.id === currentDebt.id) {
        return {
          ...debt,
          resolutionWaiverCheck: !currentDebt.resolutionWaiverCheck,
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

  const checkboxError =
    formContext.submitted &&
    currentDebt.resolutionOption === RESOLUTION_OPTION_TYPES.WAIVER &&
    !currentDebt.resolutionWaiverCheck;

  const checkboxErrorMessage = 'You must agree by checking the box.';
  const checkboxLabel =
    currentDebt.debtType === 'COPAY'
      ? `By checking this box, I understand that I’m requesting forgiveness for my copay debt.`
      : `By checking this box, I’m agreeing that I understand that waiving
      education debt will reduce any remaining education benefit I may
      have.`;

  return (
    <div
      className={
        checkboxError
          ? 'error-line vads-u-margin-y--3 vads-u-padding-left--1 vads-u-margin-left--neg1p5'
          : 'vads-u-margin-top--4 vads-u-text-align--left'
      }
    >
      {checkboxError && (
        <span
          className="vads-u-font-weight--bold vads-u-color--secondary-dark"
          role="alert"
        >
          <span className="sr-only">Error</span>
          <p>{checkboxErrorMessage}</p>
        </span>
      )}

      <input
        name="request-help-with-copay"
        id={currentDebt.id}
        type="checkbox"
        checked={isWaiverChecked || false}
        className="vads-u-width--auto"
        onChange={onWaiverChecked}
      />
      <label className="vads-u-margin--0" htmlFor={currentDebt.id}>
        <div className="vads-u-margin-left--4 vads-u-margin-top--neg3">
          <p className="vads-u-margin--0">
            {checkboxLabel}
            <span className="required-text vads-u-margin-left--1">
              (*Required)
            </span>
          </p>
        </div>
      </label>
    </div>
  );
};

// pagePerItemIndex is string in form, and populates as number in reivew page edit mode
ResolutionWaiverAgreement.propTypes = {
  formContext: PropTypes.shape({
    pagePerItemIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    submitted: PropTypes.bool,
  }),
};

export default ResolutionWaiverAgreement;

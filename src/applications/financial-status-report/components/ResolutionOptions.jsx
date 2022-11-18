import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import ExpandingGroup from '@department-of-veterans-affairs/component-library/ExpandingGroup';
import { RESOLUTION_OPTION_TYPES } from '../constants';

const ResolutionOptions = ({ formContext }) => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);
  const isEditing = formContext.onReviewPage ? !formContext.reviewMode : true;

  const { selectedDebtsAndCopays = [] } = formData;
  const currentDebt = selectedDebtsAndCopays[formContext.pagePerItemIndex];

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

  const onResolutionChange = ({ target }) => {
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

  const renderWaiverText = useMemo(() => {
    return (
      <>
        <span className="vads-u-display--block vads-u-font-weight--bold vads-u-margin-left--3 vads-u-margin-top--neg2p5">
          Debt forgiveness (waiver)
        </span>
        <span className="vads-u-display--block vads-u-font-size--sm vads-u-margin-left--3">
          If we accept your request, we’ll stop collection on and forgive (or
          "waive") the debt.
        </span>
      </>
    );
  }, []);

  const renderCompromiseText = useMemo(() => {
    return (
      <>
        <span className="vads-u-display--block vads-u-font-weight--bold vads-u-margin-left--3 vads-u-margin-top--neg2p5">
          Compromise
        </span>
        <span className="vads-u-display--block vads-u-font-size--sm vads-u-margin-left--3">
          If you can’t to pay the debt in full or make smaller monthly payments,
          we can consider a smaller, one-time payment to resolve your debt.
        </span>
      </>
    );
  }, []);

  const renderMonthlyText = useMemo(() => {
    return (
      <>
        <span className="vads-u-display--block vads-u-font-weight--bold vads-u-margin-left--3 vads-u-margin-top--neg2p5">
          Extended monthly payments
        </span>
        <span className="vads-u-display--block vads-u-font-size--sm vads-u-margin-left--3">
          If we accept your request, you can make smaller monthly payments for
          up to 5 years with either monthly offsets or a monthly payment plan.
        </span>
      </>
    );
  }, []);

  const renderResolutionSelectionText = () => {
    switch (currentDebt.resolutionOption) {
      case 'waiver':
        return renderWaiverText;
      case 'monthly':
        return renderMonthlyText;
      case 'compromise':
        return renderCompromiseText;
      default:
        return <></>;
    }
  };

  // Error message handling
  const resolutionError =
    formContext.submitted && !currentDebt.resolutionOption;
  const resolutionErrorMessage = 'Please select a resolution option';
  const checkboxError =
    formContext.submitted &&
    currentDebt.resolutionOption === RESOLUTION_OPTION_TYPES.WAIVER &&
    !currentDebt.resolutionWaiverCheck;
  const checkboxErrorMessage = 'You must agree by checking the box.';

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
        <ExpandingGroup
          open={currentDebt.resolutionOption === RESOLUTION_OPTION_TYPES.WAIVER}
        >
          <div>
            <input
              type="radio"
              checked={
                currentDebt.resolutionOption === RESOLUTION_OPTION_TYPES.WAIVER
              }
              name="resolution-option"
              id="radio-waiver"
              value="waiver"
              className="vads-u-width--auto"
              onChange={onResolutionChange}
            />
            <label htmlFor="radio-waiver" className="vads-u-margin--0">
              {renderWaiverText}
            </label>
            {currentDebt.debtType !== 'COPAY' && (
              <div>
                <input
                  type="radio"
                  checked={
                    currentDebt.resolutionOption ===
                    RESOLUTION_OPTION_TYPES.MONTHLY
                  }
                  name="resolution-option"
                  id="radio-monthly"
                  value="monthly"
                  className="vads-u-width--auto"
                  onChange={onResolutionChange}
                />
                <label htmlFor="radio-monthly">{renderMonthlyText}</label>
              </div>
            )}
            <input
              type="radio"
              checked={
                currentDebt.resolutionOption ===
                RESOLUTION_OPTION_TYPES.COMPROMISE
              }
              name="resolution-option"
              id="radio-compromise"
              value="compromise"
              className="vads-u-width--auto"
              onChange={onResolutionChange}
            />
            <label htmlFor="radio-compromise">{renderCompromiseText}</label>
          </div>
          <div
            className={
              checkboxError
                ? 'error-line vads-u-margin-y--3 vads-u-padding-left--1 vads-u-margin-left--neg1p5'
                : 'vads-u-margin-y--3'
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
                  By checking this box, I’m agreeing that I understand that
                  forgiveness of education debt will reduce any remaining
                  education benefit I may have.
                </p>
              </div>
            </label>
          </div>
        </ExpandingGroup>
      )}
    </div>
  );
};

ResolutionOptions.propTypes = {
  formContext: PropTypes.shape({
    pagePerItemIndex: PropTypes.number.isRequired,
    submitted: PropTypes.bool,
    onReviewPage: PropTypes.bool,
    reviewMode: PropTypes.bool,
  }),
};

export default ResolutionOptions;

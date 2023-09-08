import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
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

  const renderWaiverText = useMemo(() => {
    return (
      <>
        <span className="vads-u-display--block vads-u-font-weight--bold vads-u-margin-left--3 vads-u-padding-left--0p25 vads-u-margin-top--neg2p5">
          Waiver
        </span>
        <span className="vads-u-display--block vads-u-margin-left--3 vads-u-padding-left--0p25">
          If we approve your request, we’ll stop collection and waive the debt.
        </span>
      </>
    );
  }, []);

  const renderCompromiseText = useMemo(() => {
    return (
      <>
        <span className="vads-u-display--block vads-u-font-weight--bold vads-u-margin-left--3 vads-u-padding-left--0p25 vads-u-margin-top--neg2p5">
          Compromise
        </span>
        <span className="vads-u-display--block vads-u-margin-left--3 vads-u-padding-left--0p25">
          If you can’t pay the debt in full or make smaller monthly payments, we
          can consider a smaller, one-time payment to resolve your debt.
        </span>
      </>
    );
  }, []);

  const renderMonthlyText = useMemo(() => {
    return (
      <>
        <span className="vads-u-display--block vads-u-font-weight--bold vads-u-margin-left--3 vads-u-padding-left--0p25 vads-u-margin-top--neg2p5">
          Extended monthly payments
        </span>
        <span className="vads-u-display--block vads-u-margin-left--3 vads-u-padding-left--0p25">
          If we approve your request, you can make smaller monthly payments for
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
          <label
            htmlFor="radio-waiver"
            className="vads-u-margin--0 vads-u-display--flex vads-u-flex-direction--column vads-u-align-items--left "
          >
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
              <label
                htmlFor="radio-monthly"
                className=" vads-u-display--flex vads-u-flex-direction--column vads-u-align-items--left "
              >
                {renderMonthlyText}
              </label>
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
          <label
            htmlFor="radio-compromise"
            className=" vads-u-display--flex vads-u-flex-direction--column vads-u-align-items--left "
          >
            {renderCompromiseText}
          </label>
        </div>
      )}
    </div>
  );
};

// pagePerItemIndex is string in form, and populates as number in reivew page edit mode
ResolutionOptions.propTypes = {
  formContext: PropTypes.shape({
    pagePerItemIndex: PropTypes.string.isRequired,
    submitted: PropTypes.bool,
    onReviewPage: PropTypes.bool,
    reviewMode: PropTypes.bool,
  }),
};

export default ResolutionOptions;

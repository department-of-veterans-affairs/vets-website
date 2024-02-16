import React, { useEffect } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import {
  EmptyMiniSummaryCard,
  MiniSummaryCard,
} from '../shared/MiniSummaryCard';
import DeleteConfirmationModal from '../shared/DeleteConfirmationModal';
import { useDeleteModal } from '../../hooks/useDeleteModal';
import {
  currency as currencyFormatter,
  firstLetterLowerCase,
  generateUniqueKey,
} from '../../utils/helpers';
import { calculateTotalAnnualIncome } from '../../utils/streamlinedDepends';
import ButtonGroup from '../shared/ButtonGroup';

export const keyFieldsOtherIncome = ['amount', 'name'];

const OtherIncomeSummary = ({
  data,
  goToPath,
  goForward,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const {
    additionalIncome,
    gmtData,
    questions,
    reviewNavigation = false,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;
  const { addlIncRecords = [] } = additionalIncome;
  // notify user they are returning to review page if they are in review mode
  const continueButtonText =
    !questions?.isMarried && reviewNavigation
      ? 'Continue to review page'
      : 'Continue';

  // Calculate income properties as necessary
  useEffect(
    () => {
      if (questions?.isMarried || !gmtData?.isEligibleForStreamlined) return;

      const calculatedIncome = calculateTotalAnnualIncome(data);
      setFormData({
        ...data,
        gmtData: {
          ...gmtData,
          incomeBelowGmt: calculatedIncome < gmtData?.gmtThreshold,
          incomeBelowOneFiftyGmt:
            calculatedIncome < gmtData?.incomeUpperThreshold,
        },
      });
    },
    // avoiding use of data since it changes so often
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addlIncRecords, questions?.isMarried, gmtData?.isEligibleForStreamlined],
  );

  const onDelete = deleteIndex => {
    setFormData({
      ...data,
      additionalIncome: {
        ...additionalIncome,
        addlIncRecords: addlIncRecords.filter(
          (_, index) => index !== deleteIndex,
        ),
      },
    });
  };

  const {
    isModalOpen,
    handleModalCancel,
    handleModalConfirm,
    handleDeleteClick,
    deleteIndex,
  } = useDeleteModal(onDelete);

  const goBack = () => {
    if (addlIncRecords.length === 0) {
      return goToPath('/additional-income-checklist');
    }
    return goToPath('/additional-income-values');
  };

  const onSubmit = event => {
    event.preventDefault();
    if (showReviewNavigation && !questions?.isMarried && reviewNavigation) {
      setFormData({
        ...data,
        reviewNavigation: false,
      });
      return goToPath('/review-and-submit');
    }
    return goForward(data);
  };

  const cardBody = text => (
    <p className="vads-u-margin--0">
      Monthly amount: <b>{currencyFormatter(text)}</b>
    </p>
  );
  const emptyPrompt = `Select the ‘add other income’ link to add other income. Select the continue button to move on to the next question.`;

  return (
    <form onSubmit={onSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend
          id="added-income-summary"
          className="schemaform-block-title"
          name="addedIncomeSummary"
        >
          <h3 className="vads-u-margin--0">
            You have added these other sources of income
          </h3>
        </legend>
        <div className="vads-l-grid-container--full">
          {!addlIncRecords.length ? (
            <EmptyMiniSummaryCard content={emptyPrompt} />
          ) : (
            addlIncRecords.map((asset, index) => (
              <MiniSummaryCard
                body={cardBody(asset.amount)}
                editDestination={{
                  pathname: '/add-other-income',
                  search: `?index=${index}`,
                }}
                heading={asset.name}
                key={generateUniqueKey(asset, keyFieldsOtherIncome, index)}
                onDelete={() => handleDeleteClick(index)}
                showDelete
                index={index}
              />
            ))
          )}
          <Link
            className="vads-c-action-link--green"
            to={{
              pathname: '/add-other-income',
              search: `?index=${addlIncRecords.length}`,
            }}
          >
            Add additional other income
          </Link>
          {contentBeforeButtons}

          <ButtonGroup
            buttons={[
              {
                label: 'Back',
                onClick: goBack, // Define this function based on page-specific logic
                isSecondary: true,
              },
              {
                label: continueButtonText,
                onClick: onSubmit,
                isSubmitting: true, // If this button submits a form
              },
            ]}
          />

          {contentAfterButtons}
        </div>
        {isModalOpen ? (
          <DeleteConfirmationModal
            isOpen={isModalOpen}
            onClose={handleModalCancel}
            onDelete={handleModalConfirm}
            modalTitle={firstLetterLowerCase(addlIncRecords[deleteIndex]?.name)}
          />
        ) : null}
      </fieldset>
    </form>
  );
};

OtherIncomeSummary.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  data: PropTypes.shape({
    additionalIncome: PropTypes.shape({
      addlIncRecords: PropTypes.array,
    }),
    gmtData: PropTypes.shape({
      gmtThreshold: PropTypes.number,
      incomeBelowGmt: PropTypes.bool,
      incomeBelowOneFiftyGmt: PropTypes.bool,
      isEligibleForStreamlined: PropTypes.bool,
      incomeUpperThreshold: PropTypes.number,
    }),
    questions: PropTypes.shape({
      isMarried: PropTypes.bool,
    }),
    reviewNavigation: PropTypes.bool,
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default OtherIncomeSummary;

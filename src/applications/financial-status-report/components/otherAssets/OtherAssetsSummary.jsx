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
import { calculateLiquidAssets } from '../../utils/streamlinedDepends';
import ButtonGroup from '../shared/ButtonGroup';

export const keyFieldsForOtherAssets = ['name', 'amount'];

const OtherAssetsSummary = ({
  data,
  goForward,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const {
    assets,
    gmtData,
    reviewNavigation = false,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;
  const { otherAssets = [] } = assets;

  // notify user they are returning to review page if they are in review mode
  const continueButtonText =
    reviewNavigation && showReviewNavigation
      ? 'Continue to review page'
      : 'Continue';

  useEffect(
    () => {
      if (!gmtData?.isEligibleForStreamlined) return;
      // liquid assets are caluclated in cash in bank with this ff
      if (data['view:streamlinedWaiverAssetUpdate']) return;

      const calculatedAssets = calculateLiquidAssets(data);
      setFormData({
        ...data,
        gmtData: {
          ...gmtData,
          assetsBelowGmt: calculatedAssets < gmtData?.assetThreshold,
        },
      });
    },
    // avoiding use of data since it changes so often
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [otherAssets, gmtData?.isEligibleForStreamlined, gmtData?.assetThreshold],
  );

  const onDelete = deleteIndex => {
    setFormData({
      ...data,
      assets: {
        ...assets,
        otherAssets: otherAssets.filter((_, index) => index !== deleteIndex),
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
    if (otherAssets.length === 0) {
      return goToPath('/other-assets-checklist');
    }
    return goToPath('/other-assets-values');
  };

  const onSubmit = event => {
    event.preventDefault();
    if (reviewNavigation && showReviewNavigation) {
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
      Value: <b>{currencyFormatter(text)}</b>
    </p>
  );
  const emptyPrompt = `Select the ‘add additional assets’ link to add another asset. Select the continue button to move on to the next question.`;

  return (
    <form onSubmit={onSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend
          id="added-assets-summary"
          className="schemaform-block-title"
          name="addedAssetsSummary"
        >
          <h3 className="vads-u-margin--0">You have added these assets</h3>
        </legend>
        <div className="vads-l-grid-container--full">
          {!otherAssets.length ? (
            <EmptyMiniSummaryCard content={emptyPrompt} />
          ) : (
            otherAssets.map((asset, index) => (
              <MiniSummaryCard
                body={cardBody(asset.amount)}
                editDestination={{
                  pathname: '/add-other-asset',
                  search: `?index=${index}`,
                }}
                heading={asset.name}
                key={generateUniqueKey(asset, keyFieldsForOtherAssets, index)}
                onDelete={() => handleDeleteClick(index)}
                showDelete
                index={index}
              />
            ))
          )}
          <Link
            className="vads-c-action-link--green"
            to={{
              pathname: '/add-other-asset',
              search: `?index=${otherAssets.length}`,
            }}
          >
            Add additional assets
          </Link>
          <va-additional-info
            class="vads-u-margin-top--4"
            trigger="Why do I need to provide this information?"
            uswds
          >
            We ask for details about items of value such as jewelry and art
            because it gives us a picture of your financial situation and allows
            us to make a more informed decision regarding your request.
          </va-additional-info>
          <va-additional-info
            trigger="What if I don’t know the estimated value of an asset?"
            uswds
          >
            Don’t worry. We just want to get an idea of items of value you may
            own so we can better understand your financial situation. Include
            the amount of money you think you would get if you sold the asset.
            To get an idea of prices, you can check these places:
            <ul>
              <li>Online forums for your community</li>
              <li>Classified ads in local newspapers</li>
              <li>
                Websites or forums that appraise the value of items like jewelry
                and art
              </li>
            </ul>
          </va-additional-info>
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
            modalTitle={firstLetterLowerCase(otherAssets[deleteIndex]?.name)}
          />
        ) : null}
      </fieldset>
    </form>
  );
};

OtherAssetsSummary.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  data: PropTypes.shape({
    assets: PropTypes.shape({
      otherAssets: PropTypes.array,
    }),
    gmtData: PropTypes.shape({
      assetThreshold: PropTypes.number,
      assetsBelowGmt: PropTypes.bool,
      isEligibleForStreamlined: PropTypes.bool,
    }),
    reviewNavigation: PropTypes.bool,
    'view:streamlinedWaiverAssetUpdate': PropTypes.bool,
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }),
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default OtherAssetsSummary;

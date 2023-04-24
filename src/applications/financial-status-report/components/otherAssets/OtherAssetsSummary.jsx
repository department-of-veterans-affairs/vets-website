import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import {
  EmptyMiniSummaryCard,
  MiniSummaryCard,
} from '../shared/MiniSummaryCard';
import { currency as currencyFormatter } from '../../utils/helpers';

const OtherAssetsSummary = ({
  data,
  goBack,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const { assets } = data;
  const { otherAssets = [] } = assets;

  const onDelete = deleteIndex => {
    setFormData({
      ...data,
      assets: {
        ...assets,
        otherAssets: otherAssets.filter(
          (source, index) => index !== deleteIndex,
        ),
      },
    });
  };

  const goForward = () => {
    return goToPath('/expenses-explainer');
  };

  const cardBody = text => (
    <p>
      Value: <b>{currencyFormatter(text)}</b>
    </p>
  );
  const emptyPrompt = `Select the ‘add additional assets’ link to add another asset. Select the continue button to move on to the next question.`;

  return (
    <form>
      <fieldset>
        <legend
          id="added-assets-summary"
          className="vads-u-font-family--serif"
          name="addedAssetsSummary"
        >
          You have added these assets
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
                key={asset.name + asset.amount}
                onDelete={() => onDelete(index)}
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
          >
            We ask for details about items of value such as jewelry and art
            because it gives us a picture of your financial situation and allows
            us to make a more informed decision regarding your request.
          </va-additional-info>
          <va-additional-info trigger="What if I don’t know the estimated value of an asset?">
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
          <FormNavButtons
            goBack={goBack}
            goForward={goForward}
            submitToContinue
          />
          {contentAfterButtons}
        </div>
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
  }),
  goBack: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
  testingIndex: PropTypes.number,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default OtherAssetsSummary;

import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import {
  EmptyMiniSummaryCard,
  MiniSummaryCard,
} from './shared/MiniSummaryCard';
import { currency as currencyFormatter } from '../utils/helpers';

const OtherIncomeSummary = ({
  data,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const { additionalIncome } = data;
  const { addlIncRecords = [] } = additionalIncome;

  const onDelete = deleteIndex => {
    setFormData({
      ...data,
      additionalIncome: {
        ...additionalIncome,
        addlIncRecords: addlIncRecords.filter(
          (source, index) => index !== deleteIndex,
        ),
      },
    });
  };

  const goForward = () => {
    return goToPath('/spouse-information');
  };

  const goBack = () => {
    if (addlIncRecords.length === 0) {
      return goToPath('/additional-income-checklist');
    }
    return goToPath('/additional-income-values');
  };

  const cardBody = text => (
    <p>
      Monthly amount: <b>{currencyFormatter(text)}</b>
    </p>
  );
  const emptyPrompt = `Select the ‘add other income’ link to add other income. Select the continue button to move on to the next question.`;

  return (
    <form>
      <fieldset className="vads-u-margin-y--2">
        <legend
          id="added-income-summary"
          className="schemaform-block-title"
          name="addedIncomeSummary"
        >
          You have added these other sources of income
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
              pathname: '/add-other-income',
              search: `?index=${addlIncRecords.length}`,
            }}
          >
            Add additional other income
          </Link>
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

OtherIncomeSummary.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  data: PropTypes.shape({
    additionalIncome: PropTypes.shape({
      addlIncRecords: PropTypes.array,
    }),
  }),
  goBack: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
  testingIndex: PropTypes.number,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default OtherIncomeSummary;

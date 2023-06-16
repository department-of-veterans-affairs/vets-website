import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import {
  EmptyMiniSummaryCard,
  MiniSummaryCard,
} from './shared/MiniSummaryCard';
import { currency as currencyFormatter } from '../utils/helpers';

const SpouseOtherIncomeSummary = ({
  data,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const { additionalIncome } = data;
  const { spouse } = additionalIncome;
  const { spAddlIncome = [] } = spouse;

  const onDelete = deleteIndex => {
    setFormData({
      ...data,
      additionalIncome: {
        ...additionalIncome,
        spouse: {
          spAddlIncome: spAddlIncome.filter(
            (source, index) => index !== deleteIndex,
          ),
        },
      },
    });
  };

  const goForward = () => {
    return goToPath('/dependents-count');
  };

  const goBack = () => {
    if (spAddlIncome.length === 0) {
      return goToPath('/spouse-additional-income-checklist');
    }
    return goToPath('/spouse-additional-income-values');
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
          {!spAddlIncome.length ? (
            <EmptyMiniSummaryCard content={emptyPrompt} />
          ) : (
            spAddlIncome.map((asset, index) => (
              <MiniSummaryCard
                body={cardBody(asset.amount)}
                editDestination={{
                  pathname: '/spouse-add-other-income',
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
              pathname: '/spouse-add-other-income',
              search: `?index=${spAddlIncome.length}`,
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

SpouseOtherIncomeSummary.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  data: PropTypes.shape({
    additionalIncome: PropTypes.shape({
      spouse: PropTypes.shape({
        spAddlIncome: PropTypes.array,
      }),
    }),
  }),
  goBack: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
  testingIndex: PropTypes.number,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default SpouseOtherIncomeSummary;

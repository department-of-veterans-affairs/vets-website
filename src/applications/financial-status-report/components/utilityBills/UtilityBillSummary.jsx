import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import {
  EmptyMiniSummaryCard,
  MiniSummaryCard,
} from '../shared/MiniSummaryCard';
import { currency as currencyFormatter } from '../../utils/helpers';

const UtilityBillSummary = ({
  data,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const { utilityRecords = [] } = data;

  const onDelete = deleteIndex => {
    setFormData({
      ...data,
      utilityRecords: utilityRecords.filter(
        (source, index) => index !== deleteIndex,
      ),
    });
  };

  const goForward = () => {
    goToPath('/credit-card-bills');
  };

  const goBack = () => {
    if (utilityRecords.length === 0) {
      return goToPath('/utility-bill-checklist');
    }
    return goToPath('/utility-bill-values');
  };

  const cardBody = text => (
    <p>
      Monthly amount: <b>{currencyFormatter(text)}</b>
    </p>
  );

  const emptyPrompt = `Select the 'Add additional utility bills' link to add another utility bill. Select the 'Continue' button to proceed to the next question.`;

  return (
    <form>
      <fieldset className="vads-u-margin-y--2">
        <legend
          id="added-utility-bills-summary"
          className="schemaform-block-title"
          name="addedUtilityBillsSummary"
        >
          You have added these utility bills
        </legend>
        <div className="vads-l-grid-container--full">
          {!utilityRecords.length ? (
            <EmptyMiniSummaryCard content={emptyPrompt} />
          ) : (
            utilityRecords.map((utility, index) => (
              <MiniSummaryCard
                body={cardBody(utility.amount)}
                editDestination={{
                  pathname: '/add-utility-bill',
                  search: `?index=${index}`,
                }}
                heading={utility.name}
                key={utility.name + utility.amount}
                onDelete={() => onDelete(index)}
                showDelete
                index={index}
              />
            ))
          )}
          <Link
            className="vads-c-action-link--green"
            to={{
              pathname: '/add-utility-bill',
              search: `?index=${utilityRecords.length}`,
            }}
          >
            Add additional utility bills
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

UtilityBillSummary.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  data: PropTypes.shape({
    utilityRecords: PropTypes.array,
  }),
  goBack: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
  testingIndex: PropTypes.number,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default UtilityBillSummary;

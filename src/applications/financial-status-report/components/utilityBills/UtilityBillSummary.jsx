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
  goBack,
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
    goToPath('/repayments');
  };

  const cardBody = text => (
    <p className="vads-u-margin-y--2 vads-u-color--gray">{text}</p>
  );

  const emptyPrompt = `Select the 'Add additional utility bills' link to add another utility bill. Select the 'Continue' button to proceed to the next question.`;

  return (
    <form>
      <fieldset>
        <legend
          id="added-utility-bills-summary"
          className="vads-u-font-family--serif"
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
                body={cardBody(`Value: ${currencyFormatter(utility.amount)}`)}
                editDestination={{
                  pathname: '/add-utility-bill',
                  search: `?index=${index}`,
                }}
                heading={utility.name}
                key={utility.name + utility.amount}
                onDelete={() => onDelete(index)}
                showDelete
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

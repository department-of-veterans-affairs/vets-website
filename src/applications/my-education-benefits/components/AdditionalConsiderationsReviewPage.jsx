import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formFields } from '../constants';
import { formPages } from '../helpers';

const AdditionalConsiderationsReviewPage = ({ formData, editPage }) => {
  const {
    [formFields.activeDutyKicker]: activeDutyKicker,
    [formFields.selectedReserveKicker]: selectedReserveKicker,
    [formFields.federallySponsoredAcademy]: federallySponsoredAcademy,
    [formFields.seniorRotcCommission]: seniorRotcCommission,
    [formFields.loanPayment]: loanPayment,
    [formFields.sixHundredDollarBuyUp]: sixHundredDollarBuyUp,
  } = formData || {};

  const renderReviewRow = (label, value) => {
    if (value !== undefined && value !== null) {
      return (
        <div className="review-row">
          <dt className="review-question">{label}</dt>
          <dd className="review-answer">
            <span
              className="dd-privacy-hidden"
              data-dd-action-name="data value"
            >
              {value}
            </span>
          </dd>
        </div>
      );
    }
    return null;
  };
  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          Additional Considerations
        </h4>
        <va-button
          aria-label="Edit Additional Considerations"
          secondary
          text="Edit"
          onClick={() => editPage(formPages.additionalConsiderations)}
        />
      </div>
      <dl className="review">
        {renderReviewRow(
          'Do you qualify for an active duty kicker?',
          activeDutyKicker,
        )}
        {renderReviewRow(
          'Do you qualify for a reserve kicker?',
          selectedReserveKicker,
        )}
        {renderReviewRow(
          'Did you graduate and receive a commission from the United States Military Academy?',
          federallySponsoredAcademy,
        )}
        {renderReviewRow(
          'Were you commissioned as a result of Senior ROTC?',
          seniorRotcCommission,
        )}
        {renderReviewRow(
          'Do you have a period of service that the Department of Defense counts towards an education loan payment?',
          loanPayment,
        )}
        {renderReviewRow(
          'Did you make additional contributions (up to $600) to increase your monthly benefits?',
          sixHundredDollarBuyUp,
        )}
      </dl>
    </div>
  );
};

AdditionalConsiderationsReviewPage.propTypes = {
  editPage: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
});

export default connect(mapStateToProps)(AdditionalConsiderationsReviewPage);

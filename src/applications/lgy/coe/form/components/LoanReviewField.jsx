import React from 'react';
import PropTypes from 'prop-types';

import text from '../content/loanHistory';

// Review field added to fix improper DL & DIV wrapping of loan cards on the
// review & submit page; renderedProperties is passed as a param, but is missing
// the needed DL wrapper
const LoanReviewField = ({ defaultEditButton, title, formData } = {}) => {
  if ((formData?.relevantPriorLoans || []).length === 0) {
    return null;
  }

  const keys = Object.keys(text);
  const content = (formData?.relevantPriorLoans || []).map((loan, index) => (
    <div key={index} className="review">
      <div className="schemaform-field-container">
        <div className="va-growable-background vads-u-margin-top--1">
          <div className="row small-collapse">
            <div className="small-12 columns">
              <h5 className="schemaform-array-readonly-header">
                VA-backed loan
              </h5>
              <dl className="review">
                {keys.map(key => (
                  <div key={key} className="review-row">
                    <dt>{text[key].title}</dt>
                    <dd>{text[key].value(loan)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <>
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {title}
        </h4>
        {defaultEditButton()}
      </div>
      {content}
    </>
  );
};

LoanReviewField.propTypes = {
  defaultEditButton: PropTypes.func,
  formData: PropTypes.shape({
    relevantPriorLoans: PropTypes.array,
  }),
  title: PropTypes.string,
};

export default LoanReviewField;

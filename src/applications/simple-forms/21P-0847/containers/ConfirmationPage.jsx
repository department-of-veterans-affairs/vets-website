import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { ConfirmationPageView } from '../../shared/components/ConfirmationPageView';

const content = {
  headlineText: 'Thank you for submitting your request',
  nextStepsText:
    'You may now submit evidence in support of pending claims or appeals for potential accrued benefits for the claimant.',
};

const childContent = (
  <>
    <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
      What are my next steps?
    </h2>
    <p>
      Once a substitution request is granted, the substitute claimant must
      complete any action required by law or regulation within the time period
      remaining for the original claimant to take such action on the date of
      their death. The substitute has the same rights as would have applied to
      the original claimant had they not died, including the rights regarding
      hearings, representation, legacy appeals, decision review options for a
      claim not finally adjudicated, and submission of evidence. The substitue
      also has the right to request a decision review of a deceased claimant’s
      claim that is not yet final.
    </p>
    <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
      What if I change my mind?
    </h2>
    <p>
      If you change your mind and do not want to be the substitute for the
      deceased claimant, write us a letter to revoke your request.
    </p>
    <p>For compensation claims, please send your request to:</p>
    <p className="va-address-block">
      Department of Veterans Affairs <br />
      Claims Intake Center
      <br />
      PO Box 4444
      <br />
      Janesville, WI 53547-5192
      <br />
    </p>
    <p>For pension & survivor benefit claims, please send your request to:</p>
    <p className="va-address-block">
      Department of Veterans Affairs <br />
      Pension Intake Center
      <br />
      PO Box 5365
      <br />
      Janesville, WI 53547-5192
      <br />
    </p>
    <p className="vads-u-margin-bottom--0">
      You may also bring the letter to revoke your request to your nearest VA
      regional office.
    </p>
    <a href="/find-locations">Find a VA regional office near you</a>
  </>
);

export const ConfirmationPage = () => {
  const form = useSelector(state => state.form || {});
  const { submission, data } = form;
  const fullName = data.preparerName;
  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmationNumber;

  return (
    <ConfirmationPageView
      submitterName={fullName}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      content={content}
      childContent={childContent}
    />
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      fullName: {
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      },
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);

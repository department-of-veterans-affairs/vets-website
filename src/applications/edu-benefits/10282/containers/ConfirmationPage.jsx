import React from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import FormHelp from '../components/FormHelp';

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }

  render() {
    const { form } = this.props;
    const { submission, data } = form;
    const submitDate = submission.timestamp;
    const { veteranFullName: fullName } = data;
    return (
      <div>
        <va-alert
          close-btn-aria-label="Close notification"
          status="success"
          visible
        >
          <h2 slot="headline">
            You've submitted your application for the IBM SkillsBuild Program
          </h2>
          <p className="vads-u-margin-y--0">
            After we've reviewed your application, we'll email you a decision.
          </p>
        </va-alert>
        <div className="inset">
          <h3 className="vads-u-margin-top--0 vads-u-font-size--h4">
            Your application information
          </h3>
          {fullName ? (
            <p>
              <strong>Who submitted this form </strong>
              <br />
              <span>
                {fullName.first} {fullName.middle} {fullName.last}
              </span>
            </p>
          ) : null}

          {isValid(submitDate) ? (
            <p>
              <strong>Date submitted</strong>
              <br />
              <span>{format(submitDate, 'MMMM d, yyyy')}</span>
            </p>
          ) : null}
          <p>
            <strong>Confirmation for your records </strong>
            <br />
            <span>You can print this confirmation page for your records.</span>
          </p>
          {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
          <button
            type="button"
            className="usa-button screen-only"
            onClick={window.print}
          >
            Print this page
          </button>
        </div>
        <div className="vads-u-margin-top--0">
          <h2>What to expect next</h2>
          <p>
            If you're accepted into the SkillsBuild program, you'll receive an
            email from <a href="mailto:sbuser@us.ibm.com">sbuser@us.ibm.com</a>{' '}
            with your login information. If you don't receive an email, check
            your spam folder.
          </p>
          <p>
            You'll also receive an email from SkillUp Online, SkillsBuild's
            training provider, with more resources and support for your
            training. SkillUp Online will help you choose a learning format for
            your training. You can choose between independent learning (also
            known as self-paced learning), or cohort learning (which includes
            scheduled online classes).
          </p>
          <FormHelp tag="va-need-help" />
        </div>
      </div>
    );
  }
}

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      veteranFullName: {
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

export function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);

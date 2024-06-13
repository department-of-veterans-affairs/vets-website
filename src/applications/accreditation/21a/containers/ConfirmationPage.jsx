import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';

const ConfirmationPage = ({ form }) => {
  const { submission, formId, data } = form;
  const { fullName } = data;
  const submitDate = new Date(submission?.timestamp);

  useEffect(() => {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }, []);

  return (
    <div>
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
      </div>
      <va-alert status="success" visible>
        <h2 slot="headline">
          Thank you for completing your application to become a VA accredited
          attorney or claims agent (Form {formId})
        </h2>
        <p className="vads-u-margin-y--0">
          Once we’ve successfully received your application, we’ll contact you
          to tell you what happens next in the application process.
        </p>
      </va-alert>
      <div className="inset">
        <h3 className="vads-u-margin-top--0 vads-u-font-size--h4">
          Your application information
        </h3>
        {fullName && (
          <p>
            <strong>For</strong>
            <br />
            {fullName.first} {fullName.middle} {fullName.last}
            {fullName.suffix && `, ${fullName.suffix}`}
          </p>
        )}
        {isValid(submitDate) && (
          <p>
            <strong>Date you applied</strong>
            <br />
            {format(submitDate, 'MMMM d, yyyy')}
          </p>
        )}
        <p>
          <strong>Confirmation for your records</strong>
          <br />
          You can print this confirmation for your records.
        </p>
        <va-button
          uswds
          class="screen-only vads-u-margin-top--1"
          text="Print this page"
          onClick={() => window.print()}
        />
      </div>
    </div>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      fullName: PropTypes.shape({
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      }),
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.string,
    }),
  }),
};

const mapStateToProps = state => ({
  form: state.form,
});

export default connect(mapStateToProps)(ConfirmationPage);

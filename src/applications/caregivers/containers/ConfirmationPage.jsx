import React, { useEffect } from 'react';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import { scrollToTop } from 'applications/claims-status/utils/page';

const ConfirmationPage = props => {
  useEffect(() => {
    focusElement('.schemaform-title > h1');
    scrollToTop();
  }, []);

  const { submission, data } = props.form;
  const { response } = submission;
  const name = data.veteranFullName;

  const PrintDetails = () => (
    <div className="print-details">
      <img
        src="/img/design/logo/logo-black-and-white.png"
        alt="VA logo"
        width="300"
      />

      <h1 className="vads-u-font-size--h3">
        Apply for the Program of Comprehensive Assistance for Family Caregivers
      </h1>

      <span>Form 10-10CG</span>

      <section>
        <div>
          <h2 className="vads-u-font-size--h4">
            You’ve successfullly submitted your application.
          </h2>

          <p>
            Once we’ve reviewed your application, a Caregiver Support
            Coordinator will contact you to discuss next steps.
          </p>
        </div>

        <div>
          <h3 className="vads-u-font-size--h4">Application details</h3>
          {response && (
            <p>{moment(response.timestamp).format('MMM D, YYYY')}</p>
          )}
        </div>

        <div>
          <h4 className="vads-u-font-size--h4">Form submitted</h4>
          <p>
            Application for Comprehensive Assistance for Family Caregivers
            Program (form 10-10CG):
          </p>
          <span>
            For Veteran {name.first} {name.middle} {name.last} {name.suffix}
          </span>
        </div>
      </section>
    </div>
  );

  return (
    <section className="caregiver-confirmation">
      <AlertBox
        headline="You’ve successfully submitted your application."
        content="Once we’ve reviewed your application, a Caregiver Support Coordinator will contact you to discuss next steps."
        status="success"
      />
      <div className="inset vads-u-margin-top--4">
        <h4 className="insert-title">
          Application for the Program of Comprehensive Assistance for Family
          Caregivers (VA From 10-10CG)
        </h4>

        <span>
          For Veteran: {name.first} {name.middle} {name.last} {name.suffix}
        </span>

        {response && (
          <ul className="claim-list">
            <li>
              <strong>Date received</strong>
              <br />
              <span>{moment(response.timestamp).format('MMM D, YYYY')}</span>
            </li>
          </ul>
        )}

        <button className="usa-button button" onClick={() => window.print()}>
          Print this page
        </button>
      </div>

      <PrintDetails />
    </section>
  );
};

const mapStateToProps = state => ({
  form: state.form,
});

export default connect(mapStateToProps)(ConfirmationPage);

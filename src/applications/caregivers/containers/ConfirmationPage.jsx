import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { links } from '../definitions/content';

const ConfirmationPage = props => {
  useEffect(() => {
    focusElement('.caregiver-success-message');
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
            You’ve successful submitted your application.
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
    <section className="caregiver-confirmation vads-u-margin-bottom--2p5">
      <va-alert status="success" class="caregiver-success-message">
        <h2 slot="headline">You’ve successfully submitted your application.</h2>
        <div>
          Once we’ve reviewed your application, a Caregiver Support Coordinator
          will contact you to discuss next steps.
        </div>
      </va-alert>
      <div className="inset vads-u-margin-top--4">
        <h3 className="insert-title vads-u-font-size--h4">
          Application for the Program of Comprehensive Assistance for Family
          Caregivers (VA Form 10-10CG)
        </h3>

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

        <button
          type="button"
          className="usa-button button"
          onClick={() => window.print()}
        >
          Print this page
        </button>
      </div>

      <div className="caregiver-footer row vads-u-padding-x--1p5">
        <div style={{ maxWidth: '600px' }}>
          <h3>What happens after I apply?</h3>

          <p>
            If we need you to provide more information or documents, we will
            contact you.
          </p>

          <p>
            A member of the Caregiver Support Program team at the medical center
            where the Veteran plans to receive care will contact you to discuss
            the application process and next steps in determining eligibility.
            If you aren’t eligible for PCAFC you may be eligible for the Program
            of General Caregiver Support Services (PGCSS).
          </p>

          <p>
            If you have questions about your application, what to expect next,
            or if you are interested in learning more about the support and
            services available to support Veterans and caregivers, you may
            contact the VA Caregiver Support Line at{' '}
            <va-telephone contact={CONTACTS.CAREGIVER} /> or visit{' '}
            <a
              href={links.caregiverHelpPage.link}
              target="_blank"
              rel="noreferrer noopener"
            >
              {links.caregiverHelpPage.label}
            </a>
            .
          </p>

          <a
            className="vads-u-display--inline-block vads-u-margin-bottom--4"
            href="https://www.va.gov/"
          >
            Go back to VA.gov
          </a>
        </div>
      </div>

      <PrintDetails />
    </section>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.object,
};

const mapStateToProps = state => ({
  form: state.form,
});

export default connect(mapStateToProps)(ConfirmationPage);

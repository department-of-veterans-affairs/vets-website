import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { links } from '../../../definitions/content';
import ConfirmationPrintView from '../ConfirmationPrintView';

const PreMulesoftContent = ({ form }) => {
  const { submission, data } = form;
  const { response, timestamp } = submission;
  const name = data.veteranFullName;

  useEffect(() => {
    focusElement('.caregiver-success-message');
    scrollToTop();
  }, []);

  return (
    <div className="caregiver-confirmation vads-u-margin-bottom--2p5">
      <section className="caregiver-confirmation--screen no-print">
        <va-alert status="success" class="caregiver-success-message">
          <h2 slot="headline">
            You’ve successfully submitted your application.
          </h2>
          <>
            Once we’ve reviewed your application, a Caregiver Support
            Coordinator will contact you to discuss next steps.
          </>
        </va-alert>

        <div className="inset vads-u-margin-top--4">
          <h2 className="insert-title vads-u-font-size--h4">
            Application for the Program of Comprehensive Assistance for Family
            Caregivers (VA Form 10-10CG)
          </h2>

          <span>
            For Veteran: {name.first} {name.middle} {name.last} {name.suffix}
          </span>

          {!!response && (
            <ul className="claim-list">
              <li>
                <strong>Date received</strong>
                <br />
                <span>{moment(timestamp).format('MMM D, YYYY')}</span>
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
      </section>

      <section className="caregiver-confirmation--print">
        <ConfirmationPrintView
          name={name}
          timestamp={response ? timestamp : null}
        />
      </section>

      <section>
        <h2>What happens after I apply?</h2>

        <p>
          If we need you to provide more information or documents, we will
          contact you.
        </p>

        <p>
          A member of the Caregiver Support Program team at the medical center
          where the Veteran plans to receive care will contact you to discuss
          the application process and next steps in determining eligibility. If
          you aren’t eligible for PCAFC you may be eligible for the Program of
          General Caregiver Support Services (PGCSS).
        </p>

        <p>
          If you have questions about your application, what to expect next, or
          if you are interested in learning more about the support and services
          available to support Veterans and caregivers, you may contact the VA
          Caregiver Support Line at{' '}
          <va-telephone contact={CONTACTS.CAREGIVER} /> or visit{' '}
          <a
            href={links.caregiverHelpPage.link}
            rel="noreferrer noopener"
            target="_blank"
          >
            {links.caregiverHelpPage.label}
          </a>
          .
        </p>

        <p className="no-print">
          <a href="https://www.va.gov">Go back to VA.gov</a>
        </p>
      </section>
    </div>
  );
};

PreMulesoftContent.propTypes = {
  form: PropTypes.object,
};

export default PreMulesoftContent;

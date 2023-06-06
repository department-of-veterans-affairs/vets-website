import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { links } from '../definitions/content';
import ConfirmationScreenView from '../components/ConfirmationPage/ConfirmationScreenView';
import ConfirmationPrintView from '../components/ConfirmationPage/ConfirmationPrintView';

const ConfirmationPage = ({ form }) => {
  const { submission, data } = form;
  const { response, timestamp } = submission;
  const name = data.veteranFullName;

  return (
    <div className="caregiver-confirmation vads-u-margin-bottom--2p5">
      <section className="caregiver-confirmation--screen no-print">
        <ConfirmationScreenView
          form={form}
          name={name}
          timestamp={response ? timestamp : null}
        />
      </section>

      <section className="caregiver-confirmation--print">
        <ConfirmationPrintView
          name={name}
          timestamp={response ? timestamp : null}
        />
      </section>

      <section>
        <h2>What to expect next</h2>
        <p>
          We’ll contact you soon to tell you what happens next in the
          application process.
        </p>
        <ul>
          <li>
            If you gave us your email address, we’ll contact you by email within
            24 hours. Make sure to check your inbox and your spam or junk
            folder.
          </li>
          <li>
            If you didn’t give us your email address, we’ll contact you by phone
            or mail.
          </li>
        </ul>
        <p>
          <strong>Note:</strong> If you’re not eligible for this program, you
          may still be eligible for other types of caregiver support.
        </p>
      </section>

      <section>
        <h2>What to do if you have questions now</h2>
        <p>
          Connect with a Caregiver Support Coordinator. Our coordinators can
          answer questions about your application. They can also tell you more
          about programs and services for caregivers.
        </p>
        <p className="no-print">
          <a
            href={links.caregiverSupportCoordinators.link}
            target="_blank"
            rel="noreferrer noopener"
          >
            Find your local Caregiver Support Coordinator
          </a>
        </p>
        <p>
          Or call us at <va-telephone contact={CONTACTS.CAREGIVER} />. We’re
          here Monday through Friday, 8:00 a.m. to 10:00 p.m.{' '}
          <dfn>
            <abbr title="Eastern Time">ET</abbr>
          </dfn>
          , and Saturday, 8:00 a.m. to 5:00 p.m.{' '}
          <dfn>
            <abbr title="Eastern Time">ET</abbr>
          </dfn>
          .
        </p>
        <p className="no-print">
          <a
            href={links.caregiverHelpPage.link}
            target="_blank"
            rel="noreferrer noopener"
          >
            Learn more about caregiver support
          </a>
        </p>
      </section>
    </div>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.object,
};

const mapStateToProps = state => ({
  form: state.form,
});

export default connect(mapStateToProps)(ConfirmationPage);

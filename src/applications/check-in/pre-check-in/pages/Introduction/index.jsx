import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AppointmentBlock from '../../components/AppointmentBlock';
import Footer from '../../components/Footer';
import { focusElement } from 'platform/utilities/ui';
import { format, add } from 'date-fns';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
// @TODO Add routing to button once routing merged in. Remove appointments once mock API merged in. Resolve answers to questions for UX team. Add unit test for intro.
const Introduction = () => {
  useEffect(() => {
    focusElement('h1');
  }, []);
  const [privacyActModalOpen, setPrivacyActModalOpen] = useState(false);
  const appointments = [
    {
      facility: 'LOMA LINDA VA CLINIC',
      clinicPhoneNumber: '5551234567',
      clinicFriendlyName: 'TEST CLINIC',
      clinicName: 'LOM ACC CLINIC TEST',
      appointmentIen: 'some-ien',
      startTime: '2021-11-16T21:39:36',
    },
    {
      facility: 'LOMA LINDA VA CLINIC',
      clinicPhoneNumber: '5551234567',
      clinicFriendlyName: 'TEST CLINIC 2',
      clinicName: 'LOM ACC CLINIC TEST',
      appointmentIen: 'some-ien',
      startTime: '2021-11-16T23:00:00',
    },
  ];
  const accordionContent = [
    {
      header: 'What happens after I answer the questions?',
      body: (
        <>
          <p>
            Changes to your contact information, insurance, next of kin, or
            emergency contact will update your information across the VA.
          </p>
          <p>
            If your provider requested additional questions, we’ll send your
            answers to your provider through a secure electronic communication.
            We’ll also ass the questionnaire to your medical record.
          </p>
          <p>
            Your provider will review your answers and discuss them with you
            during your appointment.
          </p>
        </>
      ),
    },
    {
      header: 'Will VA protect my personal health information?',
      body: (
        <>
          <p>
            We make every effort to keep your personal information private and
            secure.
          </p>
          <a href="#">Read more about privacy and security on VA.gov</a>
          <p>
            You’re also responsible for protecting your personal health
            information. If you print or download your information—or share it
            electronically with others—you’ll need to take steps to protect it.
          </p>
          <a href="#">
            Get tips for protecting your personal health information
          </a>
        </>
      ),
    },
  ];
  const appointmentsDateTime = new Date(appointments[0].startTime);
  const StartButton = () => (
    <a href="#" className="vads-u-margin-bottom--3 vads-u-display--block">
      <i
        className="fas fa-chevron-circle-right vads-u-color--green vads-u-font-size--2xl vads-u-display--inline-block vads-u-margin-right--1"
        style={{ verticalAlign: 'middle' }}
      />
      <span className="vads-u-font-weight--bold">
        Start answering questions
      </span>
    </a>
  );
  return (
    <div className="vads-l-grid-container vads-u-padding-top--3 vads-u-padding-bottom--3">
      <h1 tabIndex="-1" className="vads-u-margin-top--2">
        Answer pre check-in questions
      </h1>
      <p className="vads-u-font-family--serif">
        Your answers will help us better prepare for your needs.
      </p>
      <AppointmentBlock appointments={appointments} />
      <StartButton />
      {accordionContent && accordionContent.length ? (
        <va-accordion bordered className="vads-u-margin-top--1">
          {accordionContent.map((accordionItem, index) => (
            <va-accordion-item
              level="2"
              header={accordionItem.header}
              key={index}
            >
              {accordionItem.body}
            </va-accordion-item>
          ))}
        </va-accordion>
      ) : (
        ''
      )}
      <va-featured-content>
        <p>
          <span className="vads-u-font-weight--bold">Note:</span> If you need to
          talk to someone right away or need emergency care,
        </p>
        <ul>
          <li>
            Call <a href="tel:911">911</a>,{' '}
            <span className="vads-u-font-weight--bold">or</span>
          </li>
          <li>
            Call the Veterans Crisis hotline at{' '}
            <a href="tel:1-800-273-8255">800-273-8255</a> and select 1
          </li>
        </ul>
      </va-featured-content>
      <StartButton />
      <div>
        Expiration date:{' '}
        {format(add(appointmentsDateTime, { days: 1 }), 'M/dd/Y')}
        <br />
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            setPrivacyActModalOpen(true);
          }}
        >
          Privacy Act Statement
        </a>
      </div>
      <Footer />
      <Modal
        onClose={() => setPrivacyActModalOpen(false)}
        visible={privacyActModalOpen}
        focusSelector="button"
        cssClass=""
        contents={<p>TBD</p>}
      />
    </div>
  );
};

Introduction.propTypes = {
  router: PropTypes.object,
};

export default Introduction;

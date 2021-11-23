import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AppointmentBlock from '../../components/AppointmentBlock';
import Footer from '../../components/Footer';
import { focusElement } from 'platform/utilities/ui';
import { format, add } from 'date-fns';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';
import { useFormRouting } from '../../hooks/useFormRouting';

// @TODO Remove appointments once mock API merged in. Resolve answers to questions for UX team. Add unit test for intro.
const Introduction = props => {
  useEffect(() => {
    focusElement('h1');
  }, []);
  const { router } = props;
  const { goToNextPage } = useFormRouting(router);
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
    <div
      className="vads-u-margin-bottom--4 vads-u-display--block"
      data-testid="start-button"
    >
      <a
        className="vads-c-action-link--green"
        href="#"
        onClick={e => {
          e.preventDefault();
          goToNextPage();
        }}
      >
        Start answering questions
      </a>
    </div>
  );
  return (
    <div
      className="vads-l-grid-container vads-u-padding-top--3 vads-u-padding-bottom--3"
      data-testid="intro-wrapper"
    >
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
            Call <Telephone contact="911" />,{' '}
            <span className="vads-u-font-weight--bold">or</span>
          </li>
          <li>
            Call the Veterans Crisis hotline at{' '}
            <Telephone contact="8002738255" /> and select 1
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

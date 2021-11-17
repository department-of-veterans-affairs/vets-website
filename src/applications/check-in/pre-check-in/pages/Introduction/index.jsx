import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import AppointmentBlock from '../../components/AppointmentBlock';
import { focusElement } from 'platform/utilities/ui';

const Introduction = () => {
  // const { router } = props;
  useEffect(() => {
    focusElement('h1');
  }, []);
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
      clinicFriendlyName: 'TEST CLINIC',
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
  return (
    <div className="vads-l-grid-container vads-u-padding-top--3 vads-u-padding-bottom--3">
      <h1 tabIndex="-1" className="vads-u-margin-top--2">
        Answer pre check-in questions
      </h1>
      <p>Your answers will help us better prepare for your needs.</p>
      <AppointmentBlock appointments={appointments} />
      {/* Start button */}
      <va-accordion bordered class="vads-u-margin-top--1">
        {accordionContent.map((accordionItem, index) => (
          <va-accordion-item
            level="3"
            header={accordionItem.header}
            key={index}
          >
            {accordionItem.body}
          </va-accordion-item>
        ))}
      </va-accordion>
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
      {/* <Footer /> */}
    </div>
  );
};

Introduction.propTypes = {
  router: PropTypes.object,
};

export default Introduction;

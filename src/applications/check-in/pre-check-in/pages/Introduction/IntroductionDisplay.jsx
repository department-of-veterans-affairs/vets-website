import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { format, subDays } from 'date-fns';

import Modal from '@department-of-veterans-affairs/component-library/Modal';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import { focusElement } from 'platform/utilities/ui';

import AppointmentBlock from '../../../components/AppointmentBlock';
import Footer from '../../../components/Footer';
import BackToHome from '../../../components/BackToHome';

import { useFormRouting } from '../../../hooks/useFormRouting';

import { makeSelectVeteranData } from '../../../selectors';

const IntroductionDisplay = props => {
  useEffect(() => {
    focusElement('h1');
  }, []);
  const { router } = props;
  const { goToNextPage } = useFormRouting(router);
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);

  const [privacyActModalOpen, setPrivacyActModalOpen] = useState(false);

  const accordionContent = [
    {
      header: 'Will VA protect my personal health information?',
      body: (
        <>
          <p>
            We make every effort to keep your personal information private and
            secure.
          </p>
          <p>
            <a href="/privacy-policy/">
              Read more about privacy and security on VA.gov
            </a>
          </p>
          <p>
            You’re also responsible for protecting your personal health
            information. If you print or download your information—or share it
            electronically with others—you’ll need to take steps to protect it.
          </p>
          <p>
            <a href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/protecting-your-personal-health-information">
              Get tips for protecting your personal health information
            </a>
          </p>
        </>
      ),
    },
  ];
  const appointmentsDateTime = new Date(appointments[0].startTime);
  const privacyStatement = (
    <div>
      <h3>Privacy Act Statement</h3>
      <p>
        We ask you to provide the information in this questionnaire to help with
        your medical care (under law 38 U.S.C. Chapter 17). It’s your choice if
        you want to provide this information. If you choose not to provide this
        information, it may make it harder for us to prepare for your visit. But
        it won’t have any effect on your eligibility for any VA benefits or
        services. We may use and share the information you provide in this
        questionnaire in the ways we’re allowed to by law. We may make a
        “routine use” disclosure of the information as outlined in the Privacy
        Act system of records notice in "24VA10A7 Patient Medical Record – VA”
        and following the Veterans Health Administration (VHA) Notice of Privacy
        Practices.
      </p>
    </div>
  );
  const StartButton = () => (
    <div
      className="vads-u-margin-bottom--4 vads-u-display--block"
      data-testid="start-button"
    >
      <a
        className="vads-c-action-link--green"
        href="#answer"
        onKeyDown={useCallback(e => {
          if (e.key === ' ') {
            e.preventDefault();
            goToNextPage();
          }
        }, [])}
        onClick={useCallback(e => {
          e.preventDefault();
          goToNextPage();
        }, [])}
      >
        Answer questions
      </a>
    </div>
  );
  const additionalFooterInfo = (
    <>
      <p>
        <span className="vads-u-font-weight--bold">
          If you need to talk to someone right away or need emergency care,
        </span>{' '}
        call <Telephone contact="911" />,{' '}
        <span className="vads-u-font-weight--bold">or</span> call the Veterans
        Crisis hotline at <Telephone contact="8002738255" /> and select 1
      </p>
    </>
  );
  return (
    <div
      className="vads-l-grid-container vads-u-padding-top--3 vads-u-padding-bottom--3"
      data-testid="intro-wrapper"
    >
      <h1 tabIndex="-1" className="vads-u-margin-top--2">
        Answer pre-check-in questions
      </h1>
      <p className="vads-u-font-family--serif">
        Your answers will help us better prepare for your needs.
      </p>
      <AppointmentBlock appointments={appointments} />
      <h2 className="vads-u-margin-top--6">Start here</h2>
      <StartButton />
      {accordionContent && accordionContent.length ? (
        <va-accordion
          bordered
          className="vads-u-margin-top--1"
          data-testid="intro-accordion-group"
        >
          {accordionContent.map((accordionItem, index) => (
            <va-accordion-item
              level="2"
              header={accordionItem.header}
              key={index}
              data-testid="intro-accordion-item"
            >
              {accordionItem.body}
            </va-accordion-item>
          ))}
        </va-accordion>
      ) : (
        ''
      )}
      <div className="vads-u-margin-top--4">
        Expiration date:{' '}
        <span data-testid="expiration-date">
          {format(subDays(appointmentsDateTime, 1), 'M/dd/Y')}
        </span>
        <br />
        <a
          href="#privacy-modal"
          onClick={useCallback(
            e => {
              e.preventDefault();
              setPrivacyActModalOpen(true);
            },
            [setPrivacyActModalOpen],
          )}
        >
          Privacy Act Statement
        </a>
      </div>
      <Footer message={additionalFooterInfo} />
      <BackToHome />
      <Modal
        onClose={useCallback(() => setPrivacyActModalOpen(false), [
          setPrivacyActModalOpen,
        ])}
        visible={privacyActModalOpen}
        focusSelector="button"
        cssClass=""
        contents={privacyStatement}
      />
    </div>
  );
};

IntroductionDisplay.propTypes = {
  router: PropTypes.object,
};

export default IntroductionDisplay;

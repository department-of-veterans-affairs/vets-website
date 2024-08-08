import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';

import ExternalLink from './ExternalLink';
import { makeSelectApp } from '../selectors';

import { phoneNumbers, APP_NAMES } from '../utils/appConstants';

const ConfirmationAccordionBlock = ({ appointments = null }) => {
  const { t } = useTranslation();
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const modalityMessage = <p>{t('if-your-appointment-is-in-person')}</p>;
  const callMessage = (
    <p>
      <Trans
        i18nKey="or-you-can-call-MyVA411"
        components={[
          <va-telephone
            key={phoneNumbers.mainInfo}
            contact={phoneNumbers.mainInfo}
          />,
        ]}
      />
    </p>
  );
  const accordions = [
    {
      header: t('how-can-i-update-my-information'),
      body: (
        <>
          <strong>{t('contact-information')}</strong>
          {modalityMessage}
          <p>
            <Trans
              i18nKey="or-you-can-sign-in"
              components={[
                <ExternalLink
                  key="link"
                  href="https://www.va.gov/profile/personal-information"
                  hrefLang="en"
                  eventId="sign-in-from-accordion-clicked"
                  eventPrefix="nav"
                >
                  link
                </ExternalLink>,
              ]}
              values={{ link: t('sign-in') }}
            />
          </p>
          {callMessage}
          <strong>{t('emergency-and-next-of-kin-information')}</strong>
          {modalityMessage}
          {callMessage}
        </>
      ),
      open: false,
    },
    {
      header: t('why-do-i-need-to-make-sure-my-information-is-up-to-date'),
      body: (
        <p>
          {t(
            'we-can-better-prepare-for-your-appointment-and-contact-you-more-easily',
          )}
        </p>
      ),
      open: false,
    },
  ];
  if (
    appointments &&
    appointments.some(
      appointment =>
        appointment.clinicPhoneNumber && appointment.clinicPhoneNumber.length,
    )
  ) {
    accordions.push({
      header: t('what-if-i-have-questions-about-my-appointment'),
      testId: 'call-for-questions-accordion',
      body: (
        <>
          <p>{t('call-your-va-health-care-team')}:</p>
          {appointments.map((appointment, index) => {
            return (
              <React.Fragment key={index}>
                {appointment.clinicPhoneNumber && (
                  <p>
                    <Trans
                      i18nKey="facility-name-at-phone"
                      components={[
                        <va-telephone
                          key={appointment.clinicPhoneNumber}
                          contact={appointment.clinicPhoneNumber}
                        />,
                      ]}
                      values={{
                        facility:
                          appointment.clinicFriendlyName ||
                          appointment.clinicName,
                      }}
                    />
                  </p>
                )}
              </React.Fragment>
            );
          })}
        </>
      ),
      open: false,
    });
  }

  return (
    <va-accordion
      uswds
      bordered
      data-testid={
        app === APP_NAMES.PRE_CHECK_IN
          ? 'pre-check-in-accordions'
          : 'check-in-accordions'
      }
    >
      {accordions.map((accordion, index) => {
        return (
          <va-accordion-item
            header={accordion.header}
            key={index}
            open={accordion.open}
            uswds
            bordered
            data-testid={accordion.testId}
          >
            {accordion.body}
          </va-accordion-item>
        );
      })}
    </va-accordion>
  );
};

ConfirmationAccordionBlock.propTypes = {
  appointments: PropTypes.array,
  errorPage: PropTypes.bool,
};

export default ConfirmationAccordionBlock;

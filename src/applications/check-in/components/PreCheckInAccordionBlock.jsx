import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ExternalLink from './ExternalLink';

const PreCheckInAccordionBlock = ({
  demographicsUpToDate,
  emergencyContactUpToDate,
  nextOfKinUpToDate,
  appointments,
}) => {
  const { t } = useTranslation();
  let hasUpdates = false;
  let updateBody = '';
  if (demographicsUpToDate === 'no') {
    hasUpdates = true;
    updateBody = (
      <>
        <strong>{t('contact-information')}</strong>
        <p>
          {t('a-staff-member-will-help-you-on-the-day-of-your-appointment')}
        </p>
        <p>
          {t(
            'a-staff-member-will-help-you-on-the-day-of-your-appointment-or-you-can-login-to-your-va-account-to-update-your-contact-information-online',
            {
              link: (
                <ExternalLink
                  href="https://www.va.gov/profile/personal-information"
                  hrefLang="en"
                >
                  {t('login')}
                </ExternalLink>
              ),
            },
          )}
        </p>
      </>
    );
  }
  if (emergencyContactUpToDate === 'no' || nextOfKinUpToDate === 'no') {
    let title = '';
    if (emergencyContactUpToDate === 'no' && nextOfKinUpToDate === 'no') {
      title = t('emergency-and-next-of-kin-information');
    } else if (emergencyContactUpToDate === 'no') {
      title = t('emergency-information');
    } else {
      title = t('next-of-kin');
    }
    hasUpdates = true;
    updateBody = (
      <>
        {updateBody}
        <strong>{title}</strong>
        <p>
          {t('a-staff-member-will-help-you-on-the-day-of-your-appointment')}
        </p>
      </>
    );
  }
  const accordions = [
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
    {
      header: t('what-if-i-have-questions-about-my-appointment'),
      body: (
        <>
          <p>{t('call-your-va-health-care-team')}:</p>
          {appointments.map((appointment, index) => {
            return (
              <p key={index}>
                {appointment.clinicFriendlyName || appointment.clinicName} at{' '}
                <va-telephone contact={appointment.clinicPhoneNumber} />
              </p>
            );
          })}
        </>
      ),
      open: false,
    },
  ];
  if (hasUpdates) {
    accordions.unshift({
      header: t('how-can-i-update-my-information'),
      body: updateBody,
      open: true,
    });
  }
  return (
    <va-accordion open-single bordered data-testid="pre-check-in-accordions">
      {accordions.map((accordion, index) => {
        return (
          <va-accordion-item
            header={accordion.header}
            id={index}
            key={index}
            open={accordion.open}
          >
            {accordion.body}
          </va-accordion-item>
        );
      })}
      ;
    </va-accordion>
  );
};

PreCheckInAccordionBlock.propTypes = {
  appointments: PropTypes.array,
  demographicsUpToDate: PropTypes.string,
  emergencyContactUpToDate: PropTypes.string,
  nextOfKinUpToDate: PropTypes.string,
};

export default PreCheckInAccordionBlock;

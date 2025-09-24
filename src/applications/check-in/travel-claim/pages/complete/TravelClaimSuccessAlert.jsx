import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { utcToZonedTime } from 'date-fns-tz';
import { makeSelectForm } from '../../../selectors';

const TravelClaimSuccessAlert = () => {
  const selectForm = useMemo(makeSelectForm, []);
  const { data } = useSelector(selectForm);
  const { appointmentToFile } = data;
  const { t } = useTranslation();
  return (
    <div>
      <div className="vads-u-margin-y--4">
        <va-alert
          show-icon
          data-testid="travel-pay-message"
          status="success"
          uswds
        >
          <h2 slot="headline">{t('claim-submitted')}</h2>
          <p
            className="vads-u-margin-top--0"
            data-testid="travel-pay--claim--submitted"
          >
            {`${t('this-claim-is-for-your', {
              facility: appointmentToFile.facility,
              provider: appointmentToFile.doctorName
                ? ` ${'with'} ${appointmentToFile.doctorName}`
                : '',
              date: {
                date: utcToZonedTime(
                  appointmentToFile.startTime,
                  appointmentToFile.timezone,
                ),
                timezone: appointmentToFile.timezone,
              },
            })}${
              appointmentToFile.clinicFriendlyName
                ? `, ${appointmentToFile.clinicFriendlyName}`
                : ''
            }. 
          ${t('well-send-you-a-text-to-let-you-know')}
          `}
          </p>
          <p>{t('you-dont-need-to-do-anything-else')}</p>
        </va-alert>
      </div>
      <va-card data-testid="travel-pay-survey">
        <div>
          <h3 className="vads-u-margin-top--1">
            {t('consider-taking-our-pilot-feedback-survey')}
          </h3>
          <p>
            {t(
              'first-follow-the-link-below-to-the-sign-up-survey-with-our-recruitment-partner',
            )}
          </p>
          <p>
            {t(
              'next-wait-to-be-contacted-by-our-recruitment-partner-who-will-provide-the-feedback-survey',
            )}
          </p>
          <p>{t('our-recruiting-partner-will-provide-compensation')}</p>
          <p>
            <va-link-action
              href="https://docs.google.com/forms/d/e/1FAIpQLSfc5WDG28OfJH5MM6_k7hrUxzYnqyw4bQ5X1LNzlNssZ8yYwQ/viewform"
              text={t('start-the-sign-up-survey')}
              type="secondary"
            />
          </p>
        </div>
      </va-card>
    </div>
  );
};

export default TravelClaimSuccessAlert;

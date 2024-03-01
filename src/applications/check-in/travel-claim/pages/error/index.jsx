import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { makeSelectError, makeSelectTravelClaimData } from '../../../selectors';
import Wrapper from '../../../components/layout/Wrapper';
import ExternalLink from '../../../components/ExternalLink';

const Error = () => {
  const { t } = useTranslation();
  const selectError = useMemo(makeSelectError, []);
  const { error } = useSelector(selectError);

  const selectTravelClaimData = useMemo(makeSelectTravelClaimData, []);
  const appointments = useSelector(selectTravelClaimData);

  let appointmentDateTime = new Date();
  if (appointments.length > 0) {
    appointmentDateTime = new Date(appointments[0].startTime);
  }

  let alerts = [];
  let header = '';

  const FindOutLink = () => (
    <ExternalLink
      href="/health-care/how-to-file-a-va-travel-reimbursement-claim-online/"
      hrefLang="en"
      eventId="clicked-how-to-file-link-from-error"
      eventPrefix="nav"
    >
      {t('find-out-how-to-file--link')}
    </ExternalLink>
  );

  // @TODO remove this use error in switch
  const params = new URLSearchParams(window.location.search);
  const errorParam = params.get('error');

  switch (errorParam) {
    case 'max-validation':
      header = t('we-cant-match-your-information');
      alerts = [
        {
          alertType: 'error',
          testId: 'no-matching-information',
          message: (
            <>
              <p className="vads-u-margin-top--0">
                {t('were-sorry-we-couldnt-match-your-information')}
              </p>
              <p>{t('you-can-still-file-within')}</p>
              <FindOutLink />
            </>
          ),
        },
      ];
      break;
    case 'uuid-not-found':
      // Shown when POST sessions returns 404.
      header = t('this-link-has-expired');
      alerts = [
        {
          type: 'info',
          testId: 'uuid-not-found',
          message: (
            <>
              <p className="vads-u-margin-top--0">
                {t('we-cant-file-a-claim')}
              </p>
              <FindOutLink />
            </>
          ),
        },
      ];
      break;
    case 'completing-travel-submission':
      header = t('we-couldnt-file-your-claim');
      alerts = [
        {
          type: 'error',
          testId: 'something-went-wrong',
          alertSubheading: t('something-went-wrong-on-our-end'),
          message: (
            <>
              <p className="vads-u-margin-top--0">
                {t('were-sorry-we-couldnt-file-your-claim')}
              </p>
              <p>{t('or-you-can-still-file-within')}</p>
              <FindOutLink />
            </>
          ),
        },
      ];
      break;
    case 'cant-file-claim-type':
      header = t('we-cant-file-this-type');
      alerts = [
        {
          type: 'warning',
          testId: 'cant-file-claim-type',
          message: (
            <>
              <p className="vads-u-margin-top--0">
                {t('were-sorry-we-cant-file-this-type')}
              </p>
              <FindOutLink />
            </>
          ),
        },
      ];
      break;
    case 'already-filed-claim':
      header = t('you-already-filed-a-claim');
      alerts = [
        {
          type: 'warning',
          testId: 'already-filed-a-claim',
          message: (
            <>
              <p className="vads-u-margin-top--0">
                {t('were-sorry-you-alread-filed-a-claim', {
                  date: appointmentDateTime,
                })}
              </p>
              <ExternalLink
                href="http://va.gov/accessva-travel-claim"
                hrefLang="en"
                eventId="clicked-sign-in-to-btsss-from-error"
                eventPrefix="nav"
                target="_blank"
                rel="noreferrer"
              >
                {t('sign-in-to-btsss')}
              </ExternalLink>
            </>
          ),
        },
      ];
      break;
    default:
      // no-token
      // btsss-service-down
      header = t('something-went-wrong-on-our-end');
      alerts = [
        {
          type: 'error',
          testId: 'we-cant-file-a-claim',
          message: (
            <>
              <p className="vads-u-margin-top--0">
                {t('we-cant-file-a-claim')}
              </p>
              <FindOutLink />
            </>
          ),
        },
      ];
  }

  return (
    <Wrapper pageTitle={header}>
      {alerts.map((alert, index) => (
        <div key={`alert-${index}`} data-testid={error}>
          {alert.subHeading && (
            <h2 data-testid={`${alert.testId}-sub-heading`}>
              {alert.subHeading}
            </h2>
          )}
          {alert.type === 'text' ? (
            <div
              data-testid={`${alert.testId}-text`}
              className={index !== 0 ? 'vads-u-margin-top--2' : ''}
            >
              {alert.message}
            </div>
          ) : (
            <va-alert
              show-icon
              status={alert.type}
              data-testid={`${alert.testId}-alert`}
              class={index !== 0 ? 'vads-u-margin-top--2' : ''}
              uswds
              slim
            >
              <div>{alert.message}</div>
            </va-alert>
          )}
        </div>
      ))}
    </Wrapper>
  );
};

export default Error;

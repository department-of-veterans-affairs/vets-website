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

  // @TODO refactor using something else from redux
  const selectTravelClaimData = useMemo(makeSelectTravelClaimData, []);
  const appointments = useSelector(selectTravelClaimData);
  const appointmentDateTime =
    appointments.length > 0 ? new Date(appointments[0].startTime) : null;

  let alerts = [];
  let header = '';

  const FindOutLink = () => (
    <ExternalLink
      href="/health-care/how-to-file-a-va-travel-reimbursement-claim-online/"
      hrefLang="en"
      eventId="clicked-how-to-file-link-from-error"
      eventPrefix="nav"
      dataTestId="find-out-link"
    >
      {t('find-out-how-to-file--link')}
    </ExternalLink>
  );

  switch (error) {
    case 'max-validation':
      header = t('we-cant-match-your-information');
      alerts = [
        {
          type: 'error',
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
          testId: 'expired-link',
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
          subHeading: t('something-went-wrong-on-our-end'),
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
          testId: 'already-filed-claim',
          message: (
            <>
              <p
                data-testid="were-sorry-you-already-filed-a-claim"
                className="vads-u-margin-top--0"
              >
                {t('were-sorry-you-already-filed-a-claim', {
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
                dataTestId="sign-in-btsss-link"
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
      // bad-token
      // session-error
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
          <va-alert
            show-icon
            status={alert.type}
            data-testid={`${alert.testId}-alert`}
            uswds
            slim
          >
            <div>{alert.message}</div>
          </va-alert>
        </div>
      ))}
    </Wrapper>
  );
};

export default Error;

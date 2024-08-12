import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation, Trans } from 'react-i18next';
import { VaModal } from '@department-of-veterans-affairs/web-components/react-bindings';

import { useGetCheckInData } from '../../../hooks/useGetCheckInData';
import Wrapper from '../../layout/Wrapper';
import { APP_NAMES } from '../../../utils/appConstants';
import { makeSelectApp, makeSelectVeteranData } from '../../../selectors';
import { makeSelectFeatureToggles } from '../../../utils/selectors/feature-toggles';
import { useUpdateError } from '../../../hooks/useUpdateError';
import { useStorage } from '../../../hooks/useStorage';
import UpcomingAppointments from '../../UpcomingAppointments';
import UpcomingAppointmentsVista from '../../UpcomingAppointmentsVista';
import ActionItemDisplay from '../../ActionItemDisplay';
import ExternalLink from '../../ExternalLink';

import { intervalUntilNextAppointmentIneligibleForCheckin } from '../../../utils/appointment';

const AppointmentsPage = props => {
  const { router } = props;
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { isUpcomingAppointmentsEnabled } = useSelector(selectFeatureToggles);
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { t } = useTranslation();
  const { updateError } = useUpdateError();
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);
  const [loadedAppointments, setLoadedAppointments] = useState(appointments);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [privacyActModalOpen, setPrivacyActModalOpen] = useState(false);
  const { getCheckinComplete } = useStorage(APP_NAMES.CHECK_IN);

  const {
    isComplete,
    isLoading: isDataLoading,
    checkInDataError,
    refreshCheckInData,
  } = useGetCheckInData({
    refreshNeeded: false,
    router,
    app,
  });

  const refreshTimer = useRef(null);

  const getModalUrl = modalState => {
    const url = new URL(window.location.href);
    url.searchParams.set('modal', modalState);
    return `${url.pathname}${url.search}`;
  };

  const handleModalEvent = useCallback(
    (e, modalState) => {
      e.preventDefault();
      window.history.replaceState(null, null, getModalUrl(modalState));
      setPrivacyActModalOpen(modalState === 'open');
    },
    [setPrivacyActModalOpen],
  );

  useEffect(
    () => {
      if (getCheckinComplete(window)) {
        setRefresh(true);
      }
    },
    [getCheckinComplete],
  );

  useEffect(
    () => {
      setIsLoading(!isComplete);
      if (!loadedAppointments.length && !isComplete && !isDataLoading) {
        refreshCheckInData();
      } else if (loadedAppointments.length) {
        setIsLoading(false);
      }
    },
    [isComplete, isDataLoading, refreshCheckInData, loadedAppointments],
  );

  useEffect(
    () => {
      if (checkInDataError) {
        updateError(
          `error-fromlocation-${
            app === APP_NAMES.PRE_CHECK_IN ? 'precheckin' : 'dayof'
          }-appointments`,
        );
      }
    },
    [checkInDataError, updateError, app],
  );

  useEffect(
    () => {
      if (refresh) {
        refreshCheckInData();
        setLoadedAppointments([]);
        setRefresh(false);
      }
    },
    [refresh, refreshCheckInData],
  );

  useEffect(
    () => {
      if (app === APP_NAMES.CHECK_IN) {
        const refreshInterval = intervalUntilNextAppointmentIneligibleForCheckin(
          appointments,
        );

        // Refresh the page 5 seconds before the checkIn window expires.
        if (refreshInterval > 5000) {
          if (refreshTimer.current !== null) {
            clearTimeout(refreshTimer.current);
          }

          refreshTimer.current = setTimeout(
            () => refreshCheckInData(),
            refreshInterval - 5000,
          );
        }

        if (checkInDataError) {
          updateError('cant-retrieve-check-in-data');
        }
      }
    },
    [appointments, checkInDataError, updateError, refreshCheckInData, app],
  );

  if (isLoading) {
    window.scrollTo(0, 0);
    return (
      <div>
        <va-loading-indicator
          data-testid="loading-indicator"
          message={t('loading-your-appointment-information')}
        />
      </div>
    );
  }

  const accordionContent = [
    {
      header: t('what-if-cant-find-appointments-in-list'),
      body: (
        <>
          <p>
            {t('our-online-check-in-tool-doesnt-include-all--accordion-item')}
          </p>
          <p>
            <ExternalLink
              href="https://www.va.gov/my-health/appointments/"
              hrefLang="en"
            >
              {t('go-to-all-your-va-appointments')}
            </ExternalLink>
          </p>
        </>
      ),
      open: false,
    },
    {
      header: t('will-va-protect-my-personal-health-information'),
      body: (
        <>
          <p>
            {t(
              'we-make-every-effort-to-keep-your-personal-information-private-and-secure',
            )}
          </p>
          <p>
            <ExternalLink href="/privacy-policy/" hrefLang="en">
              {t('read-more-about-privacy-and-security-on-va-gov')}
            </ExternalLink>
          </p>
          <p>
            {t(
              'youre-also-responsible-for-protecting-your-personal-health-information',
            )}
          </p>
          <p>
            <ExternalLink
              href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/protecting-your-personal-health-information"
              hrefLang="en"
            >
              {t('get-tips-for-protecting-your-personal-health-information')}
            </ExternalLink>
          </p>
        </>
      ),
    },
  ];

  return (
    <Wrapper
      pageTitle={t('#-util-capitalize', { value: t('appointments') })}
      withBackButton
    >
      <ActionItemDisplay router={router} />
      {isUpcomingAppointmentsEnabled ? (
        <UpcomingAppointments router={router} refresh={refresh} />
      ) : (
        <UpcomingAppointmentsVista
          router={router}
          appointments={appointments}
        />
      )}
      <div className="vads-u-display--flex vads-u-align-itmes--stretch vads-u-flex-direction--column vads-u-padding-top--1p5 vads-u-padding-bottom--5">
        <p data-testid="update-text">
          <Trans
            i18nKey="latest-update"
            components={{ bold: <strong /> }}
            values={{ date: new Date() }}
          />
        </p>
        <va-button
          uswds
          text={t('refresh')}
          big
          onClick={() => setRefresh(true)}
          secondary
          data-testid="refresh-appointments-button"
        />
      </div>
      <va-accordion uswds bordered data-testid="appointments-accordions">
        {accordionContent.map((accordion, index) => (
          <va-accordion-item
            key={index}
            header={accordion.header}
            open={accordion.open}
            uswds
            bordered
          >
            {accordion.body}
          </va-accordion-item>
        ))}
      </va-accordion>
      <div className="vads-u-margin-top--4">
        <a
          data-testid="privacy-act-statement-link"
          href="/health-care/appointment-pre-check-in/introduction?modal=open"
          onClick={e => handleModalEvent(e, 'open')}
        >
          {t('privacy-act-statement')}
        </a>
      </div>
      <VaModal
        modalTitle={t('privacy-act-statement')}
        onCloseEvent={e => handleModalEvent(e, 'closed')}
        visible={privacyActModalOpen}
        initialFocusSelector="button"
      >
        <p data-testid="privacy-act-statement-text">
          {t('privacy-act-statement-text')}
        </p>
      </VaModal>
    </Wrapper>
  );
};

AppointmentsPage.propTypes = {
  router: PropTypes.object,
};

export default AppointmentsPage;

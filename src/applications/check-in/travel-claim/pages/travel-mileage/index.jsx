import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import { useFormRouting } from '../../../hooks/useFormRouting';
import { createAnalyticsSlug } from '../../../utils/analytics';
import { setFormData } from '../../../actions/travel-claim';
import { sortAppointmentsByStartTime } from '../../../utils/appointment';
import { makeSelectForm, makeSelectVeteranData } from '../../../selectors';
import { APP_NAMES } from '../../../utils/appConstants';
import Wrapper from '../../../components/layout/Wrapper';
import BackButton from '../../../components/BackButton';
import SingleAppointmentBody from './SingleAppointmentBody';
import MultipleAppointmentBody from './MultiAppointmentBody';
import ExternalLink from '../../../components/ExternalLink';

const TravelMileage = props => {
  const { router } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    goToNextPage,
    goToPreviousPage,
    getPreviousPageFromRouter,
  } = useFormRouting(router);
  const selectForm = useMemo(makeSelectForm, []);
  const { data } = useSelector(selectForm);
  const { appointmentToFile } = data;
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);
  const sortedAppointments = sortAppointmentsByStartTime(appointments);
  const multipleAppointments = appointments.length > 1;
  const [selectedAppointment, setSelectedAppointment] = useState(
    multipleAppointments ? null : appointments[0],
  );
  const [error, setError] = useState(false);

  useEffect(
    () => {
      if (appointmentToFile) {
        setSelectedAppointment(appointmentToFile);
      }
    },
    [appointmentToFile, setSelectedAppointment],
  );
  const continueClick = useCallback(
    () => {
      if (selectedAppointment) {
        recordEvent({
          event: createAnalyticsSlug(
            'continue-from-travel-mileage-clicked',
            'nav',
            APP_NAMES.TRAVEL_CLAIM,
          ),
        });
        dispatch(setFormData({ appointmentToFile: selectedAppointment }));
        goToNextPage();
      } else {
        setError(true);
      }
    },
    [dispatch, goToNextPage, selectedAppointment, setError],
  );
  let header = t('file-mileage-only-claim-todays-appointment', {
    count: 1,
  });
  if (multipleAppointments) {
    header = t('select-appointment-to-file-today');
  }
  return (
    <>
      <BackButton
        router={router}
        action={goToPreviousPage}
        prevUrl={getPreviousPageFromRouter()}
      />
      <Wrapper
        pageTitle={header}
        classNames="travel-page"
        withBackButton
        testID="travel-mileage-page"
      >
        {/* Setting state value here for testing purposes. Could not mock hook with our test setup. */}
        <div data-testid={JSON.stringify(selectedAppointment)}>
          <va-alert-expandable
            status="info"
            trigger={t('how-we-calculate-mileage')}
            class="vads-u-margin-y--4"
          >
            <ul>
              <li>{t('we-pay-round-trip-mileage-for-scheduled')}</li>
              <li>{t('we-may--only-pay-return-for-unscheduled')}</li>
            </ul>
            <ExternalLink
              href="https://www.va.gov/resources/reimbursed-va-travel-expenses-and-mileage-rate/#mileage-reimbursement-rate"
              hrefLang="en"
              target="_blank"
              rel="noreferrer"
              className="vads-u-padding-top--3 vads-u-display--block"
            >
              {t('check-current-mileage-rates')}
            </ExternalLink>
          </va-alert-expandable>
          {multipleAppointments ? (
            <>
              <MultipleAppointmentBody
                error={error}
                appointments={sortedAppointments}
                selectedAppointment={selectedAppointment}
                setSelectedAppointment={setSelectedAppointment}
              />
            </>
          ) : (
            <SingleAppointmentBody appointment={sortedAppointments[0]} />
          )}
          <va-additional-info
            trigger={t('if-you-have-other-expenses-to-claim')}
            uswds
            class="vads-u-margin-bottom--2"
          >
            <Trans
              i18nKey="if-you-need-submit-receipts-other-expenses"
              components={[
                <span key="bold" className="vads-u-font-weight--bold" />,
              ]}
            />
          </va-additional-info>
          <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-align-itmes--stretch small-screen:vads-u-flex-direction--row">
            <va-button
              uswds
              big
              onClick={continueClick}
              continue
              data-testid="continue-button"
              class="vads-u-margin-top--2"
              value="continue"
            />
            <va-button
              uswds
              big
              secondary
              onClick={goToPreviousPage}
              data-testid="back-button"
              class="vads-u-margin-top--2 small-screen:vads-u-order--first"
              value="back"
              back
            />
          </div>
        </div>
      </Wrapper>
    </>
  );
};

TravelMileage.propTypes = {
  router: PropTypes.object,
};

export default TravelMileage;

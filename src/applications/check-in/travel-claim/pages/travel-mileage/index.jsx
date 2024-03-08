import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import { useFormRouting } from '../../../hooks/useFormRouting';
import { createAnalyticsSlug } from '../../../utils/analytics';
import { setFacilityToFile } from '../../../actions/travel-claim';
import { hasMultipleFacilities } from '../../../utils/appointment';
import { makeSelectCurrentContext, makeSelectForm } from '../../../selectors';
import { APP_NAMES } from '../../../utils/appConstants';
import Wrapper from '../../../components/layout/Wrapper';
import BackButton from '../../../components/BackButton';
import SingleFacilityBody from './SingleFacilityBody';
import MultipleFacilityBody from './MultiFacilityBody';

const TravelMileage = props => {
  const { router } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    goToNextPage,
    goToPreviousPage,
    getPreviousPageFromRouter,
  } = useFormRouting(router);
  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { eligibleToFile } = useSelector(selectCurrentContext);
  const selectForm = useMemo(makeSelectForm, []);
  const { data } = useSelector(selectForm);
  const { facilitiesToFile } = data;

  const multipleFacilities = hasMultipleFacilities(eligibleToFile);
  let appointmentsByFacility;
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [error, setError] = useState(false);

  useEffect(
    () => {
      if (!multipleFacilities) {
        const firstAppointment = eligibleToFile[0];
        setSelectedFacilities([
          {
            stationNo: firstAppointment.stationNo,
            startTime: firstAppointment.startTime,
            multipleAppointments: eligibleToFile.length > 1,
          },
        ]);
      }
      if (facilitiesToFile && facilitiesToFile.length) {
        setSelectedFacilities(facilitiesToFile);
      }
    },
    [
      eligibleToFile,
      facilitiesToFile,
      multipleFacilities,
      setSelectedFacilities,
    ],
  );
  const continueClick = useCallback(
    () => {
      if (selectedFacilities.length) {
        recordEvent({
          event: createAnalyticsSlug(
            'continue-from-travel-mileage-clicked',
            'nav',
            APP_NAMES.TRAVEL_CLAIM,
          ),
        });
        dispatch(setFacilityToFile({ facilitiesToFile: selectedFacilities }));
        goToNextPage();
      } else {
        setError(true);
      }
    },
    [dispatch, goToNextPage, selectedFacilities, setError],
  );
  const formatAppointment = appointment => {
    const appointmentLabel = appointment.clinicStopCodeName
      ? `${appointment.clinicStopCodeName} ${t('appointment')}`
      : t('VA-appointment');
    const providerLabel =
      appointment.doctorName && ` with ${appointment.doctorName}`;
    return `${appointmentLabel}${providerLabel}`;
  };
  let header = t('file-mileage-only-claim-todays-appointment', {
    count: eligibleToFile.length,
  });
  if (multipleFacilities) {
    appointmentsByFacility = {};
    eligibleToFile.forEach(appointment => {
      if (appointment.stationNo in appointmentsByFacility) {
        appointmentsByFacility[appointment.stationNo].push(appointment);
      } else {
        appointmentsByFacility[appointment.stationNo] = [appointment];
      }
    });
    header = t('select-appointments-to-file-today');
  }
  return (
    <>
      <BackButton
        router={router}
        action={goToPreviousPage}
        prevUrl={getPreviousPageFromRouter()}
      />
      <Wrapper pageTitle={header} classNames="travel-page" withBackButton>
        {/* Setting state value here for testing purposes. Could not mock hook with our test setup. */}
        <div data-testid={JSON.stringify(selectedFacilities)}>
          {multipleFacilities ? (
            <MultipleFacilityBody
              error={error}
              formatAppointment={formatAppointment}
              appointmentsByFacility={appointmentsByFacility}
              selectedFacilities={selectedFacilities}
              setSelectedFacilities={setSelectedFacilities}
            />
          ) : (
            <SingleFacilityBody
              facility={eligibleToFile[0].facility}
              appointments={eligibleToFile}
              formatAppointment={formatAppointment}
            />
          )}
          <va-additional-info
            trigger={t('if-you-have-other-expenses-to-claim')}
            uswds
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

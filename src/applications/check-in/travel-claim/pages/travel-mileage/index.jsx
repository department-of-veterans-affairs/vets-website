import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { createAnalyticsSlug } from '../../../utils/analytics';
import { setFacilityToFile } from '../../../actions/travel-claim';
import { hasMultipleFacilities } from '../../../utils/appointment';
import { makeSelectCurrentContext, makeSelectForm } from '../../../selectors';
import { APP_NAMES } from '../../../utils/appConstants';
import Wrapper from '../../../components/layout/Wrapper';
import BackButton from '../../../components/BackButton';

import { useFormRouting } from '../../../hooks/useFormRouting';

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
  const onCheck = useCallback(
    e => {
      const stationNo = e.target.value;
      const { checked } = e.detail;
      const appointments = appointmentsByFacility[stationNo];
      const firstAppointment = appointments[0];
      const value = {
        stationNo: firstAppointment.stationNo,
        startTime: firstAppointment.startTime,
        multipleAppointments: appointments.length > 1,
      };
      let newFacilities;
      if (checked) {
        newFacilities = [...selectedFacilities, value];
      } else {
        newFacilities = selectedFacilities.filter(
          fac => fac.stationNo !== value.stationNo,
        );
      }
      setSelectedFacilities(newFacilities);
    },
    [appointmentsByFacility, selectedFacilities],
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
  let body = (
    <div
      className="vads-u-border-top--1px vads-u-border-bottom--1px vads-u-padding-y--1 vads-u-margin-y--2 vads-u-border-color--gray-light"
      data-testid="single-fac-context"
    >
      <span className="vads-u-font-weight--bold">
        {eligibleToFile[0].facility}
      </span>
      <div className="vads-u-margin-y--1">
        {eligibleToFile.map(appointment => (
          <p
            className="vads-u-margin--0"
            key={appointment.appointmentIen}
            data-testid={`appointment-list-item-${appointment.appointmentIen}`}
          >
            {formatAppointment(appointment)}
          </p>
        ))}
      </div>
    </div>
  );
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
    body = (
      <div data-testid="multi-fac-context">
        <p>{t('if-youre-filing-only-mileage-no-other-file-all-claims-now')}</p>
        <va-checkbox-group
          data-testid="checkbox-group"
          error={error ? t('select-one-or-more-appointments') : ''}
          uswds
          class="vads-u-margin-top--0 vads-u-margin-bottom--4"
        >
          {Object.keys(appointmentsByFacility).map(facility => (
            <VaCheckbox
              data-testid={`checkbox-${facility}`}
              key={facility}
              uswds
              tile
              value={facility}
              label={appointmentsByFacility[facility][0].facility}
              checkbox-description={appointmentsByFacility[facility].map(
                appointment => ` ${formatAppointment(appointment)}`,
              )}
              onVaChange={onCheck}
              checked={selectedFacilities.some(
                fac => fac.stationNo === facility,
              )}
            />
          ))}
        </va-checkbox-group>
      </div>
    );
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
          {body}
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

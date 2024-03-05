import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';

import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setFacilityToFile } from '../../../actions/travel-claim';
import { hasMultipleFacilities } from '../../../utils/appointment';
import { makeSelectCurrentContext } from '../../../selectors';
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

  const multipleFacilities = hasMultipleFacilities(eligibleToFile);
  const appointmentsByFacility = {};
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
    },
    [eligibleToFile, multipleFacilities, setSelectedFacilities],
  );
  const continueClick = useCallback(
    () => {
      if (selectedFacilities) {
        dispatch(setFacilityToFile({ facilitiesToFile: selectedFacilities }));
        goToNextPage();
      } else {
        setError(true);
      }
    },
    [dispatch, goToNextPage, selectedFacilities, setError],
  );
  // move all this to a useEffect and manage selected values in state
  const onCheck = useCallback(
    e => {
      const stationNo = e.target.value;
      const appointments = appointmentsByFacility[stationNo];
      const firstAppointment = appointments[0];
      const value = {
        stationNo: firstAppointment.stationNo,
        startTime: firstAppointment.startTime,
        multipleAppointments: appointments.length > 1,
      };
      setSelectedFacilities([...selectedFacilities, value]);
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
    <div className="vads-u-border-top--1px vads-u-border-bottom--1px vads-u-padding-y--1 vads-u-margin-y--2 vads-u-border-color--gray-light">
      <span className="vads-u-font-weight--bold">
        {eligibleToFile[0].facility}
      </span>
      <div className="vads-u-margin-y--1">
        {eligibleToFile.map(appointment => (
          <p className="vads-u-margin--0" key={appointment.appointmentIen}>
            {formatAppointment(appointment)}
          </p>
        ))}
      </div>
    </div>
  );
  if (multipleFacilities) {
    eligibleToFile.forEach(appointment => {
      if (appointment.stationNo in appointmentsByFacility) {
        appointmentsByFacility[appointment.stationNo].push(appointment);
      } else {
        appointmentsByFacility[appointment.stationNo] = [appointment];
      }
    });
    header = t('select-appointments-to-file-today');
    body = (
      <>
        {/* <p>{t('if-youre-filing-only-mileage-no-other-file-all-claims-now')}</p> */}
        <va-checkbox-group
          error={error ? t('select-one-or-more-appointments') : ''}
          uswds
          class="vads-u-margin-top--0 vads-u-margin-bottom--4"
          label={t('if-youre-filing-only-mileage-no-other-file-all-claims-now')}
        >
          {Object.keys(appointmentsByFacility).map((facility, index) => (
            <VaCheckbox
              key={facility}
              uswds
              tile
              value={facility}
              label={appointmentsByFacility[facility][0].facility}
              checkbox-description={appointmentsByFacility[facility].map(
                appointment => ` ${formatAppointment(appointment)}`,
              )}
              onVaChange={onCheck}
              class={index === 0 ? 'vads-u-margin-top--4' : ''}
            />
          ))}
        </va-checkbox-group>
      </>
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
            data-testid="continue-button"
            class="vads-u-margin-top--2"
            value="back"
            back
          />
        </div>
      </Wrapper>
    </>
  );
};

TravelMileage.propTypes = {
  router: PropTypes.object,
};

export default TravelMileage;

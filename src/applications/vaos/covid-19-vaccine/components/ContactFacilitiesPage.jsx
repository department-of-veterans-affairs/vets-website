import React, { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';

import {
  openContactFacilitiesPage,
  routeToPreviousAppointmentPage,
} from '../redux/actions';
import { selectContactFacilitiesPageInfo } from '../redux/selectors';
import {
  FACILITY_SORT_METHODS,
  FETCH_STATUS,
  GA_PREFIX,
} from '../../utils/constants';
import ErrorMessage from '../../components/ErrorMessage';
import State from '../../components/State';
import FacilityPhone from '../../components/FacilityPhone';
import { getFacilityIdFromLocation } from '../../services/location/index';
import { getRealFacilityId } from '../../utils/appointment';
import InfoAlert from '../../components/InfoAlert';
import NewTabAnchor from '../../components/NewTabAnchor';
import recordEvent from 'platform/monitoring/record-event';
import { hasValidCovidPhoneNumber } from '../../services/appointment';

const pageKey = 'contactFacilities';

export default function ContactFacilitiesPage() {
  const dispatch = useDispatch();
  const {
    facilitiesStatus,
    facilities,
    sortMethod,
    canUseVaccineFlow,
  } = useSelector(selectContactFacilitiesPageInfo, shallowEqual);

  const history = useHistory();
  const loadingFacilities =
    facilitiesStatus === FETCH_STATUS.loading ||
    facilitiesStatus === FETCH_STATUS.notStarted;
  const pageTitle = canUseVaccineFlow
    ? 'We can’t schedule your second dose online'
    : 'Contact a facility';
  useEffect(
    () => {
      document.title = `${pageTitle} | Veterans Affairs`;
      dispatch(openContactFacilitiesPage());
    },
    [openContactFacilitiesPage],
  );

  useEffect(
    () => {
      scrollAndFocus();
    },
    [facilitiesStatus],
  );

  if (facilitiesStatus === FETCH_STATUS.failed) {
    return <ErrorMessage level="1" />;
  }

  if (loadingFacilities) {
    return <LoadingIndicator setFocus message="Finding locations" />;
  }

  const facilitiesToShow =
    sortMethod === FACILITY_SORT_METHODS.distanceFromResidential ? 2 : 5;

  return (
    <div>
      {canUseVaccineFlow && (
        <>
          <h1>{pageTitle}</h1>
          <InfoAlert
            backgroundOnly
            headline="If you got your first dose:"
            status="warning"
          >
            <ul>
              <li>
                <strong>At a VA health facility,</strong> call that facility to
                schedule your second dose.
              </li>
              <li>
                <strong>Outside of VA,</strong> you'll need to go to the same
                location to get your second dose.
              </li>
            </ul>
          </InfoAlert>
        </>
      )}
      {!canUseVaccineFlow && (
        <>
          <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
          <p>
            Contact one of your registered VA facilities to schedule your
            vaccine appointment.
          </p>
        </>
      )}
      <h2 className="vads-u-font-size--h3" id="vaos-facilities-label">
        Your facilities
      </h2>
      <ul className="usa-unstyled-list" aria-labelledby="vaos-facilities-label">
        {facilities.slice(0, facilitiesToShow).map(facility => (
          <li key={facility.id} className="vads-u-margin-top--2">
            <h3 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
              <NewTabAnchor
                href={`/find-locations/facility/vha_${getRealFacilityId(
                  getFacilityIdFromLocation(facility),
                )}`}
              >
                {facility.name}
              </NewTabAnchor>
            </h3>
            {facility.address?.city}, <State state={facility.address?.state} />
            <br />
            {!!facility.legacyVAR[sortMethod] && (
              <>
                {facility.legacyVAR[sortMethod]} miles
                <br />
              </>
            )}
            <FacilityPhone
              contact={
                hasValidCovidPhoneNumber(facility)
                  ? facility.telecom.find(t => t.system === 'covid')?.value
                  : facility.telecom.find(t => t.system === 'phone')?.value
              }
              level={3}
            />
          </li>
        ))}
      </ul>
      {!canUseVaccineFlow && (
        <InfoAlert
          backgroundOnly
          className="vads-u-margin-bottom--3"
          headline="Find a vaccine walk-in clinic near you"
          status="info"
        >
          <p>
            You can go to a VA facility's vaccine clinic during walk-in hours to
            get the COVID-19 vaccine. You don't need an appointment, but be sure
            to check the facility's walk-in hours before you go.
          </p>
          <a
            href="/find-locations/?facilityType=health&serviceType=Covid19Vaccine"
            onClick={() => {
              recordEvent({
                event: `${GA_PREFIX}-COVID-19-vaccines-at-VA-link-clicked`,
              });
            }}
          >
            Find VA facilities near you that offer COVID-19 vaccines
          </a>
        </InfoAlert>
      )}
      <ProgressButton
        onButtonClick={() =>
          dispatch(routeToPreviousAppointmentPage(history, pageKey))
        }
        buttonText="Back"
        buttonClass="usa-button-secondary"
        beforeText="«"
      />
    </div>
  );
}

import React, { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import ProgressButton from '@department-of-veterans-affairs/platform-forms-system/ProgressButton';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { openContactFacilitiesPage } from '../redux/actions';
import { selectContactFacilitiesPageInfo } from '../redux/selectors';
import { selectFeatureBreadcrumbUrlUpdate } from '../../redux/selectors';
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
import { hasValidCovidPhoneNumber } from '../../services/appointment';
import { routeToPreviousAppointmentPage } from '../flow';

const pageKey = 'contactFacilities';

export default function ContactFacilitiesPage({ changeCrumb }) {
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );

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
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    dispatch(openContactFacilitiesPage());
  }, [openContactFacilitiesPage]);

  useEffect(() => {
    scrollAndFocus();
    if (featureBreadcrumbUrlUpdate) {
      changeCrumb(pageTitle);
    }
  }, [facilitiesStatus]);

  if (facilitiesStatus === FETCH_STATUS.failed) {
    return <ErrorMessage level="1" />;
  }

  if (loadingFacilities) {
    return <va-loading-indicator set-focus message="Finding locations" />;
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
            headline="Call to schedule your second dose"
            status="warning"
          >
            <p>Here's what to know:</p>
            <ul>
              <li>You must receive the same vaccine for both doses.</li>
              <li>
                We encourage you to go to the same location for both doses. But
                even if you got your first dose outside of VA, you can go to any
                VA facility that offers the same type of vaccine.
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
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul
        aria-labelledby="vaos-facilities-label"
        className="usa-unstyled-list"
        role="list"
      >
        {facilities.slice(0, facilitiesToShow).map(facility => (
          <li key={facility.id} className="vads-u-margin-top--2">
            <h3 className="vads-u-margin-bottom--0">
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
          <va-link
            href="/find-locations/?facilityType=health&serviceType=Covid19Vaccine"
            onClick={() => {
              recordEvent({
                event: `${GA_PREFIX}-COVID-19-vaccines-at-VA-link-clicked`,
              });
            }}
            text="Find VA facilities near you that offer COVID-19 vaccines"
            data-testid="find-facilities-link"
          />
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

ContactFacilitiesPage.propTypes = {
  changeCrumb: PropTypes.func,
};

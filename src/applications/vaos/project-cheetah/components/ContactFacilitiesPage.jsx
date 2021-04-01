import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';

import * as actions from '../redux/actions';
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
import NewTabAnchor from '../../components/NewTabAnchor';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import recordEvent from 'platform/monitoring/record-event';

const pageKey = 'contactFacilities';

function ContactFacilitiesPage({
  openContactFacilitiesPage,
  facilitiesStatus,
  facilities,
  routeToPreviousAppointmentPage,
  sortMethod,
  canUseVaccineFlow,
}) {
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
      openContactFacilitiesPage();
    },
    [openContactFacilitiesPage],
  );

  useEffect(
    () => {
      scrollAndFocus();
    },
    [facilitiesStatus],
  );

  const goBack = () => routeToPreviousAppointmentPage(history, pageKey);

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
          <AlertBox
            className="vads-u-margin-top--0"
            level="1"
            status="warning"
            backgroundOnly
            headline={pageTitle}
          >
            <strong>If you got your first dose</strong>:
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
          </AlertBox>
        </>
      )}
      {!canUseVaccineFlow && (
        <>
          <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
          <p id="vaos-facilities-label">
            Contact one of your registered VA facilities to schedule your
            vaccine appointment.
          </p>
        </>
      )}
      <h2 className="vads-u-font-size--h3">Your facilities</h2>
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
            <h4 className="vads-u-font-family--sans vads-u-font-size--base vads-u-display--inline">
              Main phone:
            </h4>{' '}
            <FacilityPhone
              contact={facility.telecom.find(t => t.system === 'phone')?.value}
            />
          </li>
        ))}
      </ul>
      <p className="vads-u-margin-y--3">
        <NewTabAnchor href="/find-locations">
          Search for more facilities
        </NewTabAnchor>
      </p>
      {!canUseVaccineFlow && (
        <AlertBox
          className="vads-u-margin-bottom--1p5"
          level="2"
          status="info"
          backgroundOnly
          headline="Sign up to stay informed"
        >
          <p>
            We’re working to provide COVID-19 vaccines to Veterans as quickly
            and safely as we can, based on CDC guidelines and available supply.
          </p>
          <a
            href="/health-care/covid-19-vaccine"
            onClick={() => {
              recordEvent({
                event: `${GA_PREFIX}-COVID-19-vaccines-at-VA-link-clicked`,
              });
            }}
          >
            Learn how to stay informed about COVID-19 vaccines at VA.
          </a>
        </AlertBox>
      )}
      <ProgressButton
        onButtonClick={goBack}
        buttonText="Back"
        buttonClass="usa-button-secondary"
        beforeText="«"
      />
    </div>
  );
}

function mapStateToProps(state) {
  return selectContactFacilitiesPageInfo(state);
}

const mapDispatchToProps = {
  openContactFacilitiesPage: actions.openContactFacilitiesPage,
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactFacilitiesPage);

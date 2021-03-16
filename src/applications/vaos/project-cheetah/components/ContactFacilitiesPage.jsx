import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';

import * as actions from '../redux/actions';
import { selectContactFacilitiesPageInfo } from '../redux/selectors';
import { FACILITY_SORT_METHODS, FETCH_STATUS } from '../../utils/constants';
import ErrorMessage from '../../components/ErrorMessage';
import State from '../../components/State';
import FacilityPhone from '../../components/FacilityPhone';
import { getFacilityIdFromLocation } from '../../services/location/index';
import { getRealFacilityId } from '../../utils/appointment';
import NewTabAnchor from '../../components/NewTabAnchor';

const pageKey = 'contactFacilities';
const pageTitle = 'Contact a facility';

function ContactFacilitiesPage({
  openContactFacilitiesPage,
  facilitiesStatus,
  facilities,
  routeToPreviousAppointmentPage,
  sortMethod,
  isEligible,
}) {
  const history = useHistory();
  const loadingFacilities =
    facilitiesStatus === FETCH_STATUS.loading ||
    facilitiesStatus === FETCH_STATUS.notStarted;

  useEffect(
    () => {
      document.title = `${pageTitle} | Veterans Affairs`;
      scrollAndFocus();
      openContactFacilitiesPage();
    },
    [openContactFacilitiesPage],
  );

  const goBack = () => routeToPreviousAppointmentPage(history, pageKey);

  const title = <h1 className="vads-u-font-size--h2">{pageTitle}</h1>;

  if (facilitiesStatus === FETCH_STATUS.failed) {
    return (
      <div>
        {title}
        <ErrorMessage level="2" />
      </div>
    );
  }

  if (loadingFacilities) {
    return (
      <div>
        {title}
        <LoadingIndicator message="Finding locations" />
      </div>
    );
  }

  const facilitiesToShow =
    sortMethod === FACILITY_SORT_METHODS.distanceFromResidential ? 2 : 5;

  return (
    <div>
      {title}
      <p id="vaos-facilities-label">
        {!isEligible
          ? 'None of your registered facilities offer vaccination appointments online. Contact a VA facility that offers vaccine appointments.'
          : 'Only first doses of the COVID-19 vaccine can be scheduled online. If you need a second dose, please schedule with a VA facility.'}
      </p>
      <ul className="usa-unstyled-list" aria-labelledby="vaos-facilities-label">
        {facilities.slice(0, facilitiesToShow).map(facility => (
          <li key={facility.id} className="vads-u-margin-top--2">
            <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
              <NewTabAnchor
                href={`/find-locations/facility/vha_${getRealFacilityId(
                  getFacilityIdFromLocation(facility),
                )}`}
              >
                {facility.name}
              </NewTabAnchor>
            </h2>
            {facility.address?.city}, <State state={facility.address?.state} />
            <br />
            {!!facility.legacyVAR[sortMethod] && (
              <>
                {facility.legacyVAR[sortMethod]} miles
                <br />
              </>
            )}
            <h3 className="vads-u-font-family--sans vads-u-font-size--base vads-u-display--inline">
              Main phone:
            </h3>{' '}
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

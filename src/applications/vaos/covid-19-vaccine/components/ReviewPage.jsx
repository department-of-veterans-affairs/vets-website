import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import LoadingButton from '@department-of-veterans-affairs/platform-site-wide/LoadingButton';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { FETCH_STATUS } from '../../utils/constants';
import FacilityAddress from '../../components/FacilityAddress';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { getRealFacilityId } from '../../utils/appointment';
import { getReviewPage } from '../redux/selectors';
import getNewBookingFlow from '../flow';
import State from '../../components/State';
import NewTabAnchor from '../../components/NewTabAnchor';
import InfoAlert from '../../components/InfoAlert';
import { confirmAppointment } from '../redux/actions';
import AppointmentDate from '../../new-appointment/components/ReviewPage/AppointmentDate';
import { selectFeatureBreadcrumbUrlUpdate } from '../../redux/selectors';

const pageTitle = 'Review your appointment details';

function handleClick(history, contactInfo) {
  return e => {
    // Stop default behavior for anchor tag since we are using React routing.
    e.preventDefault();

    history.push(contactInfo.url);
  };
}

export default function ReviewPage({ changeCrumb }) {
  const {
    data,
    facility,
    facilityDetails,
    clinic,
    submitStatus,
    submitStatusVaos400,
  } = useSelector(state => getReviewPage(state), shallowEqual);
  const history = useHistory();
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );

  const { date1, vaFacility } = data;
  const dispatch = useDispatch();
  const { root, contactInfo } = useSelector(getNewBookingFlow);

  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    if (featureBreadcrumbUrlUpdate) {
      changeCrumb(pageTitle);
    }
  }, []);

  useEffect(
    () => {
      if (submitStatus === FETCH_STATUS.failed) {
        scrollAndFocus('.info-alert');
      }
    },
    [submitStatus],
  );

  if (!vaFacility) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <h1>{pageTitle}</h1>
      <p className="vads-u-margin-top--1 vads-u-margin-bottom--4">
        Make sure the information is correct. Then confirm your appointment.
      </p>
      <h2 className="vads-u-margin-bottom--0 vads-u-margin-top--3 vads-u-font-size--h3">
        COVID-19 vaccine
      </h2>
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <div className="vads-l-grid-container vads-u-padding--0">
        <div className="vads-l-row vads-u-justify-content--space-between">
          <div className="vads-u-flex--1 vads-u-padding-right--1">
            <AppointmentDate dates={date1} facilityId={data.vaFacility} />
          </div>
        </div>
      </div>
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <div className="vads-l-grid-container vads-u-padding--0">
        <div className="vads-l-row vads-u-justify-content--space-between">
          <div className="vads-u-flex--1 vads-u-padding-right--1">
            <h3 className="vaos-appts__block-label">{facility.name}</h3>
            {clinic.serviceName}
            <br />
            {/* removes falsy value from address array */}
            {facility.address?.line?.filter(Boolean).join(', ')}
            <br />
            {facility.address?.city}, <State state={facility.address?.state} />
          </div>
        </div>
      </div>
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <div className="vads-l-grid-container vads-u-padding--0">
        <div className="vads-l-row vads-u-justify-content--space-between">
          <div className="vads-u-flex--1 vads-u-padding-right--1">
            <h3 className="vaos-appts__block-label">Your contact details</h3>
            <div data-dd-privacy="mask">
              {data.email}
              <br />
              <VaTelephone
                data-dd-privacy="mask"
                notClickable
                contact={data.phoneNumber}
                data-testid="patient-telephone"
              />
            </div>
          </div>
          <va-link
            href={`${root.url}/schedule/covid-vaccine/${contactInfo.url}`}
            onClick={handleClick(history, contactInfo)}
            aria-label="Edit contact information"
            text="Edit"
            data-testid="edit-contact-information-link"
          />
        </div>
      </div>
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <div className="vads-u-margin-y--2">
        <LoadingButton
          disabled={
            submitStatus === FETCH_STATUS.succeeded ||
            submitStatus === FETCH_STATUS.failed
          }
          isLoading={submitStatus === FETCH_STATUS.loading}
          loadingText="Submission in progress"
          className="usa-button usa-button-primary"
          onClick={() => dispatch(confirmAppointment(history))}
        >
          Confirm appointment
        </LoadingButton>
      </div>
      {submitStatus === FETCH_STATUS.failed && (
        <div className="info-alert" role="alert">
          <InfoAlert
            status="error"
            headline="We couldn’t schedule this appointment"
          >
            <>
              {submitStatusVaos400 ? (
                <p>
                  We’re sorry. Something went wrong when we tried to submit your
                  appointment. You’ll need to call your local VA medical center
                  to schedule this appointment.
                </p>
              ) : (
                <p>
                  We’re sorry. Something went wrong when we tried to submit your
                  appointment and you’ll need to start over. We suggest you wait
                  a day to try again or you can call your medical center to help
                  with your appointment.
                </p>
              )}
              <>
                {!facilityDetails && (
                  <NewTabAnchor
                    href={`/find-locations/facility/vha_${getRealFacilityId(
                      data.vaFacility,
                    )}`}
                  >
                    {submitStatusVaos400
                      ? 'Find facility contact information'
                      : 'Contact your local VA medical center'}
                  </NewTabAnchor>
                )}
                {!!facilityDetails && (
                  <FacilityAddress
                    name={facilityDetails.name}
                    facility={facilityDetails}
                    showDirectionsLink
                    level={3}
                  />
                )}
              </>
            </>
          </InfoAlert>
        </div>
      )}
    </div>
  );
}

ReviewPage.propTypes = {
  changeCrumb: PropTypes.func,
};

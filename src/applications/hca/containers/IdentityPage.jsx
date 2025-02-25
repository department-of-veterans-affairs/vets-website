import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getNextPagePath } from 'platform/forms-system/src/js/routing';
import { setData } from 'platform/forms-system/src/js/actions';
import recordEvent from 'platform/monitoring/record-event';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { isLoggedIn } from 'platform/user/selectors';
import { fetchEnrollmentStatus, resetEnrollmentStatus } from '../utils/actions';
import { HCA_ENROLLMENT_STATUSES } from '../utils/constants';
import { selectEnrollmentStatus } from '../utils/selectors';
import useAfterRenderEffect from '../hooks/useAfterRenderEffect';
import IdentityVerificationForm from '../components/IdentityPage/VerificationForm';
import VerificationPageDescription from '../components/IdentityPage/VerificationPageDescription';
import FormFooter from '../components/FormFooter';

const IdentityPage = ({ location, route, router }) => {
  const stateData = useSelector(state => ({
    formData: state.form.data,
    loggedIn: isLoggedIn(state),
    statusCode: selectEnrollmentStatus(state).statusCode,
    isUserInMPI: selectEnrollmentStatus(state).isUserInMPI,
    fetchAttempted: selectEnrollmentStatus(state).fetchAttempted,
    vesRecordFound: selectEnrollmentStatus(state).vesRecordFound,
  }));
  const [localData, setLocalData] = useState({});
  const dispatch = useDispatch();

  const handlers = useMemo(
    () => {
      return {
        onChange: data => setLocalData(data),
        onSubmit: data => {
          recordEvent({ event: 'hca-continue-application' });
          dispatch(fetchEnrollmentStatus(data.formData));
        },
        goToNextPage: () => {
          const { pathname } = location;
          const { pageList } = route;
          router.push(getNextPagePath(pageList, stateData.formData, pathname));
        },
        triggerPrefill: () => {
          const fullName = {
            ...stateData.formData.veteranFullName,
            first: localData.firstName,
            middle: localData.middleName,
            last: localData.lastName,
            suffix: localData.suffix,
          };
          const {
            dob: veteranDateOfBirth,
            ssn: veteranSocialSecurityNumber,
          } = localData;
          dispatch(
            setData({
              ...stateData.formData,
              veteranDateOfBirth,
              'view:isUserInMvi': stateData.isUserInMPI,
              'view:veteranInformation': {
                veteranFullName: fullName,
                veteranDateOfBirth,
                veteranSocialSecurityNumber,
              },
            }),
          );
        },
        showSignInModal: () => dispatch(toggleLoginModal(true)),
      };
    },
    [
      dispatch,
      localData,
      location,
      route,
      router,
      stateData.formData,
      stateData.isUserInMPI,
    ],
  );

  /**
   * reset enrollment status data on when first loading the page if user is
   * not logged in, else redirect to introduction page
   */
  useEffect(
    () => {
      if (stateData.loggedIn) {
        router.push('/');
      } else {
        dispatch(resetEnrollmentStatus());
      }
    },
    [dispatch, router, stateData.loggedIn],
  );

  // trigger prefill and navigation if enrollment status criteria is met
  useAfterRenderEffect(
    () => {
      if (stateData.fetchAttempted) {
        const canGoToNext =
          !stateData.vesRecordFound ||
          stateData.statusCode === HCA_ENROLLMENT_STATUSES.noneOfTheAbove;
        if (canGoToNext) {
          handlers.triggerPrefill();
          handlers.goToNextPage();
        }
      }
    },
    [stateData.fetchAttempted],
  );

  return (
    <>
      <div className="progress-box progress-box-schemaform vads-u-padding-x--0">
        <VerificationPageDescription onLogin={handlers.showSignInModal} />
        <IdentityVerificationForm
          data={localData}
          onChange={handlers.onChange}
          onSubmit={handlers.onSubmit}
          onLogin={handlers.showSignInModal}
        />
      </div>
      <FormFooter />
    </>
  );
};

IdentityPage.propTypes = {
  location: PropTypes.object,
  route: PropTypes.object,
  router: PropTypes.object,
};

export default IdentityPage;

import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getNextPagePath } from 'platform/forms-system/src/js/routing';
import { setData } from 'platform/forms-system/src/js/actions';
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
  const [localData, setLocalData] = useState({});
  const dispatch = useDispatch();

  const {
    fetchAttempted,
    isUserInMPI,
    statusCode,
    vesRecordFound,
  } = useSelector(selectEnrollmentStatus);
  const formData = useSelector(state => state.form.data);
  const loggedIn = useSelector(isLoggedIn);

  const onChange = useCallback(data => setLocalData(data), []);
  const onSubmit = useCallback(
    data => {
      dispatch(fetchEnrollmentStatus(data.formData));
    },
    [dispatch],
  );
  const showSignInModal = useCallback(() => dispatch(toggleLoginModal(true)), [
    dispatch,
  ]);
  const goToNextPage = useCallback(
    () =>
      router.push(getNextPagePath(route.pageList, formData, location.pathname)),
    [formData, location.pathname, route.pageList, router],
  );
  const triggerPrefill = useCallback(
    () => {
      const fullName = {
        ...formData.veteranFullName,
        first: localData.firstName,
        middle: localData.middleName,
        last: localData.lastName,
        suffix: localData.suffix,
      };
      const dataToSet = {
        ...formData,
        veteranDateOfBirth: localData.dob,
        'view:isUserInMvi': isUserInMPI,
        'view:veteranInformation': {
          veteranFullName: fullName,
          veteranDateOfBirth: localData.dob,
          veteranSocialSecurityNumber: localData.ssn,
        },
      };
      dispatch(setData(dataToSet));
    },
    [dispatch, formData, isUserInMPI, localData],
  );

  /**
   * reset enrollment status data on when first loading the page if user is
   * not logged in, else redirect to introduction page
   */
  useEffect(
    () => {
      if (loggedIn) {
        const nextPage = getNextPagePath(
          route.pageList,
          formData,
          location.pathname,
        );
        router.push(nextPage || '/');
      } else {
        dispatch(resetEnrollmentStatus());
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loggedIn],
  );

  // trigger prefill and navigation if enrollment status criteria is met
  useAfterRenderEffect(
    () => {
      if (fetchAttempted) {
        const { noneOfTheAbove } = HCA_ENROLLMENT_STATUSES;
        if (!vesRecordFound || statusCode === noneOfTheAbove) {
          triggerPrefill();
          goToNextPage();
        }
      }
    },
    [fetchAttempted],
  );

  return (
    <>
      <div className="progress-box progress-box-schemaform vads-u-padding-x--0">
        <VerificationPageDescription onLogin={showSignInModal} />
        <IdentityVerificationForm
          data={localData}
          onChange={onChange}
          onSubmit={onSubmit}
          onLogin={showSignInModal}
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

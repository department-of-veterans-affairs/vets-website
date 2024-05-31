import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { useDispatch } from 'react-redux';
import { clearMostRecentlySavedField } from '@@vap-svc/actions';
import ChangeOfAddressWrapper from './ChangeOfAddressWrapper';
import ChangeOfDirectDepositWrapper from './ChangeOfDirectDepositWrapper';
import { useData } from '../hooks/useData';
import LoginAlert from '../components/LoginAlert';

const BenefitsProfileWrapper = () => {
  const { loading, latestAddress } = useData();
  const applicantName = latestAddress?.veteranName;
  const [userData, setUserData] = useState({});
  const dispatch = useDispatch();
  const clearSuccessAlert = useCallback(
    () => dispatch(clearMostRecentlySavedField()),
    [dispatch],
  );
  useEffect(() => {
    const getUserData = async () => {
      try {
        const {
          data: {
            attributes: { profile },
          },
        } = await apiRequest('/user', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setUserData(profile);
      } catch (error) {
        throw new Error(error);
      }
    };
    getUserData();
  }, []);
  useEffect(
    () => {
      document.title = `Benefits profile | Veterans Affairs`;

      return () => {
        clearSuccessAlert();
      };
    },
    [clearSuccessAlert],
  );
  const { signIn } = userData;
  return (
    <>
      {loading ? (
        <va-loading-indicator
          label="Loading"
          message="Loading mailing address..."
        />
      ) : (
        <section className="profile-info-card vads-u-margin-bottom--6">
          <ChangeOfAddressWrapper
            applicantName={applicantName}
            mailingAddress={{
              street: latestAddress?.address1,
              city: latestAddress?.city,
              stateCode: latestAddress?.state,
              zipCode: latestAddress?.zipCode,
            }}
          />

          {signIn?.serviceName === 'idme' ||
          signIn?.serviceName === 'logingov' ? (
            <ChangeOfDirectDepositWrapper applicantName={applicantName} />
          ) : (
            <LoginAlert />
          )}
        </section>
      )}
    </>
  );
};

BenefitsProfileWrapper.propTypes = {
  children: PropTypes.any,
};

export default BenefitsProfileWrapper;

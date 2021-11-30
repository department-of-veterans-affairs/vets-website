import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';

import { api } from '../api';

import { permissionsUpdated } from '../actions';
import { goToNextPage, URLS } from '../utils/navigation';
import { SCOPES } from '../../utils/token-format-validator';

import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';
import ValidateDisplay from '../../components/pages/validate/ValidateDisplay';

import { makeSelectContext } from '../hooks/selectors';

const ValidateVeteran = props => {
  const {
    isUpdatePageEnabled,
    isDemographicsPageEnabled,
    router,
    setPermissions,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [lastName, setLastName] = useState('');
  const [last4Ssn, setLast4Ssn] = useState('');

  const [lastNameErrorMessage, setLastNameErrorMessage] = useState();
  const [last4ErrorMessage, setLast4ErrorMessage] = useState();

  const selectContext = useMemo(makeSelectContext, []);
  const { token } = useSelector(selectContext);

  const onClick = async () => {
    setLastNameErrorMessage();
    setLast4ErrorMessage();
    if (!lastName || !last4Ssn) {
      if (!lastName) {
        setLastNameErrorMessage('Please enter your last name.');
      }
      if (!last4Ssn) {
        setLast4ErrorMessage(
          'Please enter the last 4 digits of your Social Security number.',
        );
      }
    } else {
      // API call
      setIsLoading(true);

      api.v2
        .postSession({ lastName, last4: last4Ssn, token })
        .then(data => {
          // update sessions with new permissions
          setPermissions(data);
          // routing
          if (isDemographicsPageEnabled) {
            goToNextPage(router, URLS.DEMOGRAPHICS);
          } else if (isUpdatePageEnabled) {
            goToNextPage(router, URLS.UPDATE_INSURANCE);
          } else {
            goToNextPage(router, URLS.DETAILS);
          }
        })
        .catch(() => {
          goToNextPage(router, URLS.ERROR);
        });
    }
  };
  useEffect(() => {
    focusElement('h1');
  }, []);

  return (
    <>
      <ValidateDisplay
        header="Check in at VA"
        subTitle="We need some information to verify your identity so we can check you in."
        last4Input={{
          last4ErrorMessage,
          setLast4Ssn,
          last4Ssn,
        }}
        lastNameInput={{
          lastNameErrorMessage,
          setLastName,
          lastName,
        }}
        isLoading={isLoading}
        validateHandler={onClick}
        Footer={Footer}
      />
      <BackToHome />
    </>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    setPermissions: data =>
      dispatch(permissionsUpdated(data, SCOPES.READ_FULL)),
  };
};

ValidateVeteran.propTypes = {
  isUpdatePageEnabled: PropTypes.bool,
  isDemographicsPageEnabled: PropTypes.bool,
  router: PropTypes.object,
  setPermissions: PropTypes.func,
};

export default connect(
  null,
  mapDispatchToProps,
)(ValidateVeteran);

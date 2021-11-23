import React, { useState } from 'react';
import BackToHome from '../../components/BackToHome';

import { useFormRouting } from '../../hooks/useFormRouting';
import ValidateDisplay from '../../../components/pages/validate/ValidateDisplay';

import { api } from '../../api';

export default function Index({ router }) {
  const { goToNextPage } = useFormRouting(router);
  const [isLoading, setIsLoading] = useState(false);
  const [lastName, setLastName] = useState('');
  const [last4Ssn, setLast4Ssn] = useState('');

  const [lastNameErrorMessage, setLastNameErrorMessage] = useState();
  const [last4ErrorMessage, setLast4ErrorMessage] = useState();
  const validateHandler = async () => {
    setIsLoading(true);
    setLastNameErrorMessage();
    setLast4ErrorMessage();
    if (!lastName || !last4Ssn) {
      setIsLoading(false);

      if (!lastName) {
        setLastNameErrorMessage('Please enter your last name.');
      }
      if (!last4Ssn) {
        setLast4ErrorMessage(
          'Please enter the last 4 digits of your Social Security number.',
        );
      }
    } else {
      try {
        await api.v2.postSession({ last4: last4Ssn, lastName });
        goToNextPage();
      } catch (e) {
        setIsLoading(false);
        // @TODO: add routing to error page | https://github.com/department-of-veterans-affairs/va.gov-team/issues/33195
      }
    }
  };
  return (
    <>
      <ValidateDisplay
        header="Start pre-check-in"
        subTitle="We need to verify your identity so you can start pre check-in."
        validateHandler={validateHandler}
        isLoading={isLoading}
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
        Footer={() => <div>{/* Footer */}</div>}
      />
      <BackToHome />
    </>
  );
}

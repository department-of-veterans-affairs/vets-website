import React, { useState } from 'react';
import BackToHome from '../../components/BackToHome';

import { useFormRouting } from '../../hooks/useFormRouting';
import ValidateDisplay from './ValidateDisplay';

export default function Index({ router }) {
  const { goToNextPage } = useFormRouting(router);
  const [isLoading, setIsLoading] = useState(false);
  // @TODO: validate token on page load and either redirect to the next page or show this page
  const validateHandler = () => {
    setIsLoading(true);
    goToNextPage();
  };
  return (
    <>
      <h1>Prepare for your primary care appointment</h1>
      <ValidateDisplay
        validateHandler={validateHandler}
        isLoading={isLoading}
      />
      <BackToHome />
    </>
  );
}

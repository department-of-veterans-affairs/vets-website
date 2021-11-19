import React from 'react';
import BackToHome from '../../components/BackToHome';

import { useFormRouting } from '../../hooks/useFormRouting';

export default function Index(props) {
  const { router } = props;
  const { goToNextPage } = useFormRouting(router);
  return (
    <>
      <h1>Introduction</h1>
      <button onClick={goToNextPage}>Start the Form</button>
      <BackToHome />
    </>
  );
}

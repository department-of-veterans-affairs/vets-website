import React from 'react';
import BackToHome from '../../components/BackToHome';

import { useFormRouting } from '../../hooks/useFormRouting';

export default function Index({ router }) {
  const { goToNextPage } = useFormRouting(router);
  return (
    <>
      <h1>Prepare for your primary care appointment</h1>
      <button onClick={goToNextPage}>Validate</button>
      <BackToHome />
    </>
  );
}

import React from 'react';
import BackToHome from '../../components/BackToHome';
import { useFormRouting } from '../../hooks/useFormRouting';

export default function Index({ router }) {
  const { goToNextPage, goToPreviousPage } = useFormRouting(router);
  return (
    <>
      <h1>Demographics</h1>
      <button onClick={goToNextPage}>Yes</button>
      <button onClick={goToPreviousPage}>No</button>
      <BackToHome />
    </>
  );
}

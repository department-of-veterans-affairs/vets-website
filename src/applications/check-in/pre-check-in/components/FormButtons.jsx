import React from 'react';

import { useFormRouting } from '../hooks/useFormRouting';

export default function FormButtons({ router }) {
  const { goToNextPage, goToPreviousPage } = useFormRouting(router);

  return (
    <div>
      <button onClick={goToPreviousPage}>Back</button>
      <button onClick={goToNextPage}>Next</button>
    </div>
  );
}

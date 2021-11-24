import React from 'react';
import { useFormRouting } from '../../useFormRouting';

export default function TestComponent({ router }) {
  const {
    currentPage,
    goToPreviousPage,
    pages,
    goToNextPage,
    goToErrorPage,
    jumpToPage,
  } = useFormRouting(router);
  return (
    <div>
      <h1>Test component for the useFormRouting hook</h1>
      <div data-testid="current-page">{currentPage}</div>
      <div data-testid="all-pages">{pages.join(',')}</div>
      <button onClick={goToPreviousPage} data-testid="prev-button">
        Prev
      </button>
      <button onClick={goToNextPage} data-testid="next-button">
        Next
      </button>
      <button onClick={goToErrorPage} data-testid="error-button">
        Error
      </button>
      <button
        onClick={() => jumpToPage('introduction')}
        data-testid="jump-button"
      >
        Jump
      </button>
    </div>
  );
}

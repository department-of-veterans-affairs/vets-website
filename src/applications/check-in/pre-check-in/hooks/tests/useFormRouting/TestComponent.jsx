import React from 'react';
import { useFormRouting } from '../../useFormRouting';

export default function TestComponent({ router }) {
  const {
    currentPage,
    goToPreviousPage,
    goToNextPage,
    goToErrorPage,
    jumpToPage,
    pages,
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
      <button
        onClick={() =>
          jumpToPage('introduction', {
            params: { url: { id: '1234', query: 'some-query' } },
          })
        }
        data-testid="jump-with-params-button"
      >
        Jump with params
      </button>
    </div>
  );
}

import React, { useCallback } from 'react';
import propTypes from 'prop-types';
import { useFormRouting } from '../../useFormRouting';

export default function TestComponent({ router }) {
  const {
    getCurrentPageFromRouter,
    goToPreviousPage,
    goToNextPage,
    goToErrorPage,
    jumpToPage,
    pages,
  } = useFormRouting(router);
  const currentPage = getCurrentPageFromRouter();
  return (
    <div>
      <h1>Test component for the useFormRouting hook</h1>
      <div data-testid="current-page">{currentPage}</div>
      <div data-testid="all-pages">{pages.join(',')}</div>
      <button
        type="button"
        onClick={goToPreviousPage}
        data-testid="prev-button"
      >
        Prev
      </button>
      <button type="button" onClick={goToNextPage} data-testid="next-button">
        Next
      </button>
      <button type="button" onClick={goToErrorPage} data-testid="error-button">
        Error
      </button>
      <button
        onClick={useCallback(() => jumpToPage('introduction'), [jumpToPage])}
        data-testid="jump-button"
        type="button"
      >
        Jump
      </button>
      <button
        onClick={useCallback(
          () =>
            jumpToPage('introduction', {
              params: { url: { id: '1234', query: 'some-query' } },
            }),
          [jumpToPage],
        )}
        data-testid="jump-with-params-button"
        type="button"
      >
        Jump with params
      </button>
    </div>
  );
}

TestComponent.propTypes = {
  router: propTypes.object,
};

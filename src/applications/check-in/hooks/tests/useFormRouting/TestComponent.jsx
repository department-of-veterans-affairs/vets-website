import React, { useCallback } from 'react';
import propTypes from 'prop-types';
import { useFormRouting } from '../../useFormRouting';

export default function TestComponent({ router }) {
  const {
    getCurrentPageFromRouter,
    getPreviousPageFromRouter,
    goToPreviousPage,
    goToNextPage,
    jumpToPage,
    goToErrorPage,
    pages,
  } = useFormRouting(router);

  const currentPage = getCurrentPageFromRouter();
  const previousPage = getPreviousPageFromRouter();

  const errorTest = () => {
    // strip out button click event stuff from being sent as a param to the function
    goToErrorPage('test-error');
  };

  return (
    <div>
      <h1>Test component for the useFormRouting hook</h1>
      <div data-testid="current-page">{currentPage}</div>
      {previousPage ? (
        <div data-testid="previous-page">{previousPage}</div>
      ) : (
        ''
      )}
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
      <button type="button" onClick={errorTest} data-testid="error-button">
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

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
      <va-button
        uswds
        onClick={goToPreviousPage}
        text="Prev"
        data-testid="prev-button"
      />
      <va-button
        uswds
        onClick={goToNextPage}
        text="Next"
        data-testid="next-button"
      />
      <va-button
        uswds
        onClick={errorTest}
        text="Error"
        data-testid="error-button"
      />
      <va-button
        uswds
        onClick={useCallback(() => jumpToPage('introduction'), [jumpToPage])}
        text="Jump"
        data-testid="jump-button"
      />
      <va-button
        uswds
        onClick={useCallback(
          () =>
            jumpToPage('introduction', {
              params: { url: { id: '1234', query: 'some-query' } },
            }),
          [jumpToPage],
        )}
        text="Jump with params"
        data-testid="jump-with-params-button"
      />
    </div>
  );
}

TestComponent.propTypes = {
  router: propTypes.object,
};

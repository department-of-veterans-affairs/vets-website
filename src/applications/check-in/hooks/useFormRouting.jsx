import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import URLSearchParams from 'url-search-params';

import { makeSelectForm, makeSelectApp } from '../selectors';

import { useUpdateError } from './useUpdateError';

import { URLS } from '../utils/navigation';
import { APP_NAMES } from '../utils/appConstants';

const useFormRouting = (router = {}) => {
  const selectForm = useMemo(makeSelectForm, []);
  const { pages, data } = useSelector(selectForm);

  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);

  const { updateError } = useUpdateError();

  const goToErrorPage = useCallback(
    (errorType = '') => {
      router.push(`${URLS.ERROR}?error=${errorType}`);
    },
    [router],
  );

  const jumpToPage = useCallback(
    (page, options = {}) => {
      const pagePart = page.split('/');
      if (Object.values(URLS).includes(pagePart[0])) {
        const nextPage = page;
        // check for params
        const query = {
          pathname: nextPage,
        };
        const { params } = options;
        if (params) {
          // get all url keys
          const queryParams = new URLSearchParams(params.url).toString();
          // append to string
          const search = queryParams ? `?${queryParams}` : '';
          // add to query
          query.search = search;
        }
        router.push(query);
      } else {
        updateError('routing-error');
      }
    },
    [updateError, router],
  );

  const getCurrentPageFromRouter = useCallback(
    () => {
      // substring to remove the leading /
      return router?.location?.pathname.substring(1) || null;
    },
    [router],
  );

  const getPreviousPageFromRouter = useCallback(
    () => {
      const currentPage = getCurrentPageFromRouter();
      const positionInForm = pages.indexOf(currentPage);
      return pages[positionInForm - 1];
    },
    [getCurrentPageFromRouter, pages],
  );

  const getNextPageFromRouter = useCallback(
    () => {
      const currentPage = getCurrentPageFromRouter();
      const positionInForm = pages.indexOf(currentPage);
      return pages[positionInForm + 1];
    },
    [getCurrentPageFromRouter, pages],
  );

  const goToNextPage = useCallback(
    () => {
      const here = getCurrentPageFromRouter();
      const currentPageIndex = pages.findIndex(page => page === here);
      const nextPage = pages[currentPageIndex + 1] ?? URLS.ERROR;
      if (nextPage === 'complete' && app === APP_NAMES.CHECK_IN) {
        router.push(`complete/${data?.activeAppointmentId}`);
      } else {
        router.push(nextPage);
      }
    },
    [app, data?.activeAppointmentId, getCurrentPageFromRouter, pages, router],
  );
  const goToPreviousPage = () => {
    const { history } = window;
    history.back();
  };

  return {
    getCurrentPageFromRouter,
    getPreviousPageFromRouter,
    getNextPageFromRouter,
    goToErrorPage,
    jumpToPage,
    goToPreviousPage,
    goToNextPage,
    pages,
  };
};

export { useFormRouting };

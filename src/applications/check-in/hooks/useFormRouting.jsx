import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import URLSearchParams from 'url-search-params';

import { makeSelectForm } from '../selectors';

import { URLS } from '../utils/navigation';

const useFormRouting = (router = {}) => {
  const selectForm = useMemo(makeSelectForm, []);
  const { pages } = useSelector(selectForm);

  const goToErrorPage = useCallback(
    () => {
      router.push(URLS.ERROR);
    },
    [router],
  );

  const jumpToPage = useCallback(
    (page, options = {}) => {
      if (Object.values(URLS).includes(page)) {
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
        goToErrorPage();
      }
    },
    [goToErrorPage, router],
  );

  const getCurrentPageFromRouter = useCallback(
    () => {
      // substring to remove the leading /
      return router.location.pathname.substring(1);
    },
    [router],
  );

  const goToNextPage = useCallback(
    () => {
      const here = getCurrentPageFromRouter();
      const currentPageIndex = pages.findIndex(page => page === here);
      const nextPage = pages[currentPageIndex + 1] ?? URLS.ERROR;
      router.push(nextPage);
    },
    [getCurrentPageFromRouter, pages, router],
  );
  const goToPreviousPage = useCallback(
    () => {
      const here = getCurrentPageFromRouter();
      const currentPageIndex = pages.findIndex(page => page === here);
      const nextPage = pages[currentPageIndex - 1] ?? URLS.ERROR;
      router.push(nextPage);
    },
    [getCurrentPageFromRouter, pages, router],
  );

  return {
    getCurrentPageFromRouter,
    goToErrorPage,
    jumpToPage,
    goToPreviousPage,
    goToNextPage,
    pages,
  };
};

export { useFormRouting };

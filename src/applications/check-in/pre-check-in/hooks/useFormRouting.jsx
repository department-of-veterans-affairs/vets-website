import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { URLS } from '../utils/navigation';
import { makeSelectForm } from '../selectors';
import { createGoToNextPageAction } from '../actions';

const useFormRouting = (router = {}) => {
  const selectForm = useMemo(makeSelectForm, []);
  const { pages, currentPage } = useSelector(selectForm);

  const dispatch = useDispatch();
  const dispatchGoToNextPage = useCallback(
    nextPage => {
      dispatch(createGoToNextPageAction({ nextPage }));
    },
    [dispatch],
  );

  const goToNextPage = useCallback(
    () => {
      const currentPageIndex = pages.findIndex(page => page === currentPage);
      const nextPage = pages[currentPageIndex + 1] ?? URLS.ERROR;
      dispatchGoToNextPage(nextPage);
      router.push(nextPage);
    },
    [pages, dispatchGoToNextPage, router, currentPage],
  );
  const goToPreviousPage = useCallback(
    () => {
      const currentPageIndex = pages.findIndex(page => page === currentPage);
      const nextPage = pages[currentPageIndex - 1] ?? URLS.ERROR;
      dispatchGoToNextPage(nextPage);
      router.push(nextPage);
    },
    [pages, dispatchGoToNextPage, router, currentPage],
  );
  return { goToPreviousPage, goToNextPage, currentPage, pages };
};

export { useFormRouting };

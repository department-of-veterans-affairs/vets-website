import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { URLS } from '../utils/navigation';
import { makeSelectForm } from '../selectors';

const useFormRouting = (router = {}) => {
  const selectForm = useMemo(makeSelectForm, []);
  const { pages, currentPage } = useSelector(selectForm);

  const dispatch = useDispatch();

  const goToNextPage = useCallback(
    () => {
      const currentPageIndex = pages.findIndex(page => page === currentPage);
      const nextPage = pages[currentPageIndex + 1] ?? URLS.ERROR;
      dispatch({ type: 'GO_TO_NEXT_PAGE', payload: { form: { nextPage } } });
      router.push(nextPage);
    },
    [router, currentPage, pages, dispatch],
  );
  const goToPreviousPage = useCallback(
    () => {
      const currentPageIndex = pages.findIndex(page => page === currentPage);
      const nextPage = pages[currentPageIndex - 1] ?? URLS.ERROR;
      dispatch({ type: 'GO_TO_NEXT_PAGE', payload: { form: { nextPage } } });
      router.push(nextPage);
    },
    [router, currentPage, pages, dispatch],
  );
  return { goToPreviousPage, goToNextPage, currentPage, pages };
};

export { useFormRouting };

// TODO: refactor to use
// -- reducers and actions
// TODO: tests
// -- unit
// -- integration

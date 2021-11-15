import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useFormRouting = (router = {}) => {
  const { pages, currentPage } = useSelector(
    state => state.preCheckInData.form,
  );
  const dispatch = useDispatch();

  const goToNextPage = useCallback(
    () => {
      const currentPageIndex = pages.findIndex(page => page === currentPage);
      const nextPage = pages[currentPageIndex + 1];
      dispatch({ type: 'GO_TO_NEXT_PAGE', payload: { form: { nextPage } } });
      router.push(nextPage);
    },
    [router, currentPage, pages, dispatch],
  );
  const goToPreviousPage = useCallback(
    () => {
      const currentPageIndex = pages.findIndex(page => page === currentPage);
      const nextPage = pages[currentPageIndex - 1];
      dispatch({ type: 'GO_TO_NEXT_PAGE', payload: { form: { nextPage } } });
      router.push(nextPage);
    },
    [router, currentPage, pages, dispatch],
  );
  return { goToPreviousPage, goToNextPage, currentPage, pages };
};

export { useFormRouting };

// TODO: populate from a place that is configurable??
// TODO: Error bounds of high and lower
// TODO: put on every page
// TODO: get second eyes
// TODO: refactor to use
// ------- selector files
// ------- reducers and actions
// TODO: tests

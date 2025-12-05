import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom-v5-compat';
import { selectPageNumber } from '../selectors/selectPreferences';
import { setPageNumber } from '../redux/preferencesSlice';

/**
 * Custom hook to manage pagination state via URL query parameters
 * @param {object} [options] - Optional parameters for testing
 * @param {function} [options.navigate] - Custom navigate function for testing
 * @returns {{ currentPage: number, handlePageChange: function }}
 */
export const useURLPagination = ({ navigate: customNavigate } = {}) => {
  const dispatch = useDispatch();
  const navigateDefault = useNavigate();
  const navigate = customNavigate || navigateDefault;
  const { search } = useLocation();
  const currentPage = useSelector(selectPageNumber) || 1;

  const page = useMemo(
    () => {
      const query = new URLSearchParams(search);
      return Number(query.get('page'));
    },
    [search],
  );

  useEffect(
    () => {
      if (Number.isNaN(page) || page < 1) {
        navigate(`/?page=${currentPage || 1}`, { replace: true });
        return;
      }

      if (page !== currentPage) {
        dispatch(setPageNumber(page));
      }
    },
    [page, navigate, currentPage, dispatch],
  );

  /**
   * Callback to handle page changes
   * @param {number} newPage The new page value
   */
  const handlePageChange = newPage => {
    if (Number.isNaN(newPage) || newPage < 1) {
      return;
    }
    dispatch(setPageNumber(newPage));
    navigate(`/?page=${newPage}`, { replace: true });
  };

  return {
    currentPage,
    handlePageChange,
  };
};

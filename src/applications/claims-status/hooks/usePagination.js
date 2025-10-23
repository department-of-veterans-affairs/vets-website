import { useCallback, useState } from 'react';
import { ITEMS_PER_PAGE } from '../constants';

/**
 * Custom hook for handling pagination logic
 * @param {Array} items - Array of items to paginate
 * @param {number} itemsPerPage - Number of items per page (defaults to ITEMS_PER_PAGE)
 * @returns {Object} Pagination state and handlers
 */
export const usePagination = (items = [], itemsPerPage = ITEMS_PER_PAGE) => {
  const [currentPage, setCurrentPage] = useState(1);

  const pageLength = items.length;
  const numPages = Math.ceil(pageLength / itemsPerPage);
  const shouldPaginate = numPages > 1;

  let currentPageItems = items;

  if (shouldPaginate) {
    const start = (currentPage - 1) * itemsPerPage;
    const end = Math.min(currentPage * itemsPerPage, pageLength);
    currentPageItems = items.slice(start, end);
  }

  const onPageSelect = useCallback(
    selectedPage => {
      setCurrentPage(selectedPage);
    },
    [setCurrentPage],
  );

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    currentPageItems,
    numPages,
    shouldPaginate,
    pageLength,
    onPageSelect,
    resetPagination,
  };
};

import { useEffect } from 'react';
import formConfig from '../config/form';
import { setDocumentTitle } from '../utils';

const useDocumentTitle = (location, formData) => {
  useEffect(
    () => {
      const pathSegments = location.pathname.split('/').filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1];
      const secondToLast = pathSegments[pathSegments.length - 2];
      let title = null;

      Object.values(formConfig.chapters).forEach(chapter => {
        Object.values(chapter.pages).forEach(page => {
          const pagePath = page.path;

          // Check for exact match (static routes)
          if (pagePath === lastSegment) {
            const chapterTitle = chapter.title || '';
            const pageTitle = page.title || '';
            title =
              chapterTitle === pageTitle
                ? chapterTitle
                : `${chapterTitle} - ${pageTitle}`;
          }

          // Check for dynamic route match (e.g., "dispute-reason/:index")
          if (pagePath.includes(':index')) {
            const basePattern = pagePath.split('/:index')[0];

            if (secondToLast === basePattern) {
              const chapterTitle = chapter.title || '';
              let pageTitle = '';

              // If page.title is a function, call it with formData and index
              if (typeof page.title === 'function') {
                const index = parseInt(lastSegment, 10);
                if (!isNaN(index) && formData) {
                  pageTitle = page.title(formData, { pagePerItemIndex: index });
                } else {
                  pageTitle = chapterTitle;
                }
              } else {
                pageTitle = page.title || '';
              }

              title =
                chapterTitle === pageTitle
                  ? chapterTitle
                  : `${chapterTitle} - ${pageTitle}`;
            }
          }
        });
      });

      if (title && document.title !== title) {
        setDocumentTitle(title);
      }
    },
    [location.pathname, formData],
  );
};

export default useDocumentTitle;

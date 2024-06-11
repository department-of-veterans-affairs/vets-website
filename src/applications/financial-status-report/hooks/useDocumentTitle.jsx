import { useEffect } from 'react';
import formConfig from '../config/form';
import { setDocumentTitle } from '../utils/helpers';

const useDocumentTitle = location => {
  useEffect(
    () => {
      const path = location.pathname.split('/').pop();
      let title = null;

      Object.values(formConfig.chapters).forEach(chapter => {
        Object.values(chapter.pages).forEach(page => {
          if (page.path === path) {
            const chapterTitle = chapter.title || '';
            const pageTitle = page.title || '';
            title =
              chapterTitle === pageTitle
                ? chapterTitle
                : `${chapterTitle} - ${pageTitle}`;
          }
        });
      });

      if (title && document.title !== title) {
        setDocumentTitle(title);
      }
    },
    [location.pathname],
  ); // Only rerun when location.pathname changes
};

export default useDocumentTitle;

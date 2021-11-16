import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';

import { PRE_CHECK_IN_FORM_PAGES } from '../../utils/navigation';

export default function Index(props) {
  const dispatch = useDispatch();

  useEffect(
    () => {
      const { router } = props;
      const firstPage = PRE_CHECK_IN_FORM_PAGES[0].url;
      dispatch({
        type: 'INIT_FORM',
        payload: {
          pages: PRE_CHECK_IN_FORM_PAGES.map(page => page.url),
          currentPage: firstPage,
        },
      });

      router.push(firstPage);
    },
    [props, dispatch],
  );
  return <></>;
}

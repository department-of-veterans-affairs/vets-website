import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';

import { createForm } from '../../utils/navigation';

export default function Index(props) {
  const dispatch = useDispatch();

  useEffect(
    () => {
      const { router } = props;
      const pages = createForm(false);
      const firstPage = pages[0];
      dispatch({
        type: 'INIT_FORM',
        payload: {
          pages,
          currentPage: firstPage,
        },
      });

      router.push(firstPage);
    },
    [props, dispatch],
  );
  return <></>;
}

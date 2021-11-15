import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';

export default function Index(props) {
  const dispatch = useDispatch();
  useEffect(
    () => {
      const { router } = props;

      dispatch({
        type: 'INIT_FORM',
        payload: {
          pages: ['verify', 'introduction', 'contact-information'],
          currentPage: 'verify',
        },
      });

      router.push('verify');
    },
    [props, dispatch],
  );
  return <></>;
}

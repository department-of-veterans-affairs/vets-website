import React, { useEffect, useCallback } from 'react';

import { useDispatch } from 'react-redux';

import { createForm } from '../../utils/navigation';
import { createInitFormAction } from '../../actions';

export default function Index(props) {
  const dispatch = useDispatch();
  const initForm = useCallback(
    (pages, firstPage) => {
      dispatch(createInitFormAction({ pages, firstPage }));
    },
    [dispatch],
  );

  useEffect(
    () => {
      const { router } = props;
      const pages = createForm({ hasConfirmedDemographics: false });
      const firstPage = pages[0];
      initForm(pages, firstPage);
      router.push(firstPage);
    },
    [initForm, props],
  );
  return <></>;
}

import React, { useMemo, useCallback } from 'react';

import { useSelector } from 'react-redux';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { makeSelectEdit } from '../../../selectors';
import BackToHome from '../../BackToHome';

export default function PhoneNumber(props) {
  const { router } = props;
  const { jumpToPage } = useFormRouting(router);
  const selectEdit = useMemo(makeSelectEdit, []);
  const { edit } = useSelector(selectEdit);

  const cancelButton = useCallback(
    () => {
      jumpToPage(edit.originatingPage);
    },
    [edit.originatingPage, jumpToPage],
  );
  const updateButton = useCallback(
    () => {
      jumpToPage(edit.originatingPage);
    },
    [edit.originatingPage, jumpToPage],
  );

  return (
    <>
      <h1>Edit your {edit.title}</h1>
      <h2>{edit.value}</h2>
      <button onClick={updateButton} type="button">
        Update
      </button>
      <button onClick={cancelButton} type="button">
        Cancel
      </button>
      <BackToHome />
    </>
  );
}

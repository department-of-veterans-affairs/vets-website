import React, { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { makeSelectForm } from '../selectors';

import { useFormRouting } from '../hooks/useFormRouting';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { URLS } from '../utils/navigation';

const withForm = Component => {
  return props => {
    const { router } = props;
    const selectForm = useMemo(makeSelectForm, []);
    const form = useSelector(selectForm);

    const { jumpToPage, goToErrorPage } = useFormRouting(router);
    const { getCurrentToken } = useSessionStorage();

    useEffect(
      () => {
        if (!form || !form.pages || form.pages.length === 0) {
          const token = getCurrentToken(window)?.token;
          if (token) {
            jumpToPage(URLS.LANDING, { params: { url: { id: token } } });
          } else {
            goToErrorPage();
          }
        }
      },
      [goToErrorPage, jumpToPage, form, getCurrentToken],
    );

    return (
      <>
        <Component {...props} />
      </>
    );
  };
};

export default withForm;

import React, { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import propTypes from 'prop-types';

import { makeSelectForm } from '../selectors';

import { useStorage } from '../hooks/useStorage';
import { useFormRouting } from '../hooks/useFormRouting';
import { useUpdateError } from '../hooks/useUpdateError';

import { URLS } from '../utils/navigation';

const withForm = (Component, options = {}) => {
  const WrappedComponent = props => {
    const { appName } = options;
    const { router } = props;
    const selectForm = useMemo(makeSelectForm, []);
    const form = useSelector(selectForm);
    const { jumpToPage } = useFormRouting(router);
    const { getCurrentToken } = useStorage(appName);
    const { updateError } = useUpdateError();

    useEffect(
      () => {
        if (!form || !form.pages || form.pages.length === 0) {
          const token = getCurrentToken(window)?.token;
          if (token) {
            jumpToPage(URLS.LANDING, { params: { url: { id: token } } });
          } else {
            updateError('no-token');
          }
        }
      },
      [updateError, jumpToPage, form, getCurrentToken],
    );

    return (
      <>
        {/* Allowing for HOC */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...props} />
      </>
    );
  };

  WrappedComponent.propTypes = {
    router: propTypes.object,
  };

  return WrappedComponent;
};

export default withForm;

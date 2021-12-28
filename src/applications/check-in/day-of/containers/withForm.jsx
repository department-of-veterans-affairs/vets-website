import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { makeSelectForm } from '../../selectors';
import { useFormRouting } from '../../hooks/useFormRouting';
import { getCurrentToken } from '../../utils/session';
import { URLS } from '../utils/navigation';

const withForm = Component => {
  const Wrapped = ({ ...props }) => {
    const { router } = props;
    const selectForm = useMemo(makeSelectForm, []);
    const form = useSelector(selectForm);

    const { jumpToPage, goToErrorPage } = useFormRouting(router, URLS);

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
      [goToErrorPage, jumpToPage, form],
    );

    return (
      <>
        <Component {...props} />
      </>
    );
  };
  Wrapped.propTypes = {
    router: PropTypes.object,
  };

  return Wrapped;
};

export default withForm;

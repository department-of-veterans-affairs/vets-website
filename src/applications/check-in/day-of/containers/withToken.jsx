import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { useSessionStorage } from '../../hooks/useSessionStorage';
import { URLS } from '../../utils/navigation/day-of';
import { useFormRouting } from '../../hooks/useFormRouting';
import { makeSelectCheckInData } from '../hooks/selectors';

const withToken = Component => {
  const Wrapped = ({ ...props }) => {
    const { router } = props;
    const { jumpToPage, goToErrorPage } = useFormRouting(router, URLS);
    const selectCheckInData = useMemo(makeSelectCheckInData, []);
    const checkInData = useSelector(selectCheckInData);
    const { context } = checkInData;
    const shouldRedirect = !context || !context.token;
    const { getCurrentToken } = useSessionStorage(false);
    useEffect(
      () => {
        if (shouldRedirect) {
          const token = getCurrentToken(window)?.token;
          if (token) {
            jumpToPage(URLS.LANDING, { params: { url: { id: token } } });
          } else {
            goToErrorPage();
          }
        }
      },
      [shouldRedirect, router, jumpToPage, goToErrorPage, getCurrentToken],
    );
    if (shouldRedirect) {
      return <></>;
    }
    return (
      <>
        <Component {...props} />
      </>
    );
  };

  Wrapped.propTypes = {
    checkInData: PropTypes.object,
    router: PropTypes.object,
  };

  return Wrapped;
};

export default withToken;

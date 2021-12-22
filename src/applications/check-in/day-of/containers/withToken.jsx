import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { goToNextPage, URLS } from '../utils/navigation';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { makeSelectCheckInData } from '../hooks/selectors';

const withToken = Component => {
  const Wrapped = ({ ...props }) => {
    const { router } = props;
    const selectCheckInData = useMemo(makeSelectCheckInData, []);
    const checkInData = useSelector(selectCheckInData);
    const { context } = checkInData;
    const shouldRedirect = !context || !context.token;
    const { getCurrentToken } = useSessionStorage('health.care.check-in');
    useEffect(
      () => {
        if (shouldRedirect) {
          const session = getCurrentToken(window);
          if (session) {
            const { token } = session;
            goToNextPage(router, URLS.LANDING, { url: { id: token } });
          } else {
            goToNextPage(router, URLS.ERROR);
          }
        }
      },
      [shouldRedirect, router, getCurrentToken],
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

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import { goToNextPage, URLS } from '../utils/navigation';
import { getCurrentToken } from '../utils/session';

const selectCheckInData = createSelector(
  state => state.checkInData,
  checkInData => checkInData || {},
);

const withToken = Component => {
  const Wrapped = ({ ...props }) => {
    const { router } = props;
    const checkInData = useSelector(selectCheckInData);
    const { context } = checkInData;
    const shouldRedirect = !context || !context.token;
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
      [shouldRedirect, router],
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

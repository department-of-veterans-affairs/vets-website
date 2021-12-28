import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { URLS } from '../utils/navigation';
import { useFormRouting } from '../../hooks/useFormRouting';
import { getCurrentToken } from '../../utils/session';
import { makeSelectCheckInData } from '../hooks/selectors';

const withToken = Component => {
  const Wrapped = ({ ...props }) => {
    const { router } = props;
    const { jumpToPage, goToErrorPage } = useFormRouting(router, URLS);
    const selectCheckInData = useMemo(makeSelectCheckInData, []);
    const checkInData = useSelector(selectCheckInData);
    const { context } = checkInData;
    const shouldRedirect = !context || !context.token;
    useEffect(
      () => {
        if (shouldRedirect) {
          const session = getCurrentToken(window);
          if (session) {
            const { token } = session;
            jumpToPage(URLS.LANDING, { params: { url: { id: token } } });
          } else {
            goToErrorPage();
          }
        }
      },
      [shouldRedirect, router, jumpToPage, goToErrorPage],
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

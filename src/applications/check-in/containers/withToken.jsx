import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { goToNextPage, URLS } from '../utils/navigation';
import { getCurrentToken } from '../utils/session';

const withToken = WrappedComponent => props => {
  const { checkInData, router } = props;
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
      <WrappedComponent {...props} />
    </>
  );
};

const mapStateToProps = state => ({
  checkInData: state.checkInData,
});

const composedWrapper = compose(
  connect(mapStateToProps),
  withToken,
);
export default composedWrapper;

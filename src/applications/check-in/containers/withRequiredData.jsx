import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { goToNextPage, URLS } from '../utils/navigation';
import { getCurrentToken } from '../utils/session';

const withRequiredData = WrappedComponent => props => {
  const { checkInData, router, getToken } = props;
  const { appointment } = checkInData;

  useEffect(
    () => {
      if (!appointment) {
        const session = getToken(window);
        if (session) {
          const { token } = session;
          goToNextPage(router, URLS.LANDING, { url: { id: token } });
        } else {
          goToNextPage(router, URLS.ERROR);
        }
      }
    },
    [appointment, getToken, router],
  );
  if (!appointment) {
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

const mapDispatchToProps = () => {
  return {
    getToken: window => {
      return getCurrentToken(window);
    },
  };
};

const composedWrapper = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withRequiredData,
);
export default composedWrapper;

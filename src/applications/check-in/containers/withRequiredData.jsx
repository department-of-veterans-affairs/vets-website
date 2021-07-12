import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { goToNextPage, URLS } from '../utils/navigation';

const withRequiredData = WrappedComponent => props => {
  const { checkInData, router } = props;
  const { appointment } = checkInData;

  if (!appointment) {
    goToNextPage(router, URLS.ERROR);
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
  withRequiredData,
);
export default composedWrapper;

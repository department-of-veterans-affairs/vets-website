import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

const withFeatureFlip = WrappedComponent => props => {
  // const { checkInData } = props;
  // console.log({ checkInData });
  // const { appointment } = checkInData;
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
  withFeatureFlip,
);
export default composedWrapper;

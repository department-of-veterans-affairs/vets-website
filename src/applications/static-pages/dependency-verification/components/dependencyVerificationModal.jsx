import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import { dependencyVerificationCall } from '../actions/index';
import DependencyVerificationHeader from './dependencyVerificationHeader';
import DependencyVerificationList from './dependencyVerificationList';
import DependencyVerificationFooter from './dependencyVerificationFooter';

const DependencyVerificationModal = props => {
  const [isModalShowing, setIsModalShowing] = useState(false);
  const handleClick = e => {
    setIsModalShowing(prevState => !prevState);
    return e;
  };
  useEffect(() => {
    props.dependencyVerificationCall();
  }, []);
  useEffect(
    () => {
      if (props?.data?.verifiableDependents?.length > 0) {
        setIsModalShowing(true);
      }
    },
    [props.data],
  );
  return (
    <>
      <Modal
        onClose={e => handleClick(e)}
        visible={isModalShowing}
        cssClass=""
        id="dependency-verification"
        contents={
          <>
            <DependencyVerificationHeader />
            <DependencyVerificationList />
            <DependencyVerificationFooter />
          </>
        }
      />
    </>
  );
};

const mapStateToProps = state => ({
  data: state.verifyDependents,
});

const mapDispatchToProps = {
  dependencyVerificationCall,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DependencyVerificationModal);
export { DependencyVerificationModal };

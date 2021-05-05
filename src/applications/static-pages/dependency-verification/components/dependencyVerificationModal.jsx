import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import { dependencyVerificationCall } from '../actions/index';
import DependencyVerificationHeader from './dependencyVerificationHeader';
import DependencyVerificationList from './dependencyVerificationList';
import DependencyVerificationFooter from './dependencyVerificationFooter';

const RETRIEVE_DIARIES = 'retrieveDiaries';

const DependencyVerificationModal = props => {
  const [isModalShowing, setIsModalShowing] = useState(false);
  const handleClose = () => {
    sessionStorage.setItem(RETRIEVE_DIARIES, 'false');
    setIsModalShowing(false);
  };

  // Wire this up to api call when it's ready
  const handleCloseAndUpdateDiaries = () => {
    setIsModalShowing(false);
  };
  useEffect(() => {
    // user has clicked 'skip for now' or 'make changes' button
    if (sessionStorage.getItem(RETRIEVE_DIARIES) === 'false') {
      return;
    }
    props.dependencyVerificationCall();
  }, []);

  useEffect(
    () => {
      if (props?.data?.verifiableDependents?.length > 0) {
        setIsModalShowing(true);
      }
    },
    [props],
  );
  return props?.data?.verifiableDependents?.length > 0 ? (
    <>
      <Modal
        onClose={handleClose}
        visible={isModalShowing}
        cssClass="va-modal-large vads-u-padding--1"
        id="dependency-verification"
        contents={
          <>
            <DependencyVerificationHeader />
            <DependencyVerificationList
              dependents={props?.data?.verifiableDependents}
            />
            <DependencyVerificationFooter
              handleClose={handleClose}
              handleCloseAndUpdateDiaries={handleCloseAndUpdateDiaries}
            />
          </>
        }
      />
    </>
  ) : null;
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

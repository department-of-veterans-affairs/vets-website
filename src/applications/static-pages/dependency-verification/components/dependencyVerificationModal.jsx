import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import {
  getDependencyVerifications,
  updateDiariesService,
} from '../actions/index';
import { CALLSTATUS } from '../utils';
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

  const handleCloseAndUpdateDiaries = shouldUpdate => {
    setIsModalShowing(false);
    sessionStorage.setItem(RETRIEVE_DIARIES, 'false');
    props.updateDiariesService(shouldUpdate);
  };
  useEffect(() => {
    // user has clicked 'skip for now' or 'make changes' button
    if (sessionStorage.getItem(RETRIEVE_DIARIES) === 'false') {
      return;
    }
    props.getDependencyVerifications();
  }, []);

  useEffect(
    () => {
      if (props?.data?.getDependencyVerificationStatus === CALLSTATUS.success) {
        setIsModalShowing(true);
      }
    },
    [props],
  );
  return props?.data?.getDependencyVerificationStatus === CALLSTATUS.success ? (
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
  getDependencyVerifications,
  updateDiariesService,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DependencyVerificationModal);
export { DependencyVerificationModal };

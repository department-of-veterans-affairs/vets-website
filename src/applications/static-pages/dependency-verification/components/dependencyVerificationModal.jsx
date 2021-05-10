import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import {
  getDependencyVerifications,
  updateDiariesService,
} from '../actions/index';
import { CALLSTATUS, RETRIEVE_DIARIES } from '../utils';
import DependencyVerificationHeader from './dependencyVerificationHeader';
import DependencyVerificationList from './dependencyVerificationList';
import DependencyVerificationFooter from './dependencyVerificationFooter';

const DependencyVerificationModal = props => {
  const handleClose = () => {
    sessionStorage.setItem(RETRIEVE_DIARIES, 'false');
    props.updateDiariesService(false);
  };

  const handleCloseAndUpdateDiaries = shouldUpdate => {
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

  return props?.data?.getDependencyVerificationStatus === CALLSTATUS.success ? (
    <>
      <Modal
        onClose={handleClose}
        visible={
          props?.data?.getDependencyVerificationStatus === CALLSTATUS.success
        }
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

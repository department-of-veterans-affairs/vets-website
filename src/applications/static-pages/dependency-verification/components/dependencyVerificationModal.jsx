import React, { useEffect, useState } from 'react';
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
  const nodeToWatch = document.getElementsByTagName('body')[0];
  const [otherModal, setOtherModal] = useState(null);

  const openModal = () => {
    if (sessionStorage.getItem(RETRIEVE_DIARIES) === 'false') {
      return;
    }
    props.getDependencyVerifications();
  };

  const observe = () => {
    const callback = function() {
      if (!nodeToWatch.classList.contains('modal-open')) {
        openModal();
      }
    };

    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver(callback);
    observer.observe(nodeToWatch, config);
  };

  const handleClose = () => {
    sessionStorage.setItem(RETRIEVE_DIARIES, 'false');
    props.updateDiariesService(false);
  };

  const handleCloseAndUpdateDiaries = shouldUpdate => {
    sessionStorage.setItem(RETRIEVE_DIARIES, 'false');
    props.updateDiariesService(shouldUpdate);
  };

  const checkForOtherModals = () => {
    // Only open our modal if there is no current modal open
    if (nodeToWatch.classList.contains('modal-open')) {
      setOtherModal(true);
    } else {
      setOtherModal(false);
    }
  };

  const fireIfClearIfNotObserve = () => {
    if (otherModal === false) {
      openModal();
    } else {
      observe();
    }
  };

  useEffect(
    () => {
      checkForOtherModals();
      fireIfClearIfNotObserve();
    },
    [otherModal],
  );

  return props?.data?.getDependencyVerificationStatus === CALLSTATUS.success ? (
    <>
      <Modal
        onClose={handleClose}
        visible={
          props?.data?.getDependencyVerificationStatus === CALLSTATUS.success
        }
        cssClass="va-modal-large vads-u-padding--1"
        id="dependency-verification"
        title="Please make sure your dependents are correct"
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

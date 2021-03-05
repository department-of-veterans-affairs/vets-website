import React, { useState } from 'react';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import DependencyVerificationHeader from './dependencyVerificationHeader';
import DependencyVerificationList from './dependencyVerificationList';
import DependencyVerificationFooter from './dependencyVerificationFooter';

const DependencyVerificationModal = () => {
  const [isModalShowing, setIsModalShowing] = useState(false);
  const handleClick = e => {
    setIsModalShowing(prevState => !prevState);
    return e;
  };
  return (
    <>
      <button className="va-button-link" onClick={e => handleClick(e)}>
        Privacy Act Statement
      </button>
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

export default DependencyVerificationModal;

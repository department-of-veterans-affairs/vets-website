import React, { useState, useEffect } from 'react';
import SignInModal from 'platform/user/authentication/components/SignInModal';

function Modal() {
  const [showModal, setShowModal] = useState(false);

  function toggle() {
    setShowModal(prev => !prev);
  }

  useEffect(() => {
    document.getElementById('sign-in-button').addEventListener('click', toggle);
  }, []);

  return (
    <SignInModal
      visible={showModal}
      onClose={toggle}
      // hard code for now
      useSiS
    />
  );
}

export default Modal;

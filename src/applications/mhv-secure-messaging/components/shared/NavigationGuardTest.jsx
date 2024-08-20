// import React, { useState, useCallback, useEffect } from 'react';
// import { Prompt, useLocation, useHistory } from 'react-router-dom';
// import PropTypes from 'prop-types';

// const NavigationGuardTest = ({
//   when,
//   onCancelNavigation,
//   onConfirmNavigation,
//   modalTitle,
//   modalText,
//   confirmButtonText,
//   cancelButtonText,
//   bypassModal,
//   setBypassModal,
// }) => {
//   const [isBlocking, setIsBlocking] = useState(false);
//   const [nextPath, setNextPath] = useState(null); // Renamed to avoid conflict
//   const location = useLocation();
//   const history = useHistory();

//   const handleBlockedNavigation = useCallback(
//     nextLocation => {
//       if (when && nextLocation.pathname !== location.pathname) {
//         setNextPath(nextLocation.pathname); // Only store the path
//         setIsBlocking(true);
//         return false; // Block navigation
//       }
//       return true;
//     },
//     [when, location.pathname],
//   );

//   const handleConfirm = e => {
//     e.preventDefault(); // Prevent default navigation
//     setIsBlocking(false);
//     onConfirmNavigation();
//     if (nextPath) {
//       history.push(nextPath);
//     }
//   };

//   const handleCancel = () => {
//     setIsBlocking(false);
//     onCancelNavigation();
//   };

//   return (
//     <>
//       <Prompt when={when} message={handleBlockedNavigation} />
//       {isBlocking && (
//         <div className="modal">
//           <h2>{modalTitle}</h2>
//           <p>{modalText}</p>
//           <button onClick={handleConfirm}>{confirmButtonText}</button>
//           <button onClick={handleCancel}>{cancelButtonText}</button>
//         </div>
//       )}
//     </>
//   );
// };

// NavigationGuardTest.propTypes = {
//   when: PropTypes.bool.isRequired,
//   cancelButtonText: PropTypes.string,
//   confirmButtonText: PropTypes.string,
//   modalText: PropTypes.string,
//   modalTitle: PropTypes.string,
//   onCancelNavigation: PropTypes.func,
//   onConfirmNavigation: PropTypes.func,
// };

// export default NavigationGuardTest;

import React, { useEffect, useState, useCallback } from 'react';
import { Prompt, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

const NavigationGuardTest = ({
  when,
  // onCancelNavigation,
  onConfirmNavigation,
  modalTitle,
  modalText,
  confirmButtonText,
  cancelButtonText,
}) => {
  const [isBlocking, setIsBlocking] = useState(when);
  // const [nextLocation, setNextLocation] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const history = useHistory();

  // Handle blocking navigation
  // useEffect(
  //   () => {
  //     const unblock = history.block(location => {
  //       if (isBlocking) {
  //         setNextLocation(location);
  //         return false; // Block navigation
  //       }
  //       return true; // Allow navigation
  //     });

  //     // Cleanup the block when the component unmounts or state changes
  //     return () => {
  //       unblock();
  //     };
  //   },
  //   [isBlocking, history],
  // );

  // Update blocking state based on the `when` prop
  useEffect(
    () => {
      setIsBlocking(when);
    },
    [when],
  );

  const handleConfirm = useCallback(
    e => {
      setIsBlocking(false);
      onConfirmNavigation(e);
      // if (nextLocation) {
      // history.push(nextLocation.pathname);
      // }
    },
    [history, onConfirmNavigation],
  );

  const handleCancel = useCallback(
    () => {
      // setIsBlocking(true); // Keep blocking if the user cancels
      // setNextLocation(null); // Clear the next location to prevent navigation
      // onCancelNavigation();
      setIsModalVisible(false);
    },
    [isModalVisible],
  );

  const handleBlockedNavigation = useCallback(
    () => {
      if (isBlocking) {
        setIsModalVisible(true);
        return false;
      }
      // setIsModalVisible(false)
      return true;
    },
    [isBlocking, setIsModalVisible],
  );

  return (
    <>
      <Prompt when={isBlocking} message={handleBlockedNavigation} />
      {isModalVisible && (
        <div className="modal">
          <h2>{modalTitle}</h2>
          <p>{modalText}</p>
          <button onClick={handleConfirm}>{confirmButtonText}</button>
          <button onClick={handleCancel}>{cancelButtonText}</button>
        </div>
      )}
    </>
  );
};

NavigationGuardTest.propTypes = {
  when: PropTypes.bool.isRequired,
  onCancelNavigation: PropTypes.func,
  onConfirmNavigation: PropTypes.func,
  modalTitle: PropTypes.string,
  modalText: PropTypes.string,
  confirmButtonText: PropTypes.string,
  cancelButtonText: PropTypes.string,
};

export default NavigationGuardTest;

// import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
// import React, { useEffect, useState } from 'react';
// import { Prompt } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import { ErrorMessages } from '../../util/constants';

// export const SmRouteLeavingGuard = ({
//   navigate,
//   when,
//   modalVisible,
//   updateModalVisible,
//   shouldBlockNavigation,
//   title,
//   p1,
//   p2,
//   confirmButtonText,
//   cancelButtonText,
//   saveDraftHandler,
//   swapModalButtons,
// }) => {
//   const [lastLocation, updateLastLocation] = useState();
//   const [confirmedNavigation, updateConfirmedNavigation] = useState(false);

//   const showModal = location => {
//     updateModalVisible(true);
//     updateLastLocation(location);
//   };

//   const closeModal = cb => {
//     updateModalVisible(false);
//     if (typeof cb === 'function') {
//       cb();
//     }
//   };

//   const handleBlockedNavigation = nextLocation => {
//     if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
//       showModal(nextLocation);
//       return false;
//     }
//     return true;
//   };
//   const handleConfirmNavigationClick = e => {
//     saveDraftHandler(e);
//     closeModal(() => {
//       if (lastLocation) {
//         updateConfirmedNavigation(true);
//       }
//     });
//   };

//   useEffect(
//     () => {
//       if (confirmedNavigation) {
//         navigate(lastLocation.pathname);
//         updateConfirmedNavigation(false);
//       }
//     },
//     [confirmedNavigation],
//   );

//   return (
//     <>
//       <Prompt when={when} message={handleBlockedNavigation} />
//       <VaModal
//         modalTitle={title}
//         onCloseEvent={closeModal}
//         status="warning"
//         visible={modalVisible}
//         data-dd-action-name="Navigation Warning Modal Closed"
//       >
//         <p>
//           {cancelButtonText !==
//             ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT
//               .saveDraft && p1}
//         </p>
//         {p2 && <p>{p2}</p>}
//         {!swapModalButtons && (
//           <va-button
//             class="vads-u-margin-top--1"
//             text={confirmButtonText}
//             onClick={closeModal}
//             data-dd-action-name="Cancel Navigation Continue Editing Button"
//           />
//         )}
//         <va-button
//           class="vads-u-margin-top--1"
//           secondary={!swapModalButtons}
//           text={swapModalButtons ? confirmButtonText : cancelButtonText}
//           onClick={handleConfirmNavigationClick}
//           data-dd-action-name="Confirm Navigation Leaving Button"
//         />
//         {swapModalButtons && (
//           <va-button
//             class="vads-u-margin-top--1"
//             secondary={swapModalButtons}
//             text={swapModalButtons ? cancelButtonText : confirmButtonText}
//             onClick={closeModal}
//             data-dd-action-name="Cancel Navigation Continue Editing Button"
//           />
//         )}
//       </VaModal>
//     </>
//   );
// };

// SmRouteLeavingGuard.propTypes = {
//   cancelButtonText: PropTypes.string,
//   confirmButtonText: PropTypes.string,
//   modalVisible: PropTypes.bool,
//   navigate: PropTypes.func,
//   p1: PropTypes.string,
//   p2: PropTypes.any,
//   saveDraftHandler: PropTypes.func,
//   shouldBlockNavigation: PropTypes.func,
//   swapModalButtons: PropTypes.bool,
//   title: PropTypes.string,
//   updateModalVisible: PropTypes.func,
//   when: PropTypes.bool,
// };

// export default SmRouteLeavingGuard;

import React, { useCallback } from 'react';
import { useLocation, Prompt } from 'react-router-dom';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { ErrorMessages } from '../../util/constants';

const SmRouteLeavingGuard = ({
  when,
  title,
  onCancelNavigation,
  onConfirmNavigation,
  p1,
  p2,
  modalVisible,
  setModalVisible,
  confirmButtonText,
  cancelButtonText,
  swapModalButtons,
  bypassModal,
}) => {
  // const [modalVisible, setModalVisible] = useState(false);
  // const [nextLocation, setNextLocation] = useState(null);
  const location = useLocation();
  // const history = useHistory();

  const handleConfirm = e => {
    setModalVisible(false);
    onConfirmNavigation(e);
    // if (nextLocation) {
    //   history.push(nextLocation.pathname);
    // }
  };

  const handleCancel = () => {
    setModalVisible(false);
    onCancelNavigation();
  };

  const handleBlockedNavigation = useCallback(
    newLocation => {
      if (bypassModal) {
        return true;
      }
      if (when && newLocation.pathname !== location.pathname) {
        // setNextLocation(newLocation);
        setModalVisible(true);
        return false; // Block navigation
      }
      return true;
    },
    [bypassModal, location.pathname, when],
  );

  // useEffect(
  //   () => {
  //     if (bypassModal && nextLocation) {
  //       handleConfirm();
  //     }
  //   },
  //   [bypassModal, nextLocation, history],
  // );

  return (
    <>
      <Prompt when={when && !bypassModal} message={handleBlockedNavigation} />
      {modalVisible && (
        <VaModal
          modalTitle={title}
          onCloseEvent={handleCancel}
          status="warning"
          // visible={modalVisible}
          visible
          data-dd-action-name="Navigation Warning Modal Closed"
        >
          <p>
            {cancelButtonText !==
              ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT
                .saveDraft && p1}
          </p>
          {p2 && <p>{p2}</p>}
          {!swapModalButtons && (
            <va-button
              class="vads-u-margin-top--1"
              text={confirmButtonText}
              onClick={handleCancel}
              data-dd-action-name="Cancel Navigation Continue Editing Button"
            />
          )}
          <va-button
            class="vads-u-margin-top--1"
            secondary={!swapModalButtons}
            text={swapModalButtons ? confirmButtonText : cancelButtonText}
            onClick={handleConfirm}
            data-dd-action-name="Confirm Navigation Leaving Button"
          />
          {swapModalButtons && (
            <va-button
              class="vads-u-margin-top--1"
              secondary={swapModalButtons}
              text={swapModalButtons ? cancelButtonText : confirmButtonText}
              onClick={handleCancel}
              data-dd-action-name="Cancel Navigation Continue Editing Button"
            />
          )}
        </VaModal>
      )}
    </>
  );
};

SmRouteLeavingGuard.propTypes = {
  when: PropTypes.bool.isRequired,
  cancelButtonText: PropTypes.string,
  confirmButtonText: PropTypes.string,
  modalText: PropTypes.string,
  modalTitle: PropTypes.string,
  onCancelNavigation: PropTypes.func,
  onConfirmNavigation: PropTypes.func,
};

export default SmRouteLeavingGuard;

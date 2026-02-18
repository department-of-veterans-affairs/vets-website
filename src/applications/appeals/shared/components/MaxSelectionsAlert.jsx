import React from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { MAX_LENGTH, MAX_SELECTED_ERROR } from '../constants';

// Not setting "visible" as a variable since we're controlling rendering at a
// higher level
export const MaxSelectionsAlert = ({ closeModal, appName }) => (
  <VaModal
    clickToClose
    modalTitle={MAX_SELECTED_ERROR}
    status="warning"
    onCloseEvent={closeModal}
    visible
  >
    You are limited to {MAX_LENGTH.SELECTIONS} selected issues for each{' '}
    {appName} request. If you would like to select more than{' '}
    {MAX_LENGTH.SELECTIONS}, submit this request. Then create a new request for
    the remaining issues.
  </VaModal>
);

MaxSelectionsAlert.propTypes = {
  appName: PropTypes.string,
  closeModal: PropTypes.func,
};

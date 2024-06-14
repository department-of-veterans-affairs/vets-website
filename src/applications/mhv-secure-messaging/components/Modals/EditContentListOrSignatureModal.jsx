import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import { Prompts } from '../../util/constants';

const EditContentListOrSignatureModal = props => {
  const { editListModal, onClose } = props;
  const fullState = useSelector(state => state);

  return (
    <VaModal
      id="edit-list"
      data-testid="edit-list"
      modalTitle={Prompts.Compose.EDIT_PREFERENCES_TITLE}
      name="edit-list"
      visible={editListModal}
      data-dd-action-name="Edit Preferences List Modal Closed"
      onCloseEvent={() => {
        onClose();
      }}
      status="warning"
    >
      <p>{Prompts.Compose.EDIT_PREFERENCES_CONTENT}</p>
      <a
        className="vads-c-action-link--green"
        data-testid="edit-preferences-link"
        href={mhvUrl(isAuthenticatedWithSSOe(fullState), 'preferences')}
        target="_blank"
        rel="noreferrer"
        onClick={() => {
          onClose();
        }}
      >
        {Prompts.Compose.EDIT_PREFERENCES_LINK}
      </a>
    </VaModal>
  );
};

EditContentListOrSignatureModal.propTypes = {
  editListModal: PropTypes.bool,
  onClose: PropTypes.func,
};

export default EditContentListOrSignatureModal;

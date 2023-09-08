import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import { Prompts } from '../../util/constants';

const EditContentListOrSignatureModal = props => {
  const { editListModal, setEditListModal } = props;
  const fullState = useSelector(state => state);

  return (
    <VaModal
      id="edit-list"
      data-testid="edit-list"
      modalTitle={Prompts.Compose.EDIT_LIST_TITLE}
      name="edit-list"
      visible={editListModal}
      onCloseEvent={() => {
        setEditListModal(false);
        focusElement(
          document
            .querySelector('#edit-contact-list-or-signature-button')
            .shadowRoot.querySelector('button'),
        );
      }}
      status="warning"
    >
      <p>{Prompts.Compose.EDIT_LIST_CONTENT}</p>
      <a
        className="vads-c-action-link--green"
        data-testid="edit-preferences-link"
        href={mhvUrl(isAuthenticatedWithSSOe(fullState), 'preferences')}
        target="_blank"
        rel="noreferrer"
        onClick={() => {
          setEditListModal(false);
        }}
      >
        {Prompts.Compose.EDIT_LIST_LINK}
      </a>
    </VaModal>
  );
};

EditContentListOrSignatureModal.propTypes = {
  editListModal: PropTypes.bool,
  setEditListModal: PropTypes.func,
};

export default EditContentListOrSignatureModal;

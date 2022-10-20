import React, { useState } from 'react';
import PropType from 'prop-types';
import DiscardDraftModal from '../Modals/DiscardDraftModal';

const DiscardDraft = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <button
        type="button"
        data-testid="discard-draft-button"
        className="usa-button-secondary discard-draft-button"
        onClick={() => {
          setIsModalVisible(true);
        }}
      >
        <i className="fas fa-trash-alt" aria-hidden />
        Discard
      </button>
      <DiscardDraftModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
        }}
        onDelete={() => {}}
      />
    </>
  );
};

DiscardDraft.propTypes = {
  draft: PropType.object,
};

export default DiscardDraft;

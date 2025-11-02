import { useState } from 'react';

export const useDeleteModal = (onDelete = () => {}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // Closes the modal and resets the delete index
  const handleModalCancel = () => {
    setModalOpen(false);
    setDeleteIndex(null);
  };

  // Confirms the delete action and closes the modal
  const handleModalConfirm = () => {
    // Close modal and reset state BEFORE calling onDelete to avoid
    // state updates on unmounted component
    setModalOpen(false);
    setDeleteIndex(null);

    if (typeof onDelete === 'function') {
      // Use setTimeout to ensure state updates complete before deletion
      setTimeout(() => {
        onDelete(deleteIndex);
      }, 0);
    }
  };

  // Opens the modal for a specific index
  const handleDeleteClick = index => {
    if (isModalOpen) return;
    setDeleteIndex(index);
    setModalOpen(true);
  };

  return {
    isModalOpen,
    handleModalCancel,
    handleModalConfirm,
    handleDeleteClick,
    deleteIndex,
  };
};

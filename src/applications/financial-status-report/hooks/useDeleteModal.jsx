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
    if (typeof onDelete === 'function') {
      onDelete(deleteIndex);
    }
    setModalOpen(false);
    setDeleteIndex(null);
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

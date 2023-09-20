import { useState } from 'react';

export const useDeleteModal = onDelete => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const handleModalCancel = () => {
    setModalOpen(false);
  };

  const handleModalConfirm = () => {
    setModalOpen(false);
    onDelete(deleteIndex);
    setDeleteIndex(null); // Resetting the index
  };

  const handleDeleteClick = index => {
    setDeleteIndex(index);
    setModalOpen(true);
  };

  return {
    isModalOpen,
    handleModalCancel,
    handleModalConfirm,
    handleDeleteClick,
  };
};

import { EDITING_PAGE_NAMES } from '../../utils/appConstants';

const setEditingContext = (state, action) => {
  return {
    ...state,
    context: {
      ...state.context,
      editing: { ...action.payload },
    },
  };
};

const clearEditingContext = state => {
  const next = { ...state };
  delete next.context.editing;
  return next;
};

const setPendingEditedData = (state, action) => {
  const { fieldsToUpdate, editingPage } = action.payload;

  if (editingPage === EDITING_PAGE_NAMES.DEMOGRAPHICS) {
    const { demographics } = state.veteranData;
    const { pendingEdits } = state.context;
    const currentData = pendingEdits?.demographics || demographics;
    const nextDemo = { ...currentData, ...fieldsToUpdate };

    delete nextDemo.emergencyContact;
    delete nextDemo.nextOfKin1;
    return {
      ...state,
      context: {
        ...state.context,
        pendingEdits: { demographics: nextDemo },
      },
    };
  }
  return { ...state };
};

export { setEditingContext, clearEditingContext, setPendingEditedData };

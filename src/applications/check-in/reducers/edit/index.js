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
  const { demographics } = state.veteranData || {};
  if (editingPage === EDITING_PAGE_NAMES.DEMOGRAPHICS) {
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
  if (editingPage === EDITING_PAGE_NAMES.NEXT_OF_KIN) {
    const { pendingEdits } = state.context;
    const { nextOfKin1 } = demographics;
    const currentData = pendingEdits?.NEXT_OF_KIN || nextOfKin1;
    const nextNOK = { ...currentData, ...fieldsToUpdate };
    return {
      ...state,
      context: {
        ...state.context,
        pendingEdits: { nextOfKin1: nextNOK },
      },
    };
  }
  if (editingPage === EDITING_PAGE_NAMES.EMERGENCY_CONTACT) {
    const { pendingEdits } = state.context;
    const { emergencyContact } = demographics;
    const currentData = pendingEdits?.EMERGENCY_CONTACT || emergencyContact;
    const nextEmergencyContact = { ...currentData, ...fieldsToUpdate };
    return {
      ...state,
      context: {
        ...state.context,
        pendingEdits: { emergencyContact: nextEmergencyContact },
      },
    };
  }
  return { ...state };
};

export { setEditingContext, clearEditingContext, setPendingEditedData };

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

// query for object before dispath and udpate the fields
// if object doesn;t exist then use the whole demo/EC/NoK object as a base
// add a check seomwhere if the data actually changed.
// action.payoad would be the entire demo/EC/NoK object with the update values?
const setPendingEditedData = (state, action) => {
  const { fieldsToUpdate, editingPage } = action.payload;
  // get the demographics object from old state

  if (editingPage === EDITING_PAGE_NAMES.DEMOGRAPHICS) {
    const { demographics } = state.veteranData;
    const nextDemo = { ...demographics, ...fieldsToUpdate };
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

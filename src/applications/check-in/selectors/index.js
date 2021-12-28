import { createSelector } from 'reselect';

const selectCurrentContext = createSelector(
  state => state.checkInData,
  data => data.context,
);

const makeSelectCurrentContext = () => selectCurrentContext;

const selectForm = createSelector(
  state => state.checkInData,
  data => data.form,
);

const makeSelectForm = () => selectForm;

const selectVeteranData = createSelector(
  state => state.checkInData,
  data => ({
    appointments: data.appointments,
    demographics: data.veteranData.demographics,
  }),
);

const makeSelectVeteranData = () => selectVeteranData;

export { makeSelectCurrentContext, makeSelectForm, makeSelectVeteranData };

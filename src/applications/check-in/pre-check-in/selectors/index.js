import { createSelector } from 'reselect';

const selectCurrentContext = createSelector(
  state => state.preCheckInData,
  data => data.context,
);

const makeSelectCurrentContext = () => selectCurrentContext;

const selectForm = createSelector(
  state => state.preCheckInData,
  data => data.form,
);

const makeSelectForm = () => selectForm;

const selectVeteranData = createSelector(
  state => state.preCheckInData,
  data => ({
    appointments: data.appointments,
    demographics: data.veteranData.demographics,
  }),
);

const makeSelectVeteranData = () => selectVeteranData;

export { makeSelectCurrentContext, makeSelectForm, makeSelectVeteranData };

// import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

export const SET_MYVA_LAYOUT_PREFERENCE = 'SET_MYVA_LAYOUT_PREFERENCE';

export const updateMyVaLayoutVersion = selectedVersion => {
  // Record the event when a user changes
  // const event = {
  //   event: 'dashboard-myva-layout-version-changed',
  //   'myva-layout-version': selectedVersion,
  // };
  // recordEvent(event);
  return {
    type: SET_MYVA_LAYOUT_PREFERENCE,
    layout: {
      version: selectedVersion,
    },
  };
};

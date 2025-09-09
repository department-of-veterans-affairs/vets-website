// import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

export const SET_MY_VA_LAYOUT_PREFERENCE = 'SET_MY_VA_LAYOUT_PREFERENCE';

export const updateMyVaLayoutVersion = selectedVersion => {
  return {
    type: SET_MY_VA_LAYOUT_PREFERENCE,
    layout: {
      version: selectedVersion,
    },
  };
};

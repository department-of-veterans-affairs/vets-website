import { SET_EDIT_MODE } from 'platform/forms-system/src/js/actions';

export const analyticsEvents = [
  {
    action: SET_EDIT_MODE,
    event: (store, action) => {
      return action.edit
        ? {
            event: 'cta-button-click',
            'button-type': 'primary',
            'button-click-label': 'Edit',
            'button-background-color': 'transparent',
          }
        : {
            event: 'cta-button-click',
            'button-type': 'primary',
            'button-click-label': 'Update page',
            'button-background-color': '#0071BB',
          };
    },
  },
];

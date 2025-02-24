// import React from 'react';
// import PropTypes from 'prop-types';
import {
  // radioUI,
  // radioSchema,
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
// import { MUST_MATCH_ALERT } from '../config/constants';
// import { onCloseAlert } from '../helpers';
// import { CustomAlertPage } from './helpers';

/** @type {PageSchema} */
export const isVeteranPage = {
  uiSchema: {
    ...titleUI('Tell us who the claimant is'),
    isVeteran: {
      ...yesNoUI('Is the claimant also the veteran?'),
      'ui:required': () => true,
    },
    // isVeteran: {
    //     ...radioUI({
    //         title: "What is the claimant's relationship to the Veteran?",
    //         required: () => true,
    //         labels: {
    //             veteran: 'The Claimant is the Veteran',
    //             claimant: 'The claimant is a survivor or dependent of the Veteran',
    //         }
    //     })
    // }
  },
  schema: {
    type: 'object',
    properties: {
      // "meep": radioSchema(['The Claimant is the Veteran', 'The claimant is a survivor or dependent of the Veteran']),
      isVeteran: yesNoSchema,
    },
    // required: ['email'],
  },
};

// /** @type {CustomPageType} */
// export function IsVeteranPage(props) {
//   const alert = MUST_MATCH_ALERT(
//     'is-veteran',
//     onCloseAlert,
//     props.data,
//   );
//   return <CustomAlertPage {...props} alert={alert} />;
// }

isVeteranPage.propTypes = {
  //   name: PropTypes.string.isRequired,
  //   schema: PropTypes.object.isRequired,
  //   uiSchema: PropTypes.object.isRequired,
  //   appStateData: PropTypes.object,
  //   contentAfterButtons: PropTypes.node,
  //   contentBeforeButtons: PropTypes.node,
  //   data: PropTypes.object,
  //   formContext: PropTypes.object,
  //   goBack: PropTypes.func,
  //   pagePerItemIndex: PropTypes.number,
  //   title: PropTypes.string,
  //   trackingPrefix: PropTypes.string,
  //   onChange: PropTypes.func,
  //   onContinue: PropTypes.func,
  //   onReviewPage: PropTypes.bool,
  //   onSubmit: PropTypes.func,
};

import React from 'react';
import PropTypes from 'prop-types';
import {
  ssnSchema,
  ssnUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { MUST_MATCH_ALERT } from '../config/constants';
import { onCloseAlert } from '../helpers';
import { CustomAlertPage } from './helpers';

/** @type {PageSchema} */
export const veteranIdentificationInformationPage = {
  uiSchema: {
    ...titleUI(
      'Veteran identification information',
      'You must enter a Social Security number',
    ),
    veteranSsn: ssnUI(),
  },
  schema: {
    type: 'object',
    properties: {
      veteranSsn: ssnSchema,
    },
  },
};

/** @type {CustomPageType} */
export function VeteranIdentificationInformationPage(props) {
  const alert = MUST_MATCH_ALERT(
    'veteran-identification',
    onCloseAlert,
    props.data,
  );
  return <CustomAlertPage {...props} alert={alert} />;
}

VeteranIdentificationInformationPage.propTypes = {
  name: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object.isRequired,
  appStateData: PropTypes.object,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
  data: PropTypes.object,
  formContext: PropTypes.object,
  goBack: PropTypes.func,
  pagePerItemIndex: PropTypes.number,
  title: PropTypes.string,
  trackingPrefix: PropTypes.string,
  onChange: PropTypes.func,
  onContinue: PropTypes.func,
  onReviewPage: PropTypes.bool,
  onSubmit: PropTypes.func,
};

import React from 'react';
import PropTypes from 'prop-types';
import {
  ssnOrVaFileNumberNoHintSchema,
  ssnOrVaFileNumberNoHintUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CustomAlertPage } from './helpers';
import { getAlert } from '../helpers';

/** @type {PageSchema} */
export const veteranIdentificationInformationPage = {
  uiSchema: {
    ...titleUI(
      'Veteran identification information',
      <>
        <div>
          You must enter either a Social Security number or a VA file number.
        </div>
        <div className="vads-u-margin-top--3">
          {getAlert({ name: 'veteranIdentificationInformationPage' }, false)}
        </div>
      </>,
    ),
    idNumber: ssnOrVaFileNumberNoHintUI(),
  },
  schema: {
    type: 'object',
    properties: {
      idNumber: ssnOrVaFileNumberNoHintSchema,
    },
  },
};

/** @type {CustomPageType} */
export function VeteranIdentificationInformationPage(props) {
  return <CustomAlertPage {...props} />;
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

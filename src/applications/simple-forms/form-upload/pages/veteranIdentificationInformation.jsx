import React from 'react';
import PropTypes from 'prop-types';
import {
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberUI,
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
        <div className="vads-u-margin-top--3">
          {getAlert({ name: 'veteranIdentificationInformationPage' }, false)}
        </div>
      </>,
    ),
    idNumber: ssnOrVaFileNumberUI(),
  },
  schema: {
    type: 'object',
    properties: {
      idNumber: ssnOrVaFileNumberSchema,
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

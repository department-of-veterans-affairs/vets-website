import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import { Provider } from 'react-redux';

import { uploadStore } from 'platform/forms-system/test/config/helpers';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import fileUploadUI, { fileSchema } from '../../../src/js/definitions/file';

describe('Schemaform definition file', () => {
  it('should render file', () => {
    const uiSchema = fileUploadUI('Files');
    const form = ReactTestUtils.renderIntoDocument(
      <Provider store={uploadStore}>
        <DefinitionTester schema={fileSchema} uiSchema={uiSchema} />
      </Provider>,
    );

    const formDOM = findDOMNode(form);

    expect(formDOM.querySelector('input[type="file"]')).not.to.be.null;
    expect(formDOM.querySelector('label>span[role="button"]')).not.to.be.null;
  });
});

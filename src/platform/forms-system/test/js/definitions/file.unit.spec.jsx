import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { uploadStore } from 'platform/forms-system/test/config/helpers';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import fileUploadUI, { fileSchema } from '../../../src/js/definitions/file';

describe('Schemaform definition file', () => {
  it('should render file', () => {
    const uiSchema = fileUploadUI('Files');
    const { container } = render(
      <Provider store={uploadStore}>
        <DefinitionTester schema={fileSchema} uiSchema={uiSchema} />
      </Provider>,
    );

    expect(container.querySelector('input[type="file"]')).not.to.be.null;
    expect(container.querySelector('label>span[role="button"]')).not.to.be.null;
  });
});

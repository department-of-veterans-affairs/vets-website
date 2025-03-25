<<<<<<< HEAD
import { expect } from 'chai';

import * as manualUploadPage from '../../../pages/form0781/manualUploadPage';

describe('Form 0781 manual upload page', () => {
  it('should define a uiSchema object', () => {
    expect(manualUploadPage.uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(manualUploadPage.schema).to.be.an('object');
=======
import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { uploadStore } from 'platform/forms-system/test/config/helpers';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { fireEvent, render } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import Sinon from 'sinon';
import * as manualUploadPage from '../../../pages/form0781/manualUploadPage';

describe('Form 0781 manual upload page', () => {
  const { uiSchema, schema } = manualUploadPage;

  it('should define a uiSchema object', () => {
    expect(uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(schema).to.be.an('object');
  });

  describe('File uploads', () => {
    it('should submit with an upload', () => {
      const onSubmit = Sinon.spy();
      const { container } = render(
        <Provider store={uploadStore}>
          <DefinitionTester
            schema={schema}
            uiSchema={uiSchema}
            onSubmit={onSubmit}
            data={{
              form781Upload: [
                {
                  confirmationCode: 'testing',
                  name: '781.pdf',
                  attachmentId: 'L228',
                },
              ],
            }}
          />
        </Provider>,
      );

      fireEvent.submit($('form', container));
      expect(onSubmit.called).to.be.true;
    });

    it('should not submit without required upload', () => {
      const onSubmit = Sinon.spy();
      const { container, getByText } = render(
        <Provider store={uploadStore}>
          <DefinitionTester
            schema={schema}
            uiSchema={uiSchema}
            onSubmit={onSubmit}
          />
        </Provider>,
      );

      fireEvent.submit($('form', container));
      getByText('You must upload a file');
      expect(onSubmit.called).to.be.false;
    });
>>>>>>> main
  });
});

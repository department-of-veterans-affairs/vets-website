import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { uploadStore } from 'platform/forms-system/test/config/helpers';
import {
  DefinitionTester, // selectCheckbox
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../../config/form';
import { HAS_OTHER_EVIDENCE } from '../../../constants';

describe('Additional evidence upload', () => {
  const page = formConfig.chapters.evidence.pages.uploadDetails;
  const { schema, uiSchema, arrayPath } = page;

  it('should render', () => {
    const { container } = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          definitions={{}}
          schema={schema}
          data={[]}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    expect($('input[type="file"]', container)).to.exist;
  });

  it('should not submit without required upload', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          onSubmit={onSubmit}
          definitions={{}}
          schema={schema}
          data={{}}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect($$('.usa-input-error-message', container).length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should submit with uploaded form', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          onSubmit={onSubmit}
          definitions={{}}
          schema={schema}
          data={{
            [HAS_OTHER_EVIDENCE]: true,
            additionalDocuments: [
              {
                name: 'test.pdf',
                size: 100000,
                confirmationCode: 'testing',
                attachmentId: 'L049',
              },
            ],
          }}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    fireEvent.submit($('form', container));
    const content = container.textContent;
    const select = $('va-select[value="L049"]', container);

    await waitFor(() => {
      expect($('.usa-input-error-message', container)).to.not.exist;
      expect(onSubmit.called).to.be.true;
      expect(content).to.contain('test.pdf');
      expect(content).to.contain('98KB');
      expect(select).to.exist;
      expect(select.getAttribute('message-aria-describedby')).to.eq(
        'Choose a document type for test.pdf',
      );
    });
  });
});

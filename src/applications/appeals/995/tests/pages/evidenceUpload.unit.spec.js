import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { uploadStore } from 'platform/forms-system/test/config/helpers';
import {
  DefinitionTester, // selectCheckbox
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';
import { EVIDENCE_OTHER } from '../../constants';

describe('Additional evidence upload', () => {
  const page = formConfig.chapters.evidence.pages.evidenceUpload;
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

  it('should not submit without required upload', () => {
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
    expect($$('.usa-input-error-message', container).length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit with uploaded form', () => {
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
            [EVIDENCE_OTHER]: true,
            additionalDocuments: [
              {
                name: 'test.pdf',
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
    expect($$('.usa-input-error-message', container).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});

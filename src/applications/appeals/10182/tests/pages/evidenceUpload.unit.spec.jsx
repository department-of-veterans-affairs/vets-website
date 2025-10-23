import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { Provider } from 'react-redux';
import { uploadStore } from 'platform/forms-system/test/config/helpers';
import environment from '~/platform/utilities/environment';
import {
  DefinitionTester, // selectCheckbox
} from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';
import { EVIDENCE_UPLOAD_API } from '../../constants/apis';

describe('Additional evidence upload', () => {
  const page = formConfig.chapters.boardReview.pages.evidenceUpload;
  const { schema, uiSchema, arrayPath } = page;

  it('should render', () => {
    const { container } = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          definitions={{}}
          schema={schema}
          data={{}}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    expect($$('input[type="file"]', container).length).to.equal(1);
    expect($$('va-additional-info', container).length).to.equal(1);
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

    waitFor(() => {
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
            evidence: [
              {
                confirmationCode: 'testing',
                name: 'test.pdf',
              },
            ],
          }}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect($$('.usa-input-error-message', container).length).to.equal(0);
      expect(onSubmit.called).to.be.true;
      const { evidence } = onSubmit.args[0][0].uiSchema;
      expect(evidence['ui:options'].fileUploadUrl).to.eq(
        `${environment.API_URL}${EVIDENCE_UPLOAD_API}`,
      );
    });
  });
});

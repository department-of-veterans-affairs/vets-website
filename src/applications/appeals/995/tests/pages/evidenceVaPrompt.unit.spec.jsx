import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { fireEvent, waitFor, render } from '@testing-library/react';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';
import { HAS_VA_EVIDENCE } from '../../constants';
import {
  requestVaRecordsTitle,
  requestVaRecordsHint,
} from '../../content/evidenceVaPrompt';
import errorMessages from '../../../shared/content/errorMessages';

const mockStore = () => ({
  getState: () => ({
    form: { data: {} },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('Supplemental Claims VA evidence request page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.evidence.pages.evidenceVaPrompt;

  it('should render', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
        />
      </Provider>,
    );

    const radio = $('va-radio', container);
    expect(radio.getAttribute('label')).to.eq(requestVaRecordsTitle);
    expect(radio.getAttribute('hint')).to.eq(requestVaRecordsHint);
    expect($$('va-radio-option', container).length).to.eq(2);
  });

  it('should not allow submit with radios unselected (required)', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <Provider store={mockStore()}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );
    fireEvent.submit($('form', container));

    await waitFor(() => {
      const radios = $$('[error]', container);
      expect(radios.length).to.equal(1);
      expect(radios[0].getAttribute('error')).to.eq(
        errorMessages.requiredYesNo,
      );
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should allow submit with one radio selected', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <Provider store={mockStore()}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{ [HAS_VA_EVIDENCE]: true }}
          formData={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );
    fireEvent.submit($('form', container));
    expect(container.innerHTML).to.contain('value="Y" checked');
    expect($('[error]', container)).to.not.exist;
    expect(onSubmit.called).to.be.true;
  });

  it('should render the proper content', () => {
    const store = mockStore();
    const { data } = store.getState().form;
    const { container } = render(
      <Provider store={store}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={data}
          formData={data}
        />
      </Provider>,
    );

    const radio = $('va-radio', container);
    expect(radio.getAttribute('label')).to.eq(requestVaRecordsTitle);
    expect(radio.getAttribute('hint')).to.eq(requestVaRecordsHint);
  });
});

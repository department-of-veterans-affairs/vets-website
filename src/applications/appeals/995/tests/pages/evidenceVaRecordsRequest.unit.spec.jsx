import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { fireEvent, waitFor, render } from '@testing-library/react';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';
import {
  EVIDENCE_VA,
  SC_NEW_FORM_TOGGLE,
  SC_NEW_FORM_DATA,
} from '../../constants';
import {
  requestVaRecordsTitle,
  requestVaRecordsTitleOld,
  requestVaRecordsHint,
} from '../../content/evidenceVaRecordsRequest';
import errorMessages from '../../../shared/content/errorMessages';

const mockStore = ({ toggle = false } = {}) => ({
  getState: () => ({
    form: { data: { [SC_NEW_FORM_DATA]: toggle } },
    featureToggles: {
      loading: false,
      // eslint-disable-next-line camelcase
      [SC_NEW_FORM_TOGGLE]: toggle,
      scNewForm: toggle,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('Supplemental Claims VA evidence request page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.evidence.pages.evidenceVaRecordsRequest;

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
    expect(radio.getAttribute('label')).to.eq(requestVaRecordsTitleOld);
    expect(radio.getAttribute('hint')).to.eq('');
    expect($$('va-radio-option', container).length).to.eq(2);
    expect($('va-additional-info', container)).to.exist;
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
          data={{ [EVIDENCE_VA]: true }}
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

  // *** New content ***
  it('should render new content', () => {
    const store = mockStore({ toggle: true });
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
    // Removed in new content - render controlled by <Toggler>
    expect($('va-additional-info', container)).to.not.exist;
  });
});

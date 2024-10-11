import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { inputVaTextInput } from 'platform/testing/unit/helpers';

import formConfig from '../../config/form';
import { mockStore } from '../../../shared/tests/test-helpers';

describe('HLR informal conference rep v2 page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.informalConference.pages.representativeInfoV2;

  it('should render', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );

    expect($$('va-text-input', container).length).to.equal(5);
  });
  it('should allow submit', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <Provider store={mockStore()}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={onSubmit}
          data={{ informalConference: 'rep' }}
        />
      </Provider>,
    );

    inputVaTextInput(
      container,
      'James',
      '[name="root_informalConferenceRep_firstName"]',
    );
    inputVaTextInput(
      container,
      'Sullivan',
      '[name="root_informalConferenceRep_lastName"]',
    );
    inputVaTextInput(
      container,
      '8005551212',
      '[name="root_informalConferenceRep_phone"]',
    );
    inputVaTextInput(
      container,
      '1234',
      '[name="root_informalConferenceRep_extension"]',
    );
    inputVaTextInput(
      container,
      'x@x.com',
      '[name="root_informalConferenceRep_email"]',
    );
    fireEvent.submit($('form', container));

    expect($$('[error]', container).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
  it('should prevent continuing when data is missing', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <Provider store={mockStore()}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={onSubmit}
          data={{ informalConference: 'rep' }}
        />
      </Provider>,
    );

    fireEvent.submit($('form', container));

    expect($$('[error]', container).length).to.equal(3);
    expect(onSubmit.called).to.be.false;
  });
  it('should prevent continuing when phone is missing', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <Provider store={mockStore()}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={onSubmit}
          data={{ informalConference: 'rep' }}
        />
      </Provider>,
    );

    inputVaTextInput(
      container,
      'James',
      '[name="root_informalConferenceRep_firstName"]',
    );
    inputVaTextInput(
      container,
      'Sullivan',
      '[name="root_informalConferenceRep_lastName"]',
    );
    fireEvent.submit($('form', container));

    expect($$('[error]', container).length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });
});

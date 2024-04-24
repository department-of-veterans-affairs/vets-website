import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import getData from '../../../fixtures/mocks/mockStore';

import formConfig from '../../../../config/form';
import spouseMarriageHistory from '../../../../config/chapters/04-household-information/currentSpouseFormerMarriages';

const definitions = formConfig.defaultDefinitions;

const { schema, uiSchema } = spouseMarriageHistory;

describe('pension spouse marriage history page', () => {
  const middleware = [];
  const mockStore = configureStore(middleware);
  it('should render with all fields and buttons', async () => {
    const onSubmit = sinon.spy();
    const { data } = getData({ loggedIn: false });
    const store = mockStore(data);
    const { container } = render(
      <Provider store={store}>
        <DefinitionTester
          definitions={definitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{ spouseMarriages: [{ spouseFullName: {} }] }}
          formData={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    expect($$('va-text-input,input', container).length).to.equal(5);
    expect($$('va-memorable-date', container).length).to.equal(2);
    expect($$('va-select', container).length).to.equal(1);
    expect($('.va-growable-add-btn', container)).to.exist;
    expect($('button[type="submit"]', container)).to.exist;
  });

  it('should not allow submit with errors', async () => {
    const onSubmit = sinon.spy();
    const { data } = getData({ loggedIn: false });
    const store = mockStore(data);

    const { container } = render(
      <Provider store={store}>
        <DefinitionTester
          definitions={definitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{ spouseMarriages: [{}] }}
          formData={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    fireEvent.submit($('form', container));
    await waitFor(() => {
      expect(onSubmit.called).to.be.false;
    });
  });
});

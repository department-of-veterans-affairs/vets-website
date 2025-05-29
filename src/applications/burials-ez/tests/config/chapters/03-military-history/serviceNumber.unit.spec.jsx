import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();

describe('Service Number', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.militaryHistory.pages.serviceNumber;

  it('should render the service number input field', () => {
    const { container, queryByText } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );

    expect($$('va-text-input', container).length).to.equal(1);
    expect(queryByText(/Service number/i)).to.exist;
  });

  it('should show validation error if input is invalid', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{ militaryServiceNumber: 'abc123' }} // Invalid service number input
        />
      </Provider>,
    );

    fireEvent.submit($('form', container));
    await waitFor(() => {
      const errors = '.usa-input-error, va-text-input[error]';
      expect($$(errors, container).length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should show validation error if input is invalid', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{ militaryServiceNumber: '123-456-789' }} // Invalid SSN input
        />
      </Provider>,
    );

    fireEvent.submit($('form', container));
    await waitFor(() => {
      const errors = '.usa-input-error, va-text-input[error]';
      expect($$(errors, container).length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should submit successfully with valid service number format', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{ militaryServiceNumber: 'A123456' }}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    fireEvent.submit($('form', container));
    await waitFor(() => {
      expect(onSubmit.called).to.be.true;
    });
  });

  it('should submit successfully with valid SSN format', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{ militaryServiceNumber: '123-45-6789' }}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    fireEvent.submit($('form', container));
    await waitFor(() => {
      expect(onSubmit.called).to.be.true;
    });
  });
});

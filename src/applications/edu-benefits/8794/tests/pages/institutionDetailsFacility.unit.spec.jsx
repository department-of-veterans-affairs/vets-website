import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import formConfig from '../../config/form';

const mockStore = configureStore([]);

describe('22-8894 - Institution Details Facility', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.institutionDetailsChapter.pages.institutionDetailsFacility;

  it('renders facility code input, institutionName placeholder, and institutionAddress placeholder', () => {
    const store = mockStore({
      form: {
        data: {
          institutionDetails: { hasVaFacilityCode: true },
        },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{ institutionDetails: { hasVaFacilityCode: true } }}
        />
      </Provider>,
    );

    expect($$('va-text-input', container).length).to.equal(1);
    expect($$('h3#institutionHeading', container).length).to.equal(1);
    expect($$('span[aria-hidden="true"]', container).length).to.equal(1);
  });
  it('should validate facility code length', () => {
    const errors = {
      messages: [],
      addError(msg) {
        this.messages.push(msg);
      },
    };
    const validate =
      uiSchema.institutionDetails.facilityCode['ui:validations'][0];

    validate(errors, '1234567');
    expect(errors.messages).to.include(
      'Please enter a valid 8-character facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
    );

    errors.messages = [];
    validate(errors, '12345678');
    expect(errors.messages).to.be.empty;
  });
  it('shows errors when required field is empty', () => {
    const store = mockStore({
      form: {
        data: {
          institutionDetails: {
            hasVaFacilityCode: true,
          },
        },
      },
    });
    const onSubmit = sinon.spy();

    const { container, getByRole } = render(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{ institutionDetails: { hasVaFacilityCode: true } }}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    fireEvent.click(getByRole('button', { name: /submit/i }));
    expect($$('va-text-input[error]', container).length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });
});

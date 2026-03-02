import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.veteranInformationChapter.pages.veteranPersonalInformation;

describe('21p-530a veteran personal information', () => {
  const getData = () => ({
    veteranInformation: {
      fullName: {
        first: 'John',
        middle: 'A',
        last: 'Doe',
      },
    },
  });

  const mockStore = {
    getState: () => ({
      form: {
        data: getData(),
      },
      formContext: {
        onReviewPage: false,
        reviewMode: false,
        touched: {},
        submitted: false,
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  it('should render veteran name fields', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
        />
      </Provider>,
    );

    expect(container.querySelector('button[type="submit"]')).to.exist;
  });

  it('should validate first name does not exceed max length', async () => {
    const onSubmit = sinon.spy();
    const formData = {
      veteranInformation: {
        fullName: {
          first: 'VeryLongFirstName', // 17 characters, exceeds limit of 12
          middle: 'A',
          last: 'Doe',
        },
      },
    };

    const { container } = render(
      <Provider store={mockStore}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={formData}
          formData={formData}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    const form = container.querySelector('form');
    form.dispatchEvent(new Event('submit', { bubbles: true }));

    await waitFor(() => {
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should validate middle name does not exceed max length', async () => {
    const onSubmit = sinon.spy();
    const formData = {
      veteranInformation: {
        fullName: {
          first: 'John',
          middle: 'AB', // 2 characters, exceeds limit of 1
          last: 'Doe',
        },
      },
    };

    const { container } = render(
      <Provider store={mockStore}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={formData}
          formData={formData}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    const form = container.querySelector('form');
    form.dispatchEvent(new Event('submit', { bubbles: true }));

    await waitFor(() => {
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should validate last name does not exceed max length', async () => {
    const onSubmit = sinon.spy();
    const formData = {
      veteranInformation: {
        fullName: {
          first: 'John',
          middle: 'A',
          last: 'VeryLongLastNameThatExceedsLimit', // 33 characters, exceeds limit of 18
        },
      },
    };

    const { container } = render(
      <Provider store={mockStore}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={formData}
          formData={formData}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    const form = container.querySelector('form');
    form.dispatchEvent(new Event('submit', { bubbles: true }));

    await waitFor(() => {
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should show a validation error if first name is longer than 12 characters', () => {
    const errorMessages = [];

    const errors = {
      addError: message => {
        errorMessages.push(message || '');
      },
    };

    const formData = {
      veteranInformation: {
        fullName: { first: 'ThisIsAVeryLongFirstName', last: 'Doe' },
      },
    };

    // expect a validation error for the first name field
    const firstNameValidation =
      uiSchema.veteranInformation.fullName.first['ui:validations'][1];
    firstNameValidation(errors, null, formData);

    expect(errorMessages[0]).to.exist;
    expect(errorMessages[0]).to.equal(
      'Please enter a name under 12 characters. If your name is longer, enter the first 12 characters only.',
    );
  });

  it('should not show a validation error if first name is 12 characters or less', () => {
    const errorMessages = [];

    const errors = {
      addError: message => {
        errorMessages.push(message || '');
      },
    };

    const formData = {
      veteranInformation: {
        fullName: { first: 'John', last: 'Doe' },
      },
    };

    // expect no validation error for the first name field
    const firstNameValidation =
      uiSchema.veteranInformation.fullName.first['ui:validations'][1];
    firstNameValidation(errors, null, formData);

    expect(errorMessages.length).to.equal(0);
  });
});

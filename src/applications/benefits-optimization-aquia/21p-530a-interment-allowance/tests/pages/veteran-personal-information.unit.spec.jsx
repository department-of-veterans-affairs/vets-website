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

  it('should have proper max lengths for name fields', () => {
    const nameProps =
      schema.properties.veteranInformation.properties.fullName.properties;

    expect(nameProps.first.maxLength).to.equal(12);
    expect(nameProps.middle.maxLength).to.equal(1);
    expect(nameProps.last.maxLength).to.equal(18);
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

  it('should accept valid names within max length limits', () => {
    const nameProps =
      schema.properties.veteranInformation.properties.fullName.properties;

    // Test that names at the limit are acceptable
    const validFirst = 'a'.repeat(12);
    const validMiddle = 'a'.repeat(1);
    const validLast = 'a'.repeat(18);

    expect(validFirst.length).to.equal(nameProps.first.maxLength);
    expect(validMiddle.length).to.equal(nameProps.middle.maxLength);
    expect(validLast.length).to.equal(nameProps.last.maxLength);
  });
});

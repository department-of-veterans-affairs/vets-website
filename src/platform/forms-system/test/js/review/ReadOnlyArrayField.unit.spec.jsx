import React from 'react';
import { expect } from 'chai';
import { render, within } from '@testing-library/react';

import ReadOnlyArrayField from '../../../src/js/review/ReadOnlyArrayField';

describe('Schemaform review: ReadOnlyArrayField', () => {
  it('should render a div', () => {
    const schema = {
      items: [
        {
          type: 'object',
          properties: {
            test: {
              type: 'string',
            },
          },
        },
      ],
    };
    const uiSchema = {
      'ui:options': {
        itemName: 'Item',
      },
    };
    const registry = {
      definitions: {},
      fields: {
        SchemaField: function SchemaField() {
          return null;
        },
      },
      formContext: {
        onReviewPage: false,
      },
    };
    const formData = [{}];

    const tree = render(
      <ReadOnlyArrayField
        schema={schema}
        formData={formData}
        uiSchema={uiSchema}
        idSchema={{}}
        registry={registry}
        requiredSchema={{}}
      />,
    );

    expect(within(document.querySelector('.schemaform-field-container'))).to
      .exist;
    expect(tree.getByText('Item')).to.exist;
    expect(document.querySelector('div.review')).to.exist;
    expect(document.querySelector('dl.review')).to.not.exist;
  });
  it('should render a dl wrapper', () => {
    const schema = {
      items: [
        {
          type: 'object',
          properties: {
            test: {
              type: 'string',
            },
          },
        },
      ],
    };
    const uiSchema = {
      'ui:options': {
        itemName: 'Item',
        useDlWrap: true,
      },
    };
    const registry = {
      definitions: {},
      fields: {
        SchemaField: function SchemaField() {
          return null;
        },
      },
      formContext: {
        onReviewPage: false,
      },
    };
    const formData = [{}];

    const tree = render(
      <ReadOnlyArrayField
        schema={schema}
        formData={formData}
        uiSchema={uiSchema}
        idSchema={{}}
        registry={registry}
        requiredSchema={{}}
      />,
    );

    expect(within(document.querySelector('.schemaform-field-container'))).to
      .exist;
    expect(tree.getByText('Item')).to.exist;
    expect(document.querySelector('div.review')).to.not.exist;
    expect(document.querySelector('dl.review')).to.exist;
  });
  it('should render default H5 item-header on Review page', () => {
    const schema = {
      items: [
        {
          type: 'object',
          properties: {
            test: {
              type: 'string',
            },
          },
        },
      ],
    };
    const uiSchema = {
      'ui:options': {
        itemName: 'Item',
        useDlWrap: true,
      },
    };
    const registry = {
      definitions: {},
      fields: {
        SchemaField: function SchemaField() {
          return null;
        },
      },
      formContext: {
        onReviewPage: true,
      },
    };
    const formData = [{}];

    render(
      <ReadOnlyArrayField
        schema={schema}
        formData={formData}
        uiSchema={uiSchema}
        idSchema={{}}
        registry={registry}
        requiredSchema={{}}
      />,
    );

    expect(document.querySelector('h5.schemaform-array-readonly-header')).to
      .exist;
  });
  it('should render H4 item-header on Review page with reviewItemHeaderLevel = 4', () => {
    const schema = {
      items: [
        {
          type: 'object',
          properties: {
            test: {
              type: 'string',
            },
          },
        },
      ],
    };
    const uiSchema = {
      'ui:options': {
        itemName: 'Item',
        reviewItemHeaderLevel: '4',
        useDlWrap: true,
      },
    };
    const registry = {
      definitions: {},
      fields: {
        SchemaField: function SchemaField() {
          return null;
        },
      },
      formContext: {
        onReviewPage: true,
      },
    };
    const formData = [{}];

    render(
      <ReadOnlyArrayField
        schema={schema}
        formData={formData}
        uiSchema={uiSchema}
        idSchema={{}}
        registry={registry}
        requiredSchema={{}}
      />,
    );

    expect(document.querySelector('h4.schemaform-array-readonly-header')).to
      .exist;
  });
});

import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import StringField from '../../../src/js/review/StringField.jsx';
import { TextWidget, SelectWidget } from '../../../src/js/review/widgets';

describe('Schemaform <StringField>', () => {
  it('should render', () => {
    const registry = {
      fields: {},
      widgets: {
        text: TextWidget,
      },
    };
    const schema = {
      type: 'string',
    };
    const uiSchema = {};
    const formData = 'test';

    const { container } = render(
      <StringField
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        formData={formData}
      />,
    );

    // Check that the component renders with the correct value
    expect(container.textContent).to.contain(formData);
  });
  it('should render options', () => {
    const registry = {
      fields: {},
      widgets: {
        select: SelectWidget,
      },
    };
    const schema = {
      type: 'string',
      enum: ['test'],
    };
    const uiSchema = {
      'ui:options': {
        labels: {
          test: 'Name',
        },
      },
    };
    const formData = 'test';

    const { container } = render(
      <StringField
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        formData={formData}
      />,
    );

    // With RTL, we're testing the actual rendered output
    expect(container.textContent).to.contain('Name');
  });
  it('should render review widget', () => {
    const registry = {
      widgets: {
        text: TextWidget,
      },
    };
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:reviewWidget': TextWidget,
    };
    const formData = 'test';

    const { container } = render(
      <StringField
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        formData={formData}
      />,
    );

    // Check that the review widget renders with the formData
    expect(container.textContent).to.contain(formData);
  });
});

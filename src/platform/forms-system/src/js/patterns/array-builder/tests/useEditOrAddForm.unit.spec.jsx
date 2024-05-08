/* eslint-disable no-unused-vars */
import React from 'react';
import sinon from 'sinon';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useEditOrAddForm } from '../useEditOrAddForm';

const mockSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
  },
};

const mockUiSchema = {
  name: {
    'ui:title': 'Name',
  },
};

const mockData = {
  name: 'John Doe',
};

describe('useEditOrAddForm', () => {
  it('should call onChange immediately for isEdit=false', async () => {
    const mockOnChange = sinon.spy();
    const mockOnSubmit = sinon.spy();

    const Component = props => {
      const { data, schema, uiSchema, onChange, onSubmit } = useEditOrAddForm({
        isEdit: false,
        schema: props.schema,
        uiSchema: props.uiSchema,
        data: props.data,
        onChange: props.onChange,
        onSubmit: props.onSubmit,
      });

      return (
        <form>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" onChange={onChange} value={data?.name} />
          <VaButton onClick={onSubmit}>Submit</VaButton>
        </form>
      );
    };

    const { container } = render(
      <Component
        data={mockData}
        schema={mockSchema}
        uiSchema={mockUiSchema}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />,
    );

    const input = container.querySelector('input');
    fireEvent.change(input, {
      target: { value: 'Jane Doe' },
    });
    expect(mockOnChange.called).to.be.true;
    const button = container.querySelector('va-button');
    fireEvent.click(button);
    expect(mockOnSubmit.called).to.be.true;
  });

  it('should not call onChange immediately for isEdit=true', async () => {
    const mockOnChange = sinon.spy();
    const mockOnSubmit = sinon.spy();

    const Component = props => {
      const { data, schema, uiSchema, onChange, onSubmit } = useEditOrAddForm({
        isEdit: true,
        schema: props.schema,
        uiSchema: props.uiSchema,
        data: props.data,
        onChange: props.onChange,
        onSubmit: props.onSubmit,
      });

      return (
        <form>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" onChange={onChange} value={data?.name} />
          <VaButton onClick={onSubmit}>Submit</VaButton>
        </form>
      );
    };

    const { container } = render(
      <Component
        data={mockData}
        schema={mockSchema}
        uiSchema={mockUiSchema}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />,
    );

    const input = container.querySelector('input');
    fireEvent.change(input, {
      target: { value: 'Jane Doe' },
    });
    expect(mockOnChange.called).to.be.false;
    const button = container.querySelector('va-button');
    fireEvent.click(button);
    expect(mockOnSubmit.called).to.be.true;
  });
});

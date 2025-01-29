/* eslint-disable no-unused-vars */
import React from 'react';
import sinon from 'sinon';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useEditOrAddForm } from '../useEditOrAddForm';
import * as helpers from '../../../state/helpers';

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

  describe('updateSchemasAndData', () => {
    let updateSchemasAndDataSpy;
    let mockOnChange;
    let mockOnSubmit;
    beforeEach(() => {
      mockOnChange = sinon.spy();
      mockOnSubmit = sinon.spy();
      updateSchemasAndDataSpy = sinon
        .stub(helpers, 'updateSchemasAndData')
        .returns({
          data: mockData,
          schema: mockSchema,
          uiSchema: mockUiSchema,
          onChange: mockOnChange,
          onSubmit: mockOnSubmit,
        });
    });
    afterEach(() => {
      updateSchemasAndDataSpy.restore();
    });

    it('should call updateSchemasAndData when isEdit=true', async () => {
      const fullData = { ...mockData, otherData: 'test' };
      const Component = props => {
        const { data, schema, uiSchema, onChange, onSubmit } = useEditOrAddForm(
          {
            isEdit: true,
            schema: props.schema,
            uiSchema: props.uiSchema,
            data: props.data,
            fullData,
            onChange: props.onChange,
            onSubmit: props.onSubmit,
            index: 1,
          },
        );

        return (
          <form>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              onChange={onChange}
              value={data?.name}
            />
            <VaButton onClick={onSubmit}>Submit</VaButton>
          </form>
        );
      };

      const { container } = render(
        <Component
          data={mockData}
          fullData={fullData}
          schema={mockSchema}
          uiSchema={mockUiSchema}
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
          index={1}
        />,
      );

      waitFor(() => {
        expect(updateSchemasAndDataSpy.called).to.be.true;
        expect(updateSchemasAndDataSpy.args[0]).to.deep.equal([
          mockSchema,
          mockUiSchema,
          mockData,
          false,
          fullData,
          1,
        ]);
      });
    });
  });
});

import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';

import AutosuggestField from '../../../src/js/fields/AutosuggestField';

const options = [
  { id: 1, label: 'first' },
  { id: 2, label: 'second' },
  { id: 3, label: 'third' },
  { id: 4, label: 'fourth' },
];

// Mimic querying the api for options
function queryForOptions(input = '') {
  // Emulate a fast api call
  return Promise.resolve(options.filter(o => o.label.includes(input)));
}

describe('<AutosuggestField>', () => {
  it('should render', () => {
    const uiSchema = {
      'ui:options': {
        getOptions: () => Promise.resolve([]),
      },
    };
    const formContext = {
      reviewMode: false,
    };
    const { container } = render(
      <AutosuggestField
        formData={{ widget: 'autosuggest', label: 'label' }}
        formContext={formContext}
        idSchema={{ $id: 'id' }}
        uiSchema={uiSchema}
      />,
    );

    const input = container.querySelector('input');
    expect(input.id).to.equal('id');
    expect(input.name).to.equal('id');
    expect(input.value).to.equal('label');
    expect(input.getAttribute('autocomplete')).to.equal('off');
  });

  it('should render in review mode', () => {
    const uiSchema = {
      'ui:options': {
        getOptions: () => Promise.resolve([]),
      },
    };
    const formContext = {
      reviewMode: true,
    };
    const { container } = render(
      <AutosuggestField
        formContext={formContext}
        idSchema={{ $id: 'id' }}
        schema={{ type: 'object' }}
        formData={{ widget: 'autosuggest', label: 'testing' }}
        uiSchema={uiSchema}
      />,
    );

    expect(container.querySelector('input')).to.be.null;
    expect(container.querySelector('dd').textContent).to.contain('testing');
  });

  it('should call onChange when suggestion is selected', async () => {
    const uiSchema = {
      'ui:options': {
        getOptions: () =>
          Promise.resolve([
            {
              id: '1',
              label: 'first',
            },
            {
              id: '2',
              label: 'second',
            },
          ]),
      },
    };
    const formContext = {
      reviewMode: false,
    };
    const onChange = sinon.spy();

    const { container } = render(
      <AutosuggestField
        formContext={formContext}
        onChange={onChange}
        idSchema={{ $id: 'id' }}
        uiSchema={uiSchema}
      />,
    );

    const input = container.querySelector('input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'fir' } });

    await waitFor(() => {
      const suggestions = container.querySelectorAll('.autosuggest-item');
      expect(suggestions.length).to.be.greaterThan(0);
    });

    const suggestion = container.querySelectorAll('.autosuggest-item')[0];
    fireEvent.click(suggestion);
    expect(onChange.lastCall.args[0]).to.eql({
      id: '1',
      label: 'first',
      widget: 'autosuggest',
    });
  });

  it('should clear data when input is cleared', () => {
    const uiSchema = {
      'ui:options': {
        getOptions: () =>
          Promise.resolve([
            {
              id: '1',
              label: 'first',
            },
            {
              id: '2',
              label: 'second',
            },
          ]),
      },
    };
    const formContext = {
      reviewMode: false,
    };
    const onChange = sinon.spy();

    const { container } = render(
      <AutosuggestField
        formContext={formContext}
        formData={{ widget: 'autosuggest', id: '1', label: 'first' }}
        onChange={onChange}
        idSchema={{ $id: 'id' }}
        uiSchema={uiSchema}
      />,
    );

    const input = container.querySelector('input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '' } });
    expect(onChange.lastCall.args.length).to.equal(0);
  });

  it('should trigger onBlur', async () => {
    const uiSchema = {
      'ui:options': {
        getOptions: () =>
          Promise.resolve([
            {
              id: '1',
              label: 'first',
            },
            {
              id: '2',
              label: 'second',
            },
          ]),
      },
    };
    const formContext = {
      reviewMode: false,
    };
    const onChange = sinon.spy();
    const onBlur = sinon.spy();

    const { container } = render(
      <AutosuggestField
        formData={{ widget: 'autosuggest', id: '1', label: 'first' }}
        formContext={formContext}
        onChange={onChange}
        onBlur={onBlur}
        idSchema={{ $id: 'id' }}
        uiSchema={uiSchema}
      />,
    );

    const input = container.querySelector('input');
    fireEvent.focus(input);

    await waitFor(() => {
      fireEvent.blur(input);
      expect(onBlur.called).to.be.true;
    });
  });

  it('should leave data on blur if partially filled in', async () => {
    const uiSchema = {
      'ui:options': {
        getOptions: () =>
          Promise.resolve([
            {
              id: '1',
              label: 'first',
            },
            {
              id: '2',
              label: 'second',
            },
          ]),
      },
    };
    const formContext = {
      reviewMode: false,
    };
    const onChange = sinon.spy();
    const onBlur = sinon.spy();

    const { container } = render(
      <AutosuggestField
        formData={{ widget: 'autosuggest', id: '1', label: 'first' }}
        formContext={formContext}
        onChange={onChange}
        onBlur={onBlur}
        idSchema={{ $id: 'id' }}
        uiSchema={uiSchema}
      />,
    );

    const input = container.querySelector('input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'fir' } });

    await waitFor(() => {
      expect(input.value).to.equal('fir');
      expect(onChange.called).to.be.true;
    });

    fireEvent.blur(input);
    expect(input.value).to.equal('fir');
  });

  it('should use options from enum to get first item', async () => {
    const uiSchema = {
      'ui:options': {
        labels: {
          AL: 'Label 1',
          BC: 'Label 2',
        },
      },
    };
    const schema = {
      type: 'string',
      enum: ['AL', 'BC'],
    };
    const formContext = {
      reviewMode: false,
    };
    const onChange = sinon.spy();
    const onBlur = sinon.spy();

    const { container } = render(
      <AutosuggestField
        schema={schema}
        formContext={formContext}
        onChange={onChange}
        onBlur={onBlur}
        idSchema={{ $id: 'id' }}
        uiSchema={uiSchema}
      />,
    );

    const input = container.querySelector('input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'labe' } });

    await waitFor(() => {
      const items = container.querySelectorAll('.autosuggest-item');
      expect(items.length).to.be.greaterThan(0);
    });

    fireEvent.keyDown(input, { key: 'ArrowDown', keyCode: 40 });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });
    expect(onChange.lastCall.args[0]).to.eql('AL');
  });

  it('should call a function passed in getOptions with formData', async () => {
    // ...when the input changes and `uiSchema['ui:options'].queryForResults` is true
    const getOptions = sinon.spy(queryForOptions);
    const props = {
      uiSchema: {
        'ui:options': {
          debounceRate: 0,
          getOptions,
          queryForResults: true,
        },
      },
      schema: { type: 'string' },
      formContext: { reviewMode: false },
      idSchema: { $id: 'id' },
      onChange: () => {},
      onBlur: () => {},
    };
    const { container } = render(<AutosuggestField {...props} />);

    // Search for 'ir'
    const input = container.querySelector('input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'ir' } });

    // Check that getOptions was called with the form data
    await waitFor(() => {
      expect(getOptions.callCount).to.be.greaterThan(1);
      const { args } = getOptions.secondCall;
      expect(args[0]).to.eql('ir');
    });
  });

  it("should use the results of getOptions as the field's enum options", async () => {
    const props = {
      uiSchema: {
        'ui:options': {
          debounceRate: 0,
          getOptions: queryForOptions,
          queryForResults: true,
        },
      },
      schema: { type: 'string' },
      formContext: { reviewMode: false },
      idSchema: { $id: 'id' },
      onChange: () => {},
      onBlur: () => {},
    };
    const { container } = render(<AutosuggestField {...props} />);

    const input = container.querySelector('input');
    // Type a space to trigger the dropdown with all results
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'i' } });

    // Wait for initial getOptions('i') to resolve and show items
    await waitFor(() => {
      const items = container.querySelectorAll('.autosuggest-item');
      expect(items.length).to.be.greaterThan(0);
    });

    // Search for 'ir' to filter options
    fireEvent.change(input, { target: { value: 'ir' } });

    await waitFor(() => {
      const items = container.querySelectorAll('.autosuggest-item');
      expect(items.length).to.equal(2);
      expect(items[0].textContent).to.equal('first');
      expect(items[1].textContent).to.equal('third');
    });
  });

  // The stringifyFormReplacer will send the label to the api instead of the id if freeInput is
  //  true in the formData
  it('should return a string if freeInput is true in ui:options', () => {
    const onChange = sinon.spy();
    const props = {
      uiSchema: {
        'ui:options': {
          freeInput: true,
          labels: {
            AL: 'Label 1',
            BC: 'Label 2',
          },
        },
      },
      schema: {
        type: 'string',
        enum: ['AL', 'BC'],
      },
      formContext: { reviewMode: false },
      idSchema: { $id: 'id' },
      onChange,
      onBlur: () => {},
    };
    const { container } = render(<AutosuggestField {...props} />);

    // Input something not in options
    const input = container.querySelector('input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'konami' } });

    const fieldData = onChange.firstCall.args[0];
    expect(fieldData).to.equal('konami');
  });

  it('should run input transformers if freeInput is true and if transformers specified in ui:options', () => {
    const onChange = sinon.spy();
    const props = {
      uiSchema: {
        'ui:options': {
          freeInput: true,
          inputTransformers: [
            inputValue => `${inputValue} first`,
            inputValue => `${inputValue} second`,
          ],
          labels: {
            AL: 'Label 1',
            BC: 'Label 2',
          },
        },
      },
      schema: {
        type: 'string',
        enum: ['AL', 'BC'],
      },
      formContext: { reviewMode: false },
      idSchema: { $id: 'id' },
      onChange,
      onBlur: () => {},
    };
    const { container } = render(<AutosuggestField {...props} />);

    // Input something not in options
    const input = container.querySelector('input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'konami' } });

    const fieldData = onChange.firstCall.args[0];
    expect(fieldData).to.equal('konami first second');
  });

  it('should call onChange when options are set with existing input', async () => {
    const uiSchema = {
      'ui:options': {
        getOptions: () => Promise.resolve([]),
      },
    };
    const formContext = {
      reviewMode: false,
    };
    const onChange = sinon.spy();
    const { container } = render(
      <AutosuggestField
        formData={{ widget: 'autosuggest', label: 'label' }}
        formContext={formContext}
        idSchema={{ $id: 'id' }}
        onChange={onChange}
        uiSchema={uiSchema}
      />,
    );

    // The component calls getOptions on mount which triggers onChange
    await waitFor(() => {
      expect(onChange.called).to.be.true;
    });

    expect(container.querySelector('input').value).to.equal('label');
  });

  it('should highlight results if highlightText is true in ui:options', async () => {
    const onChange = sinon.spy();
    const props = {
      uiSchema: {
        'ui:options': {
          freeInput: true,
          highlightText: true,
          labels: {
            AL: 'Label 1',
            BC: 'LABEL 2',
          },
        },
      },
      schema: {
        type: 'string',
        enum: ['AL', 'BC'],
      },
      formContext: { reviewMode: false },
      idSchema: { $id: 'id' },
      onChange,
      onBlur: () => {},
    };
    const { container } = render(<AutosuggestField {...props} />);

    const input = container.querySelector('input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Bel' } });

    await waitFor(() => {
      expect(container.querySelector('.autosuggest-list')).to.not.be.null;
    });

    const items = container.querySelectorAll('.autosuggest-item');
    const firstItem = items[0];
    const highlight = firstItem.querySelector('.autosuggest-highlight');
    expect(firstItem.textContent).to.equal('Label 1');
    expect(highlight.textContent).to.equal('bel');

    const lastItem = items[items.length - 1];
    const highlight2 = lastItem.querySelector('.autosuggest-highlight');
    expect(lastItem.textContent).to.equal('LABEL 2');
    expect(highlight2.textContent).to.equal('BEL');
  });

  it('should not throw an error if the value includes regexp special characters', async () => {
    const onChange = sinon.spy();
    const props = {
      uiSchema: {
        'ui:options': {
          freeInput: true,
          highlightText: true,
          labels: {
            AL: 'Label(1)',
            BC: 'LABEL 2',
          },
        },
      },
      schema: {
        type: 'string',
        enum: ['AL', 'BC'],
      },
      formContext: { reviewMode: false },
      idSchema: { $id: 'id' },
      onChange,
      onBlur: () => {},
    };
    const { container } = render(<AutosuggestField {...props} />);

    const input = container.querySelector('input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Bel(' } });

    await waitFor(() => {
      expect(container.querySelector('.autosuggest-list')).to.not.be.null;
    });

    const items = container.querySelectorAll('.autosuggest-item');
    const lastItem = items[items.length - 1];
    const highlight = lastItem.querySelector('.autosuggest-highlight');
    expect(lastItem.textContent).to.equal('Label(1)');
    expect(highlight.textContent).to.equal('bel(');
  });
});

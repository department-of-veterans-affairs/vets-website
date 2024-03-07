import React from 'react';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

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

describe.skip('<AutosuggestField>', () => {
  it('should render', () => {
    const uiSchema = {
      'ui:options': {
        getOptions: () => Promise.resolve([]),
      },
    };
    const formContext = {
      reviewMode: false,
    };
    const tree = mount(
      <AutosuggestField
        formData={{ widget: 'autosuggest', label: 'label' }}
        formContext={formContext}
        idSchema={{ $id: 'id' }}
        uiSchema={uiSchema}
      />,
    );

    const input = tree.find('input');
    expect(input.props().id).to.equal('id');
    expect(input.props().name).to.equal('id');
    expect(input.props().value).to.equal('label');
    expect(input.getDOMNode().getAttribute('autocomplete')).to.equal('off');
    tree.unmount();
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
    const tree = shallow(
      <AutosuggestField
        formContext={formContext}
        idSchema={{ $id: 'id' }}
        schema={{ type: 'object' }}
        formData={{ widget: 'autosuggest', label: 'testing' }}
        uiSchema={uiSchema}
      />,
    );

    expect(tree.find('Downshift').exists()).to.be.false;
    expect(tree.find('dd').text()).to.contain('testing');
    tree.unmount();
  });

  it('should call onChange when suggestion is selected', done => {
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

    const tree = mount(
      <AutosuggestField
        formContext={formContext}
        onChange={onChange}
        idSchema={{ $id: 'id' }}
        uiSchema={uiSchema}
      />,
    );

    const input = tree.find('input');
    input.simulate('focus');
    // input.value = 'fir';
    input.simulate('change', {
      target: {
        value: 'fir',
      },
    });

    setTimeout(() => {
      // Not sure why I have to do this, but enzyme can't find the item element
      const suggestions = tree
        .getDOMNode()
        .querySelectorAll('.autosuggest-item');
      ReactTestUtils.Simulate.click(suggestions[0]);
      expect(onChange.secondCall.args[0]).to.eql({
        id: '1',
        label: 'first',
        widget: 'autosuggest',
      });
      const instance = tree.instance();
      tree.unmount();
      expect(instance.unmounted).to.be.true;
      done();
    }, 0);
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

    const tree = mount(
      <AutosuggestField
        formContext={formContext}
        formData={{ widget: 'autosuggest', id: '1', label: 'first' }}
        onChange={onChange}
        idSchema={{ $id: 'id' }}
        uiSchema={uiSchema}
      />,
    );

    const input = tree.find('input');
    input.simulate('focus');
    input.simulate('change', {
      target: {
        value: '',
      },
    });
    expect(onChange.lastCall.args.length).to.equal(0);
    tree.unmount();
  });

  it('should trigger onBlur', done => {
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

    const tree = mount(
      <AutosuggestField
        formData={{ widget: 'autosuggest', id: '1', label: 'first' }}
        formContext={formContext}
        onChange={onChange}
        onBlur={onBlur}
        idSchema={{ $id: 'id' }}
        uiSchema={uiSchema}
      />,
    );

    const input = tree.find('input');
    input.simulate('focus');

    setTimeout(() => {
      input.simulate('blur');
      expect(onBlur.called).to.be.true;
      tree.unmount();
      done();
    });
  });

  it('should leave data on blur if partially filled in', done => {
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

    const tree = mount(
      <AutosuggestField
        formData={{ widget: 'autosuggest', id: '1', label: 'first' }}
        formContext={formContext}
        onChange={onChange}
        onBlur={onBlur}
        idSchema={{ $id: 'id' }}
        uiSchema={uiSchema}
      />,
    );

    const input = tree.find('input');
    input.simulate('focus');
    input.simulate('change', {
      target: {
        value: 'fir',
      },
    });

    setTimeout(() => {
      expect(input.getDOMNode().value).to.equal('fir');
      expect(onChange.called).to.be.true;
      input.simulate('blur');
      expect(input.getDOMNode().value).to.equal('fir');
      tree.unmount();
      done();
    });
  });

  it('should use options from enum to get first item', done => {
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

    const tree = mount(
      <AutosuggestField
        schema={schema}
        formContext={formContext}
        onChange={onChange}
        onBlur={onBlur}
        idSchema={{ $id: 'id' }}
        uiSchema={uiSchema}
      />,
    );

    const input = tree.find('input');
    input.simulate('focus');
    input.simulate('change', {
      target: {
        value: 'labe',
      },
    });

    setTimeout(() => {
      input.simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });
      input.simulate('keyDown', { key: 'Enter', keyCode: 13 });
      expect(onChange.lastCall.args[0]).to.eql('AL');
      tree.unmount();
      done();
    }, 0);
  });

  it('should call a function passed in getOptions with formData', done => {
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
    const wrapper = mount(<AutosuggestField {...props} />);

    // Search for 'ir'
    const input = wrapper.find('input');
    input.simulate('focus');
    input.simulate('change', {
      target: {
        value: 'ir',
      },
    });

    // Check that getOptions was called with the form data
    setTimeout(() => {
      const { args } = getOptions.secondCall;
      expect(args[0]).to.eql('ir');
      wrapper.unmount();
      done();
    });
  });

  it("should use the results of getOptions as the field's enum options", done => {
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
    const wrapper = mount(<AutosuggestField {...props} />);

    setTimeout(() => {
      expect(wrapper.state('options')).to.eql(options);
    }, 100);

    setTimeout(() => {
      // Search for 'ir'
      const input = wrapper.find('input');
      input.simulate('focus');
      input.simulate('change', {
        target: {
          value: 'ir',
        },
      });
    }, 110);

    setTimeout(() => {
      expect(wrapper.state('options')).to.eql([
        { id: 1, label: 'first' },
        { id: 3, label: 'third' },
      ]);
      wrapper.unmount();
      done();
    }, 210);
  });

  // The stringifyFormReplacer will send the label to the api instead of the id if freeInput is
  //  true in the formData
  it('should return a string if freeInput is true in ui:options', done => {
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
    const wrapper = mount(<AutosuggestField {...props} />);

    // Input something not in options
    const input = wrapper.find('input');
    input.simulate('focus');
    input.simulate('change', {
      target: {
        value: 'konami',
      },
    });

    setTimeout(() => {
      const fieldData = onChange.firstCall.args[0];
      expect(fieldData).to.equal('konami');
      wrapper.unmount();
      done();
    });
  });

  it('should run input transformers if freeInput is true and if transformers specified in ui:options', done => {
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
    const wrapper = mount(<AutosuggestField {...props} />);

    // Input something not in options
    const input = wrapper.find('input');
    input.simulate('focus');
    input.simulate('change', {
      target: {
        value: 'konami',
      },
    });

    setTimeout(() => {
      const fieldData = onChange.firstCall.args[0];
      expect(fieldData).to.equal('konami first second');
      wrapper.unmount();
      done();
    });
  });

  it('should call onChange if input exists when setting options', () => {
    const uiSchema = {
      'ui:options': {
        getOptions: () => Promise.resolve([]),
      },
    };
    const formContext = {
      reviewMode: false,
    };
    const onChange = sinon.spy();
    const tree = mount(
      <AutosuggestField
        formData={{ widget: 'autosuggest', label: 'label' }}
        formContext={formContext}
        idSchema={{ $id: 'id' }}
        onChange={onChange}
        uiSchema={uiSchema}
      />,
    );

    onChange.reset();
    tree.instance().setOptions([]);
    expect(onChange.called).to.be.true;
    tree.unmount();
  });

  it('should highlight results if highlightText is true in ui:options', done => {
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
    const wrapper = mount(<AutosuggestField {...props} />);

    // Input something not in options
    const input = wrapper.find('input');
    input.simulate('focus');
    input.simulate('change', {
      target: {
        value: 'Bel',
      },
    });

    setTimeout(() => {
      expect(wrapper.find('.autosuggest-list')).to.exist;
      const firstItem = wrapper.find('.autosuggest-item').first();
      const highlight = firstItem.find('.autosuggest-highlight').text();
      expect(firstItem.text()).to.equal('Label 1');
      expect(highlight).to.equal('bel');

      const lastItem = wrapper.find('.autosuggest-item').last();
      const highlight2 = lastItem.find('.autosuggest-highlight').text();
      expect(lastItem.text()).to.equal('LABEL 2');
      expect(highlight2).to.equal('BEL');
      wrapper.unmount();
      done();
    });
  });
  it('should not throw an error if the value includes regexp special characters', done => {
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
    const wrapper = mount(<AutosuggestField {...props} />);

    // Input something not in options
    const input = wrapper.find('input');
    input.simulate('focus');
    input.simulate('change', {
      target: {
        value: 'Bel(',
      },
    });

    setTimeout(() => {
      expect(wrapper.find('.autosuggest-list')).to.exist;
      const firstItem = wrapper.find('.autosuggest-item').last();
      const highlight = firstItem.find('.autosuggest-highlight').text();
      expect(firstItem.text()).to.equal('Label(1)');
      expect(highlight).to.equal('bel(');
      wrapper.unmount();
      done();
    });
  });
});

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


describe('<AutosuggestField>', () => {
  it('should render', () => {
    const uiSchema = {
      'ui:options': {
        getOptions: () => Promise.resolve([])
      }
    };
    const formContext = {
      reviewMode: false
    };
    const tree = mount(
      <AutosuggestField
        formData={{ widget: 'autosuggest', label: 'label' }}
        formContext={formContext}
        idSchema={{ $id: 'id' }}
        uiSchema={uiSchema}/>
    );

    const input = tree.find('input');
    expect(input.props().id).to.equal('id');
    expect(input.props().name).to.equal('id');
    expect(input.props().value).to.equal('label');
    expect(input.getDOMNode().getAttribute('autocomplete')).to.equal('off');
  });


  it('should render in review mode', () => {
    const uiSchema = {
      'ui:options': {
        getOptions: () => Promise.resolve([])
      }
    };
    const formContext = {
      reviewMode: true
    };
    const tree = shallow(
      <AutosuggestField
        formContext={formContext}
        idSchema={{ $id: 'id' }}
        schema={{ type: 'object' }}
        formData={{ widget: 'autosuggest', label: 'testing' }}
        uiSchema={uiSchema}/>
    );

    expect(tree.find('Downshift').exists()).to.be.false;
    expect(tree.find('dd').text()).to.contain('testing');
  });


  it('should call onChange when suggestion is selected', (done) => {
    const uiSchema = {
      'ui:options': {
        getOptions: () => Promise.resolve([
          {
            id: '1',
            label: 'first'
          },
          {
            id: '2',
            label: 'second'
          }
        ])
      }
    };
    const formContext = {
      reviewMode: false
    };
    const onChange = sinon.spy();

    const tree = mount(
      <AutosuggestField
        formContext={formContext}
        onChange={onChange}
        idSchema={{ $id: 'id' }}
        uiSchema={uiSchema}/>
    );

    const input = tree.find('input');
    input.simulate('focus');
    // input.value = 'fir';
    input.simulate('change', {
      target: {
        value: 'fir'
      }
    });

    setTimeout(() => {
      // Not sure why I have to do this, but enzyme can't find the item element
      const suggestions = tree.getDOMNode().querySelectorAll('.autosuggest-item');
      ReactTestUtils.Simulate.click(suggestions[0]);
      expect(onChange.secondCall.args[0]).to.eql({
        id: '1',
        label: 'first',
        widget: 'autosuggest'
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
        getOptions: () => Promise.resolve([
          {
            id: '1',
            label: 'first'
          },
          {
            id: '2',
            label: 'second'
          }
        ])
      }
    };
    const formContext = {
      reviewMode: false
    };
    const onChange = sinon.spy();

    const tree = mount(
      <AutosuggestField
        formContext={formContext}
        formData={{ widget: 'autosuggest', id: '1', label: 'first' }}
        onChange={onChange}
        idSchema={{ $id: 'id' }}
        uiSchema={uiSchema}/>
    );

    const input = tree.find('input');
    input.simulate('focus');
    input.simulate('change', {
      target: {
        value: ''
      }
    });
    expect(onChange.lastCall.args.length).to.equal(0);
  });


  it('should trigger onBlur', (done) => {
    const uiSchema = {
      'ui:options': {
        getOptions: () => Promise.resolve([
          {
            id: '1',
            label: 'first'
          },
          {
            id: '2',
            label: 'second'
          }
        ])
      }
    };
    const formContext = {
      reviewMode: false
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
        uiSchema={uiSchema}/>
    );

    const input = tree.find('input');
    input.simulate('focus');

    setTimeout(() => {
      input.simulate('blur');
      expect(onBlur.called).to.be.true;
      done();
    });
  });


  it('should leave data on blur if partially filled in', (done) => {
    const uiSchema = {
      'ui:options': {
        getOptions: () => Promise.resolve([
          {
            id: '1',
            label: 'first'
          },
          {
            id: '2',
            label: 'second'
          }
        ])
      }
    };
    const formContext = {
      reviewMode: false
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
        uiSchema={uiSchema}/>
    );

    const input = tree.find('input');
    input.simulate('focus');
    input.simulate('change', {
      target: {
        value: 'fir'
      }
    });

    setTimeout(() => {
      expect(input.getDOMNode().value).to.equal('fir');
      expect(onChange.called).to.be.true;
      input.simulate('blur');
      expect(input.getDOMNode().value).to.equal('fir');
      done();
    });
  });


  it('should use options from enum to get first item', (done) => {
    const uiSchema = {
      'ui:options': {
        labels: {
          AL: 'Label 1',
          BC: 'Label 2'
        }
      }
    };
    const schema = {
      type: 'string',
      'enum': [
        'AL',
        'BC'
      ]
    };
    const formContext = {
      reviewMode: false
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
        uiSchema={uiSchema}/>
    );

    const input = tree.find('input');
    input.simulate('focus');
    input.simulate('change', {
      target: {
        value: 'labe'
      }
    });

    setTimeout(() => {
      input.simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });
      input.simulate('keyDown', { key: 'Enter', keyCode: 13 });
      expect(onChange.lastCall.args[0]).to.eql('AL');
      done();
    }, 0);
  });


  it('should call a function passed in getOptions with formData', (done) => {
    // ...when the input changes and `uiSchema['ui:options'].queryForResults` is true
    const getOptions = sinon.spy(queryForOptions);
    const props = {
      uiSchema: {
        'ui:options': {
          debounceRate: 0,
          getOptions,
          queryForResults: true
        }
      },
      schema: { type: 'string' },
      formContext: { reviewMode: false },
      idSchema: { $id: 'id' },
      onChange: () => {},
      onBlur: () => {}
    };
    const wrapper = mount(<AutosuggestField {...props}/>);

    // Search for 'ir'
    const input = wrapper.find('input');
    input.simulate('focus');
    input.simulate('change', {
      target: {
        value: 'ir'
      }
    });

    // Check that getOptions was called with the form data
    setTimeout(() => {
      const args = getOptions.secondCall.args;
      expect(args[0]).to.eql('ir');
      done();
    });
  });


  it('should use the results of getOptions as the field\'s enum options', (done) => {
    const props = {
      uiSchema: {
        'ui:options': {
          debounceRate: 0,
          getOptions: queryForOptions,
          queryForResults: true
        }
      },
      schema: { type: 'string' },
      formContext: { reviewMode: false },
      idSchema: { $id: 'id' },
      onChange: () => {},
      onBlur: () => {}
    };
    const wrapper = mount(<AutosuggestField {...props}/>);

    setTimeout(() => {
      expect(wrapper.state('options')).to.eql(options);
    }, 100);

    setTimeout(() => {
      // Search for 'ir'
      const input = wrapper.find('input');
      input.simulate('focus');
      input.simulate('change', {
        target: {
          value: 'ir'
        }
      });
    }, 110);

    setTimeout(() => {
      expect(wrapper.state('options')).to.eql([
        { id: 1, label: 'first' },
        { id: 3, label: 'third' }
      ]);
      done();
    }, 210);
  });


  // The stringifyFormReplacer will send the label to the api instead of the id if freeInput is
  //  true in the formData
  it('should return a string if freeInput is true in ui:options', (done) => {
    const onChange = sinon.spy();
    const props = {
      uiSchema: {
        'ui:options': {
          freeInput: true,
          labels: {
            AL: 'Label 1',
            BC: 'Label 2'
          }
        }
      },
      schema: {
        type: 'string',
        'enum': ['AL', 'BC']
      },
      formContext: { reviewMode: false },
      idSchema: { $id: 'id' },
      onChange,
      onBlur: () => {}
    };
    const wrapper = mount(<AutosuggestField {...props}/>);

    // Input something not in options
    const input = wrapper.find('input');
    input.simulate('focus');
    input.simulate('change', {
      target: {
        value: 'konami'
      }
    });

    setTimeout(() => {
      const fieldData = onChange.firstCall.args[0];
      expect(fieldData).to.equal('konami');
      done();
    });
  });

});

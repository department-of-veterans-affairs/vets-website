import React from 'react';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

import AutosuggestField from '../../../../src/js/common/schemaform/fields/AutosuggestField';

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
    const tree = shallow(
      <AutosuggestField
        formData={{ widget: 'autosuggest', label: 'label' }}
        formContext={formContext}
        idSchema={{ $id: 'id' }}
        uiSchema={uiSchema}/>
    );

    const widget = tree.find('Autosuggest');
    expect(widget.exists()).to.be.true;
    expect(widget.props().inputProps.id).to.equal('id');
    expect(widget.props().inputProps.name).to.equal('id');
    expect(widget.props().inputProps.value).to.equal('label');
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
        formData={{ widget: 'autosuggest', label: 'testing' }}
        uiSchema={uiSchema}/>
    );

    expect(tree.find('Autosuggest').exists()).to.be.false;
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
      // Not sure why I have to do this, but enzyme can't find the li element
      const suggestions = tree.getDOMNode().querySelectorAll('li');
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
    expect(onChange.firstCall.args.length).to.equal(0);
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
      expect(onBlur.called).to.be.true;
      done();
    }, 0);
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
});

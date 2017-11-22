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
        formData={{ label: 'label' }}
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
      'ui:options': {}
    };
    const formContext = {
      reviewMode: true
    };
    const tree = shallow(
      <AutosuggestField
        formContext={formContext}
        idSchema={{ $id: 'id' }}
        formData={{ label: 'testing' }}
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
      expect(suggestions.length).to.equal(1);
      ReactTestUtils.Simulate.click(suggestions[0]);
      expect(onChange.firstCall.args[0]).to.eql({
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
        formData={{ id: '1', label: 'first' }}
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
  it('should set data to highlighted suggestion on blur', (done) => {
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
      input.simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });
      input.simulate('blur');
      expect(onChange.firstCall.args[0]).to.eql({
        id: '1',
        label: 'first',
        widget: 'autosuggest'
      });
      expect(onBlur.called).to.be.true;
      done();
    }, 0);
  });
  it('should reset data on blur if partially filled in', (done) => {
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
        formData={{ id: '1', label: 'first' }}
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
      input.simulate('blur');
      expect(onChange.called).to.be.false;
      expect(input.getDOMNode().value).to.equal('first');
      expect(onBlur.called).to.be.true;
      done();
    }, 0);
  });
});

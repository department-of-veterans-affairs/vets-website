import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import ReactTestUtils from 'react-dom/test-utils';
import { findDOMNode } from 'react-dom';
import sinon from 'sinon';

import AutosuggestField from '../../../../src/js/common/schemaform/fields/AutosuggestField';

describe.only('<AutosuggestField>', () => {
  it('should render', () => {
    const uiSchema = {
      'ui:options': {}
    };
    const formContext = {
      reviewMode: false
    };
    const tree = SkinDeep.shallowRender(
      <AutosuggestField
        formData={{ label: 'label' }}
        formContext={formContext}
        idSchema={{ $id: 'id' }}
        uiSchema={uiSchema}/>
    );

    expect(tree.subTree('Autosuggest')).not.to.be.false;
    expect(tree.subTree('Autosuggest').props.inputProps.id).to.equal('id');
    expect(tree.subTree('Autosuggest').props.inputProps.name).to.equal('id');
    expect(tree.subTree('Autosuggest').props.inputProps.value).to.equal('label');
  });
  it('should render in review mode', () => {
    const uiSchema = {
      'ui:options': {}
    };
    const formContext = {
      reviewMode: true
    };
    const tree = SkinDeep.shallowRender(
      <AutosuggestField
        formContext={formContext}
        idSchema={{ $id: 'id' }}
        formData={{ label: 'testing' }}
        uiSchema={uiSchema}/>
    );

    expect(tree.subTree('Autosuggest')).to.be.false;
    expect(tree.subTree('dd').text()).to.contain('testing');
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

    const tree = ReactTestUtils.renderIntoDocument(
      <AutosuggestField
        formContext={formContext}
        onChange={onChange}
        idSchema={{ $id: 'id' }}
        uiSchema={uiSchema}/>
    );
    const field = findDOMNode(tree);

    const input = field.querySelector('input');
    ReactTestUtils.Simulate.focus(field.querySelector('input'));
    input.value = 'fir';
    ReactTestUtils.Simulate.change(input);

    setTimeout(() => {
      const suggestions = field.querySelectorAll('.react-autosuggest__suggestions-list li');
      expect(suggestions.length).to.equal(1);
      ReactTestUtils.Simulate.click(suggestions[0]);
      expect(onChange.firstCall.args[0]).to.eql({
        id: '1',
        label: 'first',
        widget: 'autosuggest'
      });
      done();
    }, 0);
  });
});

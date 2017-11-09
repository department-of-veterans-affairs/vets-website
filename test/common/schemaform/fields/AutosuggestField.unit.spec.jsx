import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import AutosuggestField from '../../../../src/js/common/schemaform/fields/AutosuggestField';

describe.only('<AutosuggestField>', () => {
  it('should render', () => {
    const uiSchema = {
      'ui:options': {

      }
    };
    const formContext = {
      reviewMode: false
    };
    const tree = SkinDeep.shallowRender(
      <AutosuggestField
        formContext={formContext}
        idSchema={{ $id: 'id' }}
        uiSchema={uiSchema}/>
    );

    expect(tree.subTree('Autosuggest')).not.to.be.false;
  });
  it('should render in review mode', () => {
    const uiSchema = {
      'ui:options': {

      }
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
});

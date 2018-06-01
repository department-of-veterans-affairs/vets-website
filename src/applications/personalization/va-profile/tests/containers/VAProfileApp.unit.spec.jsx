import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';

import { VAProfileApp } from '../../containers/VAProfileApp';

describe('<VAProfileApp/>', () => {
  let props = {};

  beforeEach(() => {
    props = {
      user: {},
      profile: {},
      downtimeData: {},
      uiActions: {},
      fetchActions: {},
      updateActions: {},
      updateFormFieldActions: {},
      downtimeActions: {}
    };
  });

  it('should render', () => {
    const wrapper = enzyme.shallow(<VAProfileApp {...props}/>);
    expect(wrapper.find('ProfileView')).to.have.lengthOf(1);
  });
});

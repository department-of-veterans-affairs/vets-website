import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';

import DefaultView from '../../../src/js/feedback/components/DefaultView';

const props = {
  revealForm() {}
};

describe('<DefaultView/>', () => {

  it('should render', () => {
    const wrapper = enzyme.shallow(<DefaultView {...props}/>);
    const text = wrapper.text();
    // console.log(text);
    expect(text.includes('Have suggestions')).to.be.true;
  });

});

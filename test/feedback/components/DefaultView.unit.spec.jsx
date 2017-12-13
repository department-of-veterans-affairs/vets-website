import React from 'react';
import enzyme from 'enzyme';
import chai from 'chai';

import DefaultView from '../../../src/js/feedback/components/DefaultView';

const props = {
  revealForm() {}
};

describe('<DefaultView/>', () => {

  it('should render', () => {
    const wrapper = enzyme.shallow(<DefaultView {...props}/>);
    const text = wrapper.text();
    chai.assert.isTrue(text.includes('Tell us what you think'), 'The title was rendered.');
  });

});

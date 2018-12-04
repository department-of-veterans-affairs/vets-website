import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ButtonBack from '../../../components/buttons/ButtonBack';

const props = {
  url: 'www.vets.gov',
};

const context = {
  router: {},
};

describe('<ButtonBack>', () => {
  it('should render correctly', () => {
    const tree = shallow(<ButtonBack {...props} />, { context });

    expect(tree.find('.msg-btn-back').exists()).to.be.true;
  });
});

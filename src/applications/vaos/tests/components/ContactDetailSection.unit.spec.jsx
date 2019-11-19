import React from 'react';
import { Link } from 'react-router';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ContactDetailSection from '../../components/review/ContactDetailSection';

const data = {
  email: 'joeblow@gmail.com',
  phoneNumber: '123456789',
};

describe('VAOS <ContactDetailSection>', () => {
  let tree;

  beforeEach(() => {
    tree = shallow(<ContactDetailSection data={data} />);
  });

  afterEach(() => {
    tree.unmount();
  });

  it('should render heading', () => {
    expect(tree.find('h3').text()).to.equal('Your contact details');
  });

  it('should render reason for appointment section additional information', () => {
    expect(tree.find('span').text()).to.equal(
      'joeblow@gmail.com123456789Call anytime during the day',
    );
  });

  it('should have aria labels for edit call back time', () => {
    expect(
      tree.find(Link).find('[aria-label="Edit call back time"]'),
    ).to.have.lengthOf(1);
  });
});

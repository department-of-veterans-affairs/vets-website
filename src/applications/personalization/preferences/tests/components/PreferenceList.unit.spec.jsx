import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { spy } from 'sinon';

import PreferenceList from '../../components/PreferenceList';
import { benefitChoices } from '../../helpers';

const handleViewToggle = spy();
const handleRemove = spy();

const props = {
  handleViewToggle,
  handleRemove,
  view: true,
  benefits: benefitChoices,
};

describe('<PreferenceList>', () => {
  it('should render', () => {
    const component = shallow(<PreferenceList {...props} />);
    expect(component.find('PreferenceItem').length).to.equal(10);
  });
});

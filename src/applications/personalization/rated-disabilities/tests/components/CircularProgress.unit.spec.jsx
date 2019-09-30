import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import CircularProgress from '../../components/CircularProgress';

describe('<CircularProgress />', () => {
  it('should render', () => {
    const wrapper = shallow(<CircularProgress percentage={80} />);
    expect(
      wrapper
        .find('div')
        .first()
        .hasClass('circular-progress'),
    ).to.be.true;
  });

  it('Should render the total disability percentage text', () => {
    const wrapper = shallow(<CircularProgress percentage={80} />);
    expect(
      wrapper
        .find('.disability-rating')
        .first()
        .text(),
    ).to.contain('80%');
  });
});

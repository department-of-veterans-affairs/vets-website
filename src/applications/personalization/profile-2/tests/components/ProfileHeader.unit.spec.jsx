import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import ProfileHeader from '../../components/ProfileHeader';

const fakeStore = {
  getState: () => ({
    vaProfile: {
      hero: {
        userFullName: {
          first: 'Johnnie',
          middle: 'Leonard',
          last: 'Weaver',
        },
      },
      militaryInformation: {
        serviceHistory: {
          serviceHistory: [
            {
              branchOfService: 'Army',
              beginDate: '2004-02-01',
              endDate: '2007-02-01',
            },
            {
              branchOfService: 'Navy',
              beginDate: '2007-02-01',
              endDate: '2009-02-01',
            },
            {
              branchOfService: 'Coast Guard',
              beginDate: '2009-02-01',
              endDate: '2019-02-01',
            },
          ],
        },
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

describe('<ProfileHeader>', () => {
  it('should render', () => {
    const component = mount(<ProfileHeader store={fakeStore} />);
    expect(component).to.not.be.undefined;
    component.unmount();
  });
  it('should render name', () => {
    const component = mount(<ProfileHeader store={fakeStore} />);
    expect(
      component
        .find('dd')
        .first()
        .text(),
    ).to.contain('Johnnie Leonard Weaver');
    component.unmount();
  });
  it('should render most recent military service', () => {
    // this will render the most recent military service regardless of where it lands in the array
    const component = mount(<ProfileHeader store={fakeStore} />);
    expect(
      component
        .find('dd')
        .at(1)
        .text(),
    ).to.contain('United States Coast Guard');
    component.unmount();
  });
  it('should render latest service badge', () => {
    const component = mount(<ProfileHeader store={fakeStore} />);
    expect(component.find('img').first()).to.not.be.undefined;
    component.unmount();
  });
});

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
              beginDate: '1/2/2004',
              endDate: '1/2/2007',
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
        .find('h2')
        .first()
        .text(),
    ).to.contain('Johnnie Leonard Weaver');
    component.unmount();
  });
  it('should render military service', () => {
    const component = mount(<ProfileHeader store={fakeStore} />);
    expect(
      component
        .find('h3')
        .first()
        .text(),
    ).to.contain('United States Army');
    component.unmount();
  });
  it('should render latest service badge', () => {
    const component = mount(<ProfileHeader store={fakeStore} />);
    expect(component.find('img').first()).to.not.be.undefined;
    component.unmount();
  });
});

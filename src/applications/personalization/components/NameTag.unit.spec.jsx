import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import NameTag from './NameTag';

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

describe('<NameTag>', () => {
  it('should render', () => {
    const component = mount(<NameTag store={fakeStore} />);
    expect(component).to.not.be.undefined;
    component.unmount();
  });
  it('should render name', () => {
    const component = mount(<NameTag store={fakeStore} />);
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
    const component = mount(<NameTag store={fakeStore} />);
    expect(
      component
        .find('dd')
        .at(1)
        .text(),
    ).to.contain('United States Coast Guard');
    component.unmount();
  });
  it('should render latest service badge', () => {
    const component = mount(<NameTag store={fakeStore} />);
    expect(component.find('img').first()).to.not.be.undefined;
    component.unmount();
  });

  it('should render disability rating when the dashboardShowDashboard2 feature flag is turned on and the user has a disability rating', () => {
    const component = mount(
      <NameTag
        showUpdatedNameTag
        totalDisabilityRating="70"
        store={fakeStore}
      />,
    );
    expect(
      component
        .find('dd')
        .at(2)
        .text(),
    ).to.contain('70% Service connected');
    component.unmount();
  });

  it('should not render disability rating when the dashboardShowDashboard2 feature flag is turned on and the user has no disability rating', () => {
    const component = mount(<NameTag showUpdatedNameTag store={fakeStore} />);
    expect(component.text()).to.not.contain('Service connected');
    component.unmount();
  });
});

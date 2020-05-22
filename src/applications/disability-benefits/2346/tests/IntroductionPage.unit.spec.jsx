import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import IntroductionPage from '../components/IntroductionPage';

describe('IntroductionPage', () => {
  it('should render AlertBox', () => {
    const fakeStore = {
      getState: () => ({
        user: {
          login: {
            currentlyLoggedIn: true,
          },
        },
        mdot: {
          isError: true,
          errorCode: 'MDOT_SUPPLIES_INELIGIBLE',
          pending: false,
          nextAvailabilityDate: '2019-04-01',
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const introductionPage = mount(<IntroductionPage store={fakeStore} />);
    const alertBox = introductionPage.find('AlertBox');
    expect(alertBox).not.to.be.undefined;
    introductionPage.unmount();
  });

  it('should render ineligible supplies content', () => {
    const fakeStore = {
      getState: () => ({
        user: {
          login: {
            currentlyLoggedIn: true,
          },
        },
        mdot: {
          isError: true,
          errorCode: 'MDOT_SUPPLIES_INELIGIBLE',
          pending: false,
          nextAvailabilityDate: '2019-04-01',
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const introductionPage = mount(<IntroductionPage store={fakeStore} />);
    expect(introductionPage.find('h3').text()).to.equal(
      "You can't reorder your items at this time",
    );
    expect(
      introductionPage
        .find('span')
        .at(0)
        .text(),
    ).to.equal(
      "Our records show that your items aren't available for reorder until April 01, 2019. You can only order items once every 5 months.",
    );
    expect(
      introductionPage
        .find('span')
        .at(1)
        .text(),
    ).to.equal(
      'If you need an item sooner, call the DLC Customer Service Section at 303-273-6200 or email dalc.css@va.gov.',
    );
    introductionPage.unmount();
  });

  it('should render deceased veteran content', () => {
    const fakeStore = {
      getState: () => ({
        user: {
          login: {
            currentlyLoggedIn: true,
          },
        },
        mdot: {
          isError: true,
          errorCode: 'MDOT_DECEASED_VETERAN',
          pending: false,
          nextAvailabilityDate: '2019-04-01',
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const introductionPage = mount(<IntroductionPage store={fakeStore} />);
    expect(introductionPage.find('h3').text()).to.equal(
      'Our records show that this Veteran is deceased',
    );
    expect(
      introductionPage
        .find('span')
        .at(0)
        .text(),
    ).to.equal("We can't fulfill an order for this Veteran");
    expect(
      introductionPage
        .find('span')
        .at(1)
        .text(),
    ).to.equal(
      'If this information is incorrect, please call Veterans Benefits Assistance at 800-827-1000, Monday through Friday, 8:00 a.m. to 9:00 p.m. E.T.',
    );
    introductionPage.unmount();
  });

  it('should render veteran not found content', () => {
    const fakeStore = {
      getState: () => ({
        user: {
          login: {
            currentlyLoggedIn: true,
          },
        },
        mdot: {
          isError: true,
          errorCode: 'MDOT_VETERAN_NOT_FOUND',
          pending: false,
          nextAvailabilityDate: '2019-04-01',
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const introductionPage = mount(<IntroductionPage store={fakeStore} />);
    expect(introductionPage.find('h3').text()).to.equal(
      "We can't find your records in our system",
    );
    expect(
      introductionPage
        .find('span')
        .at(0)
        .text(),
    ).to.equal(
      "You can't order hearing aid batteries or accessories at this time because we can't find your records in our system or we're missing some information needed for you to order.",
    );
    expect(
      introductionPage
        .find('span')
        .at(1)
        .text(),
    ).to.equal(
      'If you think this is incorrect, call your audiologist to update your record. Find contact information for your local medical center.',
    );
    introductionPage.unmount();
  });

  it('should render supplies not found content', () => {
    const fakeStore = {
      getState: () => ({
        user: {
          login: {
            currentlyLoggedIn: true,
          },
        },
        mdot: {
          isError: true,
          errorCode: 'MDOT_SUPPLIES_NOT_FOUND',
          pending: false,
          nextAvailabilityDate: '2019-04-01',
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const introductionPage = mount(<IntroductionPage store={fakeStore} />);
    expect(introductionPage.find('h3').text()).to.equal(
      "You can't reorder your items at this time",
    );
    expect(
      introductionPage
        .find('span')
        .at(0)
        .text(),
    ).to.equal(
      "You can't order hearing aid batteries or accessories online at this time because you haven't placed an order within the past two years",
    );
    expect(
      introductionPage
        .find('span')
        .at(1)
        .text(),
    ).to.equal(
      'If you need to place an order, call the DLC Customer Service Section at 303-273-6200 or email dalc.css@va.gov.',
    );
    introductionPage.unmount();
  });
});

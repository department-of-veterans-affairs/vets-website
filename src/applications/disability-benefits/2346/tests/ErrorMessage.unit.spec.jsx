import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import ErrorMessage from '../components/ErrorMessage';

describe('ErrorMessage', () => {
  it('should render AlertBox', () => {
    const fakeStore = {
      getState: () => ({
        mdot: {
          errorCode: 'MDOT_SUPPLIES_INELIGIBLE',
          nextAvailabilityDate: '2019-04-01',
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const errorMessage = mount(<ErrorMessage store={fakeStore} />);
    const alertBox = errorMessage.find('AlertBox');
    expect(alertBox).not.to.be.undefined;
    errorMessage.unmount();
  });

  it('should render ineligible supplies content', () => {
    const fakeStore = {
      getState: () => ({
        mdot: {
          errorCode: 'MDOT_SUPPLIES_INELIGIBLE',
          nextAvailabilityDate: '2019-04-01',
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const errorMessage = mount(<ErrorMessage store={fakeStore} />);
    expect(errorMessage.find('h3').text()).to.equal(
      "You can't reorder your items at this time",
    );
    expect(
      errorMessage
        .find('span')
        .at(0)
        .text(),
    ).to.equal(
      "Our records show that your items aren't available for reorder until April 01, 2019. You can only order items once every 5 months.",
    );
    expect(
      errorMessage
        .find('span')
        .at(1)
        .text(),
    ).to.equal(
      'If you need an item sooner, call the DLC Customer Service Section at 303-273-6200 or email dalc.css@va.gov.',
    );
    errorMessage.unmount();
  });

  it('should render deceased veteran content', () => {
    const fakeStore = {
      getState: () => ({
        mdot: {
          errorCode: 'MDOT_DECEASED',
          pending: false,
          nextAvailabilityDate: '2019-04-01',
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const errorMessage = mount(<ErrorMessage store={fakeStore} />);
    expect(errorMessage.find('h3').text()).to.equal(
      'Our records show that this Veteran is deceased',
    );
    expect(
      errorMessage
        .find('span')
        .at(0)
        .text(),
    ).to.equal("We can't fulfill an order for this Veteran");
    expect(
      errorMessage
        .find('span')
        .at(1)
        .text(),
    ).to.equal(
      'If this information is incorrect, please call Veterans Benefits Assistance at 800-827-1000, Monday through Friday, 8:00 a.m. to 9:00 p.m. E.T.',
    );
    errorMessage.unmount();
  });

  it('should render veteran not found content', () => {
    const fakeStore = {
      getState: () => ({
        mdot: {
          errorCode: 'MDOT_INVALID',
          nextAvailabilityDate: '2019-04-01',
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const errorMessage = mount(<ErrorMessage store={fakeStore} />);
    expect(errorMessage.find('h3').text()).to.equal(
      "We can't find your records in our system",
    );
    expect(
      errorMessage
        .find('span')
        .at(0)
        .text(),
    ).to.equal(
      "You can't order hearing aid batteries or accessories at this time because we can't find your records in our system or we're missing some information needed for you to order.",
    );
    expect(
      errorMessage
        .find('span')
        .at(1)
        .text(),
    ).to.equal(
      'If you think this is incorrect, call your audiologist to update your record. Find contact information for your local medical center.',
    );
    errorMessage.unmount();
  });

  it('should render supplies not found content', () => {
    const fakeStore = {
      getState: () => ({
        mdot: {
          errorCode: 'MDOT_SUPPLIES_NOT_FOUND',

          nextAvailabilityDate: '2019-04-01',
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const errorMessage = mount(<ErrorMessage store={fakeStore} />);
    expect(errorMessage.find('h3').text()).to.equal(
      "You can't reorder your items at this time",
    );
    expect(
      errorMessage
        .find('span')
        .at(0)
        .text(),
    ).to.equal(
      "You can't order hearing aid batteries or accessories online at this time because you haven't placed an order within the past two years",
    );
    expect(
      errorMessage
        .find('span')
        .at(1)
        .text(),
    ).to.equal(
      'If you need to place an order, call the DLC Customer Service Section at 303-273-6200 or email dalc.css@va.gov.',
    );
    errorMessage.unmount();
  });
});

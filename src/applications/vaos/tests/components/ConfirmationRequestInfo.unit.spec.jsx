import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import ConfirmationRequestInfo from '../../components/ConfirmationRequestInfo';

describe('VAOS <ConfirmationRequestInfo>', () => {
  it('should render VA request', () => {
    const data = {
      visitType: 'office',
      bestTimeToCall: {
        morning: true,
        afternoon: true,
      },
      calendarData: {
        selectedDates: [{ date: '2019-12-20', optionTime: 'AM' }],
      },
    };
    const facilityDetails = {
      name: 'CHYSHR-Sidney VA Clinic',
      id: 'var983',
      address: {
        postalCode: '82001-5356',
        city: 'Cheyenne',
        state: 'WY',
        line: ['2360 East Pershing Boulevard'],
      },
    };
    const pageTitle = 'Your appointment request has been submitted';

    const tree = mount(
      <ConfirmationRequestInfo
        data={data}
        facilityDetails={facilityDetails}
        pageTitle={pageTitle}
      />,
    );

    const text = tree.text();

    const heading = tree.find('h1');

    expect(text).not.to.contain('Community Care');
    expect(text).to.contain('CHYSHR-Sidney VA Clinic');
    expect(text).to.contain('Cheyenne, WY');

    expect(tree.find('AlertBox').exists()).to.be.true;
    expect(tree);
    expect(heading.exists()).to.be.true;
    expect(heading.text()).to.equal(pageTitle);

    tree.unmount();
  });

  it('should render CC request', () => {
    const data = {
      facilityType: 'communityCare',
      distanceWillingToTravel: '25',
      preferredLanguage: 'english',
      visitType: 'office',
      bestTimeToCall: {
        morning: true,
        afternoon: true,
      },
      hasCommunityCareProvider: true,
      communityCareProvider: {
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '5555555555',
        address: {
          street: '123 Test',
          city: 'Northampton',
          state: 'MA',
          postalCode: '01060',
        },
      },
      calendarData: {
        selectedDates: [{ date: '2019-12-20', optionTime: 'AM' }],
      },
    };
    const facilityDetails = {
      name: 'CHYSHR-Sidney VA Clinic',
      address: {
        id: 'var983',
        name: 'Cheyenne VA Medical Center',
        address: {
          postalCode: '82001-5356',
          city: 'Cheyenne',
          state: 'WY',
          line: ['2360 East Pershing Boulevard'],
        },
      },
    };

    const pageTitle = 'Your appointment request has been submitted';
    const tree = mount(
      <ConfirmationRequestInfo
        data={data}
        facilityDetails={facilityDetails}
        vaCityState="Cheyenne, WY"
        pageTitle={pageTitle}
      />,
    );

    const text = tree.text();
    const heading = tree.find('h1');

    expect(text).to.contain('Community Care');
    expect(text).not.to.contain('CHYSHR-Sidney VA Clinic');
    expect(text).to.contain('Jane Doe');
    expect(text).to.contain('5555555555');
    expect(text).to.contain('Northampton, MA');

    expect(tree.find('AlertBox').exists()).to.be.true;
    expect(tree.find('h1').exists()).to.be.true;
    expect(heading.exists()).to.be.true;
    expect(heading.text()).to.equal(pageTitle);

    tree.unmount();
  });

  it('should render CC request without provider', () => {
    const data = {
      facilityType: 'communityCare',
      distanceWillingToTravel: '25',
      preferredLanguage: 'english',
      visitType: 'office',
      bestTimeToCall: {
        morning: true,
        afternoon: true,
      },
      hasCommunityCareProvider: false,
      calendarData: {
        selectedDates: [{ date: '2019-12-20', optionTime: 'AM' }],
      },
    };
    const facilityDetails = {
      name: 'CHYSHR-Sidney VA Clinic',
      address: {
        id: 'var983',
        name: 'Cheyenne VA Medical Center',
        address: {
          postalCode: '82001-5356',
          city: 'Cheyenne',
          state: 'WY',
          line: ['2360 East Pershing Boulevard'],
        },
      },
    };

    const pageTitle = 'Your appointment request has been submitted';
    const tree = mount(
      <ConfirmationRequestInfo
        data={data}
        facilityDetails={facilityDetails}
        vaCityState="Cheyenne, WY"
        pageTitle={pageTitle}
      />,
    );

    const text = tree.text();
    const heading = tree.find('h1');

    expect(text).to.contain('Community Care');
    expect(text).not.to.contain('CHYSHR-Sidney VA Clinic');
    expect(text).to.contain('No preference');

    expect(tree.find('AlertBox').exists()).to.be.true;
    expect(tree.find('h1').exists()).to.be.true;
    expect(heading.exists()).to.be.true;
    expect(heading.text()).to.equal(pageTitle);

    tree.unmount();
  });

  it('should render single time', () => {
    const data = {
      visitType: 'office',
      bestTimeToCall: {
        evening: true,
      },
      calendarData: {
        selectedDates: [{ date: '2019-12-20', optionTime: 'AM' }],
      },
    };
    const facilityDetails = {
      name: 'CHYSHR-Sidney VA Clinic',
      address: {
        id: 'var983',
        name: 'Cheyenne VA Medical Center',
        address: {
          postalCode: '82001-5356',
          city: 'Cheyenne',
          state: 'WY',
          line: ['2360 East Pershing Boulevard'],
        },
      },
    };
    const pageTitle = 'Your appointment request has been submitted';

    const tree = mount(
      <ConfirmationRequestInfo
        data={data}
        facilityDetails={facilityDetails}
        pageTitle={pageTitle}
      />,
    );

    tree
      .find('AdditionalInfo')
      .find('button')
      .simulate('click');
    tree.setProps();

    const text = tree.text();

    expect(text).to.contain('Evening');
    expect(text).to.contain('Show less');

    tree.unmount();
  });

  it('should render message for all times', () => {
    const data = {
      visitType: 'office',
      bestTimeToCall: {
        evening: true,
        morning: true,
        afternoon: true,
      },
      calendarData: {
        selectedDates: [{ date: '2019-12-20', optionTime: 'AM' }],
      },
    };
    const facilityDetails = {
      name: 'CHYSHR-Sidney VA Clinic',
      address: {
        id: 'var983',
        name: 'Cheyenne VA Medical Center',
        address: {
          postalCode: '82001-5356',
          city: 'Cheyenne',
          state: 'WY',
          line: ['2360 East Pershing Boulevard'],
        },
      },
    };
    const pageTitle = 'Your appointment request has been submitted';

    const tree = mount(
      <ConfirmationRequestInfo
        data={data}
        facilityDetails={facilityDetails}
        pageTitle={pageTitle}
      />,
    );

    tree
      .find('AdditionalInfo')
      .find('button')
      .simulate('click');
    tree.setProps();

    const text = tree.text();

    expect(text).to.contain('Anytime during the day');
    expect(tree.find('.vaos-u-word-break--break-word').exists()).to.be.true;
    tree.unmount();
  });
});

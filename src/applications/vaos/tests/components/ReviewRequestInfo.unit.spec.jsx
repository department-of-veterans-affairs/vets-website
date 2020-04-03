import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import ReviewRequestInfo from '../../components/review/ReviewRequestInfo';
import PreferredDates from '../../components/review/PreferredDates';

const defaultData = {
  phoneNumber: '5035551234',
  bestTimeToCall: {
    morning: true,
    afternoon: true,
  },
  email: 'joeblow@gmail.com',
  visitType: 'office',
  reasonForAppointment: 'routine-follow-up',
  reasonAdditionalInfo: 'additional information',
  calendarData: {
    selectedDates: [
      {
        date: '2019-11-25',
        optionTime: 'PM',
      },
      {
        date: '2019-11-26',
        optionTime: 'AM',
      },
      {
        date: '2019-11-27',
        optionTime: 'AM',
      },
    ],
  },
  facilityType: 'vamc',
  typeOfCareId: '323',
};

const facility = {
  institutionCode: '983GB',
  name: 'CHYSHR-Sidney VA Clinic',
  city: 'Sidney',
  stateAbbrev: 'NE',
  authoritativeName: 'CHYSHR-Sidney VA Clinic',
  rootStationCode: '983',
  adminParent: false,
  parentStationCode: '983',
  institutionTimezone: 'America/Denver',
};

const pageTitle = 'Review your appointment details';

describe('VAOS <ReviewRequestInfo>', () => {
  describe('VA Request', () => {
    const data = { ...defaultData };
    const tree = mount(
      <ReviewRequestInfo
        data={data}
        facility={facility}
        pageTitle={pageTitle}
      />,
    );
    const text = tree.text();
    const heading = tree.find('h1');

    // console.log(tree.debug());
    it('should render page heading', () => {
      expect(heading.exists()).to.be.true;
      expect(heading.text()).to.equal(pageTitle);
    });

    it('should render VA request section', () => {
      expect(text).to.contain('VA Appointment');
    });

    it('should render type of care section', () => {
      expect(text).to.contain('Primary care');
    });

    it('should render addional information section', () => {
      expect(text).to.contain('additional information');
    });

    it('should render preferred date and time section', () => {
      expect(text).to.contain('November 25, 2019 in the afternoon');
    });

    it('should render contact details section', () => {
      expect(text).to.contain(
        'joeblow@gmail.com5035551234Call morning or afternoon',
      );
    });

    tree.unmount();
  });

  describe('CC Request', () => {
    const data = {
      ...defaultData,
      facilityType: 'communityCare',
      hasCommunityCareProvider: true,
      communityCareProvider: {
        practiceName: 'Practice name',
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '5555555555',
        address: {
          street: '123 Test',
          street2: 'line 2',
          city: 'Northampton',
          state: 'MA',
          postalCode: '01060',
        },
      },
    };
    let tree;
    let text;
    let heading;

    beforeEach(() => {
      tree = mount(
        <ReviewRequestInfo
          data={data}
          facility={facility}
          pageTitle={pageTitle}
        />,
      );
      text = tree.text();
      heading = tree.find('h1');
    });

    afterEach(() => {
      tree.unmount();
    });

    it('should render page heading', () => {
      expect(heading.exists()).to.be.true;
      expect(heading.text()).to.equal(pageTitle);
    });

    it('should render CC request section', () => {
      expect(text).to.contain('Community Care');
    });

    it('should render type of care section', () => {
      expect(text).to.contain('Primary care');
    });

    describe('Preferred provider section', () => {
      it('should render provider information', () => {
        expect(text).to.contain('Practice name');
      });
    });

    it('should render additional information section', () => {
      expect(text).to.contain('additional information');
    });

    it('should render preferred date section', () => {
      expect(text).to.contain('November 25, 2019 in the afternoon');
    });

    it('should render multiple preferred dates', () => {
      expect(tree.find(PreferredDates).find('li')).to.have.lengthOf(3);
    });

    it('should render contact details section', () => {
      expect(text).to.contain(
        'joeblow@gmail.com5035551234Call morning or afternoon',
      );
    });
  });

  describe('CC Request with no provider preferrence', () => {
    const data = {
      ...defaultData,
      facilityType: 'communityCare',
      hasCommunityCareProvider: false,
      preferredLanguage: 'english',
    };
    const vaCityState = 'Cheyenne, WY';

    let tree;
    let text;

    beforeEach(() => {
      tree = mount(<ReviewRequestInfo data={data} vaCityState={vaCityState} />);
      text = tree.text();
    });

    afterEach(() => {
      tree.unmount();
    });

    it('should render CC request section', () => {
      expect(text).to.contain('Community Care');
    });

    it('should render type of care section', () => {
      expect(text).to.contain('Primary care');
    });

    it('should render preferred language', () => {
      expect(text).to.contain('English');
    });
    it('should render preferred city and state', () => {
      expect(text).to.contain('Cheyenne, WY');
    });
  });

  describe('Accessibility', () => {
    const data = {
      ...defaultData,
      facilityType: 'communityCare',
      hasCommunityCareProvider: false,
      preferredLanguage: 'english',
    };
    const vaCityState = 'Cheyenne, WY';

    let tree;

    beforeEach(() => {
      tree = mount(<ReviewRequestInfo data={data} vaCityState={vaCityState} />);
    });

    afterEach(() => {
      tree.unmount();
    });

    it('should have aria labels for HR to hide from screen reader', () => {
      expect(tree.find('hr[aria-hidden="true"]').exists()).to.be.true;
    });
  });
});

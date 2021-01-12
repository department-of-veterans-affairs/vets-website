import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import VeteranInfoReviewPage from '../../../components/veteran-info/VeteranInfoReviewPage';

describe('health care questionnaire - display vets information on review page', () => {
  it('shows basic information - full name, gender and date of birth', () => {
    const formData = {
      veteranInfo: {
        fullName: 'Mickey Mouse',
        gender: 'M',
        dateOfBirth: '1988-12-12',
      },
    };
    const component = mount(<VeteranInfoReviewPage formData={formData} />);
    expect(component.find('dt[data-testid="Name-label"]').text()).to.equal(
      'Name',
    );
    expect(component.find('dd[data-testid="Name-value"]').text()).to.equal(
      'Mickey Mouse',
    );
    expect(component.find('dt[data-testid="Gender-label"]').text()).to.equal(
      'Gender',
    );
    expect(component.find('dd[data-testid="Gender-value"]').text()).to.equal(
      'Male',
    );
    expect(
      component.find('dt[data-testid="Date of birth-label"]').text(),
    ).to.equal('Date of birth');
    expect(
      component.find('dd[data-testid="Date of birth-value"]').text(),
    ).to.equal('12/12/1988');
    component.unmount();
  });
  it('shows phone numbers - some numbers missing', () => {
    const formData = {
      veteranInfo: {
        phones: [
          {
            label: 'Home',
            data: {
              areaCode: '503',
              countryCode: '1',
              createdAt: '2018-04-21T20:09:50Z',
              effectiveEndDate: '2018-04-21T20:09:50Z',
              effectiveStartDate: '2018-04-21T20:09:50Z',
              extension: '0000',
              id: 123,
              isInternational: false,
              isTextable: false,
              isTextPermitted: false,
              isTty: true,
              isVoicemailable: true,
              phoneNumber: '2222222',
              phoneType: 'HOME',
              sourceDate: '2018-04-21T20:09:50Z',
              updatedAt: '2018-04-21T20:09:50Z',
            },
          },
          {
            label: 'Mobile',
            data: {
              areaCode: '503',
              countryCode: '1',
              createdAt: '2018-04-21T20:09:50Z',
              effectiveEndDate: '2018-04-21T20:09:50Z',
              effectiveStartDate: '2018-04-21T20:09:50Z',
              extension: '0000',
              id: 123,
              isInternational: false,
              isTextable: true,
              isTextPermitted: null,
              isTty: true,
              isVoicemailable: true,
              phoneNumber: '5551234',
              phoneType: 'MOBILE',
              sourceDate: '2018-04-21T20:09:50Z',
              updatedAt: '2018-04-21T20:09:50Z',
            },
          },
          {
            label: 'Work',
            data: null,
          },
          {
            label: 'Temporary',
            data: {
              areaCode: '503',
              countryCode: '1',
              createdAt: '2018-04-21T20:09:50Z',
              effectiveEndDate: '2018-04-21T20:09:50Z',
              effectiveStartDate: '2018-04-21T20:09:50Z',
              extension: '0000',
              id: 123,
              isInternational: false,
              isTextable: false,
              isTextPermitted: false,
              isTty: true,
              isVoicemailable: true,
              phoneNumber: '5555555',
              phoneType: 'MOBILE',
              sourceDate: '2018-04-21T20:09:50Z',
              updatedAt: '2018-04-21T20:09:50Z',
            },
          },
        ],
      },
    };
    const component = mount(<VeteranInfoReviewPage formData={formData} />);
    expect(
      component.find('dt[data-testid="Home phone-label"]').exists(),
    ).to.equal(true);
    expect(
      component.find('dt[data-testid="Mobile phone-label"]').exists(),
    ).to.equal(true);
    expect(
      component.find('dt[data-testid="Work phone-label"]').exists(),
    ).to.equal(false);
    expect(
      component.find('dt[data-testid="Temporary phone-label"]').exists(),
    ).to.equal(true);
    component.unmount();
  });
  it('shows phone numbers - no numbers', () => {
    const formData = {
      veteranInfo: {
        phones: [
          {
            label: 'Home',
            data: null,
          },
          {
            label: 'Mobile',
            data: null,
          },
          {
            label: 'Work',
            data: null,
          },
          {
            label: 'Temporary',
            data: null,
          },
        ],
      },
    };
    const component = mount(<VeteranInfoReviewPage formData={formData} />);
    expect(
      component.find('dt[data-testid="Home phone-label"]').exists(),
    ).to.equal(false);
    expect(
      component.find('dt[data-testid="Mobile phone-label"]').exists(),
    ).to.equal(false);
    expect(
      component.find('dt[data-testid="Work phone-label"]').exists(),
    ).to.equal(false);
    expect(
      component.find('dt[data-testid="Temporary phone-label"]').exists(),
    ).to.equal(false);
    component.unmount();
  });
  it('shows basic information - in a dl tag', () => {
    const formData = {
      veteranInfo: {
        fullName: 'Mickey Mouse',
        gender: 'M',
        dateOfBirth: '1988-12-12',
      },
    };
    const component = mount(<VeteranInfoReviewPage formData={formData} />);
    expect(
      component.find('dl.review[data-testid="veteran-information"]').exists(),
    ).to.equal(true);

    component.unmount();
  });
  it('shows mailing address - full information', () => {
    const formData = {
      veteranInfo: {
        addresses: {
          mailing: {
            addressLine1: '123 Fake Street',
            city: 'DoesNotExistVille',
            stateCode: 'PA',
            zipCode: '12345',
          },
        },
      },
    };
    const component = mount(<VeteranInfoReviewPage formData={formData} />);
    expect(
      component.find('dt[data-testid="Mailing address-label"]').length,
    ).to.equal(1);
    expect(
      component.find('dd[data-testid="Mailing address-value"]').length,
    ).to.equal(1);
    component.unmount();
  });
  it('shows residential address - full information', () => {
    const formData = {
      veteranInfo: {
        addresses: {
          residential: {
            addressLine1: '123 Fake Street',
            city: 'DoesNotExistVille',
            stateCode: 'PA',
            zipCode: '12345',
          },
        },
      },
    };
    const component = mount(<VeteranInfoReviewPage formData={formData} />);
    expect(
      component.find('dt[data-testid="Home address-label"]').length,
    ).to.equal(1);
    expect(
      component.find('dd[data-testid="Home address-value"]').length,
    ).to.equal(1);
    component.unmount();
  });
  it('shows addresses - all information', () => {
    const formData = {
      veteranInfo: {
        addresses: {
          residential: {
            addressLine1: '123 Fake street',
            city: 'DoesNotExistVille',
            stateCode: 'PA',
            zipCode: '12345',
          },
          mailing: {
            addressLine1: '123 Fake street',
            city: 'DoesNotExistVille',
            stateCode: 'PA',
            zipCode: '12345',
          },
        },
      },
    };
    const component = mount(<VeteranInfoReviewPage formData={formData} />);
    expect(
      component.find('dt[data-testid="Home address-label"]').length,
    ).to.equal(1);
    expect(
      component.find('dd[data-testid="Home address-value"]').length,
    ).to.equal(1);
    expect(
      component.find('dt[data-testid="Mailing address-label"]').length,
    ).to.equal(1);
    expect(
      component.find('dd[data-testid="Mailing address-value"]').length,
    ).to.equal(1);

    component.unmount();
  });
  it('shows addressed - no information', () => {
    const formData = {
      veteranInfo: {
        addresses: {
          residential: null,
          mailing: null,
        },
      },
    };
    const component = mount(<VeteranInfoReviewPage formData={formData} />);
    expect(
      component.find('dt[data-testid="Home address-label"]').exists(),
    ).to.equal(false);
    expect(
      component.find('dt[data-testid="Mailing address-label"]').exists(),
    ).to.equal(false);

    component.unmount();
  });
});

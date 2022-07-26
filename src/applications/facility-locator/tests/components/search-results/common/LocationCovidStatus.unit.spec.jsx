import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import LocationCovidStatus from '../../../../components/search-results-items/common/LocationCovidStatus';

const covidSupplementalStatus = {
  dataID: 'covid_high-message',
  obj: [
    {
      id: 'COVID_HIGH',
      label: 'COVID-19 health protection: Levels High',
    },
  ],
};

const staticCovidStatuses = [
  {
    description: '<p>COVID Low</p>',
    name: 'COVID-19 health protection: Levels low',
    // eslint-disable-next-line camelcase
    status_id: 'COVID_LOW',
  },
  {
    description: '<p>COVID Medium</p>',
    name: 'COVID-19 health protection: Levels medium',
    // eslint-disable-next-line camelcase
    status_id: 'COVID_MEDIUM',
  },
  {
    description: '<p>COVID High</p>',
    name: 'COVID-19 health protection: Levels high',
    // eslint-disable-next-line camelcase
    status_id: 'COVID_HIGH',
  },
];

describe('LocationCovidStatus', () => {
  it('Should render the expected status', () => {
    const covidStatus = covidSupplementalStatus;
    const wrapper = shallow(
      <LocationCovidStatus
        supplementalStatus={covidStatus.obj}
        staticCovidStatuses={staticCovidStatuses}
      />,
    );

    expect(wrapper.find('va-alert-expandable').props()['data-testid']).to.eq(
      covidStatus.dataID,
    );
    wrapper.unmount();
  });

  it('Should not render if there is no static data', () => {
    const covidStatus = covidSupplementalStatus;
    const wrapper = shallow(
      <LocationCovidStatus
        supplementalStatus={covidStatus.obj}
        staticCovidStatuses={[]}
      />,
    );
    expect(wrapper.find('va-alert-expandable')).to.be.empty;
    wrapper.unmount();
  });

  it('Should not render if there is no matching statuses', () => {
    const covidStatus = covidSupplementalStatus;
    const fakeCovidStatus = [
      {
        description: '<p>COVID Sassafras</p>',
        name: 'COVID-19 health protection: Levels Sassafras',
        // eslint-disable-next-line camelcase
        status_id: 'COVID_Sassafras',
      },
    ];

    const wrapper = shallow(
      <LocationCovidStatus
        supplementalStatus={covidStatus.obj}
        staticCovidStatuses={fakeCovidStatus}
      />,
    );
    expect(wrapper.find('va-alert-expandable')).to.be.empty;
    wrapper.unmount();
  });

  it('passes an axeCheck', () => {
    const covidStatus = covidSupplementalStatus;

    axeCheck(
      <LocationCovidStatus
        supplementalStatus={covidStatus.obj}
        staticCovidStatuses={staticCovidStatuses}
      />,
    );
  });
});

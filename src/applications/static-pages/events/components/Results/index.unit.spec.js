import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { render } from '@testing-library/react';
import { Results } from '.';
import { ResultsWhereContent } from './ResultsWhereContent';
import { generateTestEvents } from '../../helpers/event-generator';

describe('Events <Results>', () => {
  it('renders what we expect', () => {
    const props = {
      results: generateTestEvents(),
    };
    const wrapper = shallow(<Results {...props} />);

    expect(wrapper.text()).not.includes('No results found');

    wrapper.unmount();
  });
});

describe('Events <ResultsWhereContent>', () => {
  function getProps(locationObj, locationString, locationReadable) {
    return {
      fieldFacilityLocation: locationObj,
      fieldLocationType: locationString,
      fieldLocationHumanreadable: locationReadable,
    };
  }

  it('renders online event prompt when event location type is online', () => {
    const onlineEvent = getProps({}, 'online', null);
    const component = render(<ResultsWhereContent event={onlineEvent} />);
    expect(component.getByText('This is an online event.')).to.exist;
  });

  it('render given location when included in location array', () => {
    const locationArrayEvent = getProps({}, '', 'pittsburgh');
    const component = render(
      <ResultsWhereContent event={locationArrayEvent} />,
    );
    expect(component.getByText('pittsburgh')).to.exist;
  });

  it('renders location name when given in location object', () => {
    const fieldLocationExample = {
      entity: {
        title: 'test location',
        entityUrl: {},
      },
    };
    const locationObjectEvent = getProps(fieldLocationExample, '', null);
    const component = render(
      <ResultsWhereContent event={locationObjectEvent} />,
    );
    expect(component.getByText('test location')).to.exist;
  });

  it('renders directions to google maps link', () => {
    const fieldLocationExample = {
      entity: {
        title: 'test location',
        entityUrl: {},
        fieldAddress: {
          locality: 'Los Angeles',
          administrativeArea: 'CA',
          postalCode: '90012-3328',
          addressLine1: '351 East Temple Street',
        },
      },
    };
    const locationObjectEvent = getProps(fieldLocationExample, '', null);
    const component = render(
      <ResultsWhereContent event={locationObjectEvent} />,
    );
    expect(component.getByText('Get directions on Google Maps')).to.exist;
  });
});

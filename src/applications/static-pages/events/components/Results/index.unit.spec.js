// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { render } from '@testing-library/react';
// Relative imports.
import { Results } from '.';
import { ResultsWhereContent } from './ResultsWhereContent';

describe('Events <Results>', () => {
  it('renders what we expect', () => {
    // Set up.
    const wrapper = shallow(<Results />);

    // Assertions.
    expect(wrapper.text()).includes('No results found');

    // Clean up.
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
});

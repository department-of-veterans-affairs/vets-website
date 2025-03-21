import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { Results, formatEventDateTime } from '.';
import { ResultsWhereContent } from './ResultsWhereContent';
import { generateTestEvents } from '../../helpers/event-generator';

describe('formatEventDateTime', () => {
  const mockDateTimeRange = {
    value: 1742565600, // Fri, Mar 21, 2025 9:00 AM UTC
    endValue: 1742572800, // Fri, Mar 21, 2025 11:00 AM UTC
    timezone: 'America/Chicago',
  };

  let resolvedOptionsStub;

  beforeEach(() => {
    resolvedOptionsStub = sinon.stub(
      Intl.DateTimeFormat.prototype,
      'resolvedOptions',
    );
  });

  afterEach(() => {
    resolvedOptionsStub.restore();
  });

  it('formats event correctly for US users (Pacific Time)', () => {
    resolvedOptionsStub.returns({ timeZone: 'America/Los_Angeles' });

    const {
      formattedStartsAt,
      formattedEndsAt,
      endsAtTimezone,
    } = formatEventDateTime(mockDateTimeRange);

    expect(formattedStartsAt).to.equal('Fri. Mar 21, 2025, 7:00 a.m.');
    expect(formattedEndsAt).to.equal('9:00 a.m.');
    expect(endsAtTimezone).to.equal('PT');
  });

  it('formats event correctly for international users (India - IST)', () => {
    resolvedOptionsStub.returns({ timeZone: 'Asia/Kolkata' });

    const {
      formattedStartsAt,
      formattedEndsAt,
      endsAtTimezone,
    } = formatEventDateTime(mockDateTimeRange);

    expect(formattedStartsAt).to.equal('Fri. Mar 21, 2025, 9:00 a.m.');
    expect(formattedEndsAt).to.equal('11:00 a.m.');
    expect(endsAtTimezone).to.equal('CT');
  });

  it('defaults to America/New_York when event timezone is missing and user is international', () => {
    resolvedOptionsStub.returns({ timeZone: 'Europe/London' });

    const mockDateTimeNoTimezone = {
      ...mockDateTimeRange,
      timezone: undefined,
    };
    const {
      formattedStartsAt,
      formattedEndsAt,
      endsAtTimezone,
    } = formatEventDateTime(mockDateTimeNoTimezone);

    expect(formattedStartsAt).to.equal('Fri. Mar 21, 2025, 10:00 a.m.');
    expect(formattedEndsAt).to.equal('12:00 p.m.');
    expect(endsAtTimezone).to.equal('ET');
  });

  it('uses system time for US users when event timezone is missing', () => {
    resolvedOptionsStub.returns({ timeZone: 'America/Denver' });

    const mockDateTimeNoTimezone = {
      ...mockDateTimeRange,
      timezone: undefined,
    };
    const {
      formattedStartsAt,
      formattedEndsAt,
      endsAtTimezone,
    } = formatEventDateTime(mockDateTimeNoTimezone);

    expect(formattedStartsAt).to.equal('Fri. Mar 21, 2025, 8:00 a.m.');
    expect(formattedEndsAt).to.equal('10:00 a.m.');
    expect(endsAtTimezone).to.equal('MT');
  });
});

describe('Events <Results>', () => {
  it('renders what we expect', () => {
    const props = {
      results: generateTestEvents(),
    };
    const wrapper = shallow(<Results {...props} />);

    expect(wrapper.text()).not.includes('No results found');

    wrapper.unmount();
  });

  it('renders what we expect when there are no results', () => {
    const screen = render(<Results query="search" />);

    expect(
      screen.getByTestId('events-results-none-found').textContent,
    ).to.equal('No results found for search');
  });

  it('renders what we expect when there are no results for custom date range', () => {
    const screen = render(
      <Results query="search" queryId="custom-date-range" results={[]} />,
    );

    expect(
      screen.getByTestId('events-results-none-found').textContent,
    ).to.equal('No results found for Custom date range');
  });
});

describe('Events <ResultsWhereContent>', () => {
  const getProps = (locationObj, locationString, locationReadable) => {
    return {
      fieldFacilityLocation: locationObj,
      fieldLocationType: locationString,
      fieldLocationHumanreadable: locationReadable,
    };
  };

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

import { expect } from 'chai';
import sinon from 'sinon';
import {
  parseISO,
  startOfDay,
  endOfDay,
  subYears,
  addMonths,
  formatISO,
} from 'date-fns';
import {
  concatObservationInterpretations,
  dateFormat,
  dateFormatWithoutTimezone,
  dispatchDetails,
  extractContainedByRecourceType,
  extractContainedResource,
  formatDate,
  formatDateInLocalTimezone,
  formatNameFirstToLast,
  getActiveLinksStyle,
  getAppointmentsDateRange,
  getLastUpdatedText,
  getMonthFromSelectedDate,
  getObservationValueWithUnits,
  getReactions,
  getStatusExtractPhase,
  handleDataDogAction,
  nameFormat,
  processList,
  removeTrailingSlash,
  formatDateAndTimeWithGenericZone,
} from '../../util/helpers';
import { refreshPhases, VALID_REFRESH_DURATION } from '../../util/constants';

describe('Name formatter', () => {
  it('formats a name with a first, middle, last, and suffix', () => {
    const nameObj = {
      first: 'John',
      middle: 'Robert',
      last: 'Doe',
      suffix: 'Jr.',
    };
    const formattedName = nameFormat(nameObj);
    expect(formattedName).to.eq('Doe, John Robert, Jr.');
  });
});

describe('Date formatter', () => {
  it('formats a date with no specified format', () => {
    const timeStamp = '2023-09-29T11:04:31.316-04:00';
    const formattedDate = dateFormat(timeStamp);
    expect(formattedDate).to.contain('September');
  });
});

describe('dateFormatWithoutTimezone', () => {
  const testFormat = (isoString, expected) => {
    expect(dateFormatWithoutTimezone(isoString)).to.equal(expected);
  };

  it('should format a valid FHIR date string by stripping the time zone', () => {
    testFormat('2018', '2018'); // Year only
    testFormat('1973-06', 'June 1973'); // Year + month
    testFormat('2000-08-09', 'August 9, 2000'); // Full date
    testFormat('1990-06-30T23:59:60Z', 'June 30, 1990, 11:59 p.m.'); // Leap second
    testFormat('2020-01-02T03:04:05Z', 'January 2, 2020, 3:04 a.m.'); // Zulu time
    testFormat('2019-07-19T16:20:30.123Z', 'July 19, 2019, 4:20 p.m.'); // Fractional seconds
    testFormat('2021-05-18T10:30:00+02:00', 'May 18, 2021, 10:30 a.m.'); // Positive offset
    testFormat('2017-08-02T09:50:57-04:00', 'August 2, 2017, 9:50 a.m.'); // Negative offset
    testFormat('2017-01-01T00:00:00.000Z', 'January 1, 2017, 12:00 a.m.'); // Millisecond precision
    testFormat('2022-11-15T08:00:00+00:00', 'November 15, 2022, 8:00 a.m.'); // Zero offset required
    testFormat('2020-12-31T23:59:59+05:30', 'December 31, 2020, 11:59 p.m.'); // Non-hour offset
  });

  it('should return null for invalid input', () => {
    testFormat('', null); // empty string
    testFormat('foo', null); // garbage
    testFormat(12345, null); // non-string input
    testFormat(undefined, null); // missing
    testFormat('2021-13', null); // bad month in YYYY-MM
    testFormat('2021-02-29', null); // non-leap Feb-29
    testFormat('2021-00-01', null); // zero month
  });

  it('should handle different date formats', () => {
    const isoString = '2021-05-18T10:30:00+02:00';
    const customFormat = 'yyyy-MM-dd';
    const expectedFormat = '2021-05-18';
    const result = dateFormatWithoutTimezone(isoString, customFormat);
    expect(result).to.equal(expectedFormat);
  });
});

describe('getReactions', () => {
  it('returns an empty array if the record passed has no reactions property', () => {
    const record = {};
    const reactions = getReactions(record);
    expect(reactions.length).to.eq(0);
  });
});

describe('concatObservationInterpretations', () => {
  it('returns interpretation.text as is if it is not found in the interpretationMap', () => {
    const record = { interpretation: [{ text: 'asdf' }] };
    const textFields = concatObservationInterpretations(record);
    expect(textFields).to.eq('asdf');
  });
});

describe('getObservationValueWithUnits', () => {
  it('returns null if observation.valueQuantity does not exist', () => {
    const observation = {};
    const textFields = getObservationValueWithUnits(observation);
    expect(textFields).to.eq(null);
  });
});

describe('processList', () => {
  it('returns an array of strings, separated by a period and a space, when there is more than 1 item in the list', () => {
    const list = ['a', 'b', 'c'];
    const result = processList(list);
    expect(result).to.eq('a. b. c');
  });
  it('returns EMPTY_FIELD value if there are no items in the list', () => {
    const list = [];
    const result = processList(list);
    expect(result).to.eq('None recorded');
  });
});

describe('extractContainedResource', () => {
  it('should extract the contained resource when provided a valid reference ID', () => {
    const resource = {
      contained: [{ id: 'a1', type: 'TypeA' }, { id: 'b2', type: 'TypeB' }],
    };

    const result = extractContainedResource(resource, '#a1');
    expect(result).to.eq(resource.contained.find(e => e.id === 'a1'));
  });

  it('should return null if resource does not contain the "contained" property', () => {
    const resource = {};

    const result = extractContainedResource(resource, '#a1');
    expect(result).to.eq(null);
  });

  it('should return null if "contained" property is not an array', () => {
    const resource = {
      contained: 'not-an-array',
    };

    const result = extractContainedResource(resource, '#a1');
    expect(result).to.eq(null);
  });

  it('should return null if reference ID is not provided', () => {
    const resource = {
      contained: [{ id: 'a1', type: 'TypeA' }],
    };

    const result = extractContainedResource(resource, '');
    expect(result).to.eq(null);
  });

  it('should return null if no match is found in the "contained" array', () => {
    const resource = {
      contained: [{ id: 'a1', type: 'TypeA' }],
    };

    const result = extractContainedResource(resource, '#b2');
    expect(result).to.eq(null);
  });
});

describe('extractContainedByResourceType', () => {
  const mockRecord = {
    contained: [
      {
        resourceType: 'Organization',
        id: 'ex-MHV-organization-something',
        name: 'Something',
      },
      {
        resourceType: 'Practitioner',
        id: 'ex-MHV-practitioner-somebody',
        name: [{ text: 'Somebody' }],
      },
      { resourceType: 'Observation', id: 'ex-MHV-lab-stuff', name: 'Stuff' },
    ],
    performer: [
      { reference: '#ex-MHV-organization-something' },
      { reference: '#ex-MHV-practitioner-somebody' },
    ],
  };

  it('should extract the contained resource when provided a valid reference array and resourceType', () => {
    const result = extractContainedByRecourceType(
      mockRecord,
      'Practitioner',
      mockRecord.performer,
    );
    const desired = mockRecord.contained.find(
      e => e.id === 'ex-MHV-practitioner-somebody',
    );

    expect(result).to.deep.equal(desired);
  });

  it('should return null if resource does not contain the "contained" property', () => {
    const mockRecord2 = {
      performer: [{ reference: '#ex-MHV-organization-something' }],
    };

    const result = extractContainedByRecourceType(
      mockRecord2,
      'Practitioner',
      mockRecord.performer,
    );
    expect(result).to.eq(null);
  });

  it('should return null if "contained" property is not an array', () => {
    const mockRecord3 = {
      contained: 'not-an-array',
      performer: [
        { reference: '#ex-MHV-organization-something' },
        { reference: '#ex-MHV-practitioner-somebody' },
      ],
    };

    const result = extractContainedByRecourceType(
      mockRecord3,
      'Practitioner',
      mockRecord.performer,
    );
    expect(result).to.eq(null);
  });

  it('should return null if resourceType is not provided', () => {
    const result = extractContainedByRecourceType(mockRecord, 'Practitioner');
    expect(result).to.eq(null);
  });

  it('should return null if no match is found in the "contained" array', () => {
    const result = extractContainedByRecourceType(
      mockRecord,
      'Specimen',
      mockRecord.performer,
    );
    expect(result).to.eq(null);
  });
});

describe('dispatchDetails function', () => {
  it('should dispatch a GET action when list is empty', async () => {
    // Create a spy for the dispatch function
    const dispatchSpy = sinon.spy();

    // Mock the getDetail function and provide a sample response
    const getDetailStub = sinon
      .stub()
      .resolves({ id: '1', data: 'Sample Data' });

    // Call the dispatchDetails function with an empty list
    await dispatchDetails(
      '1',
      [],
      dispatchSpy,
      getDetailStub,
      'GET_FROM_LIST',
      'GET',
    );

    // Expectations
    expect(dispatchSpy.calledOnce).to.be.true; // Check if dispatch was called
    expect(dispatchSpy.firstCall.args[0]).to.deep.equal({
      type: 'GET',
      response: { id: '1', data: 'Sample Data' },
    }); // Check if dispatch was called with the expected arguments
  });

  it('should dispatch a GET_FROM_LIST action when a matching item is found', async () => {
    // Create a spy for the dispatch function
    const dispatchSpy = sinon.spy();

    // Mock the getDetail function and provide a sample response
    const getDetailStub = sinon
      .stub()
      .resolves({ id: '1', data: 'Sample Data' });

    // Call the dispatchDetails function with a list containing a matching item
    await dispatchDetails(
      '1',
      [{ id: '1', data: 'Sample Data' }],
      dispatchSpy,
      getDetailStub,
      'GET_FROM_LIST',
      'GET',
    );

    // Expectations
    expect(dispatchSpy.calledOnce).to.be.true; // Check if dispatch was called
    expect(dispatchSpy.firstCall.args[0]).to.deep.equal({
      type: 'GET_FROM_LIST',
      response: { id: '1', data: 'Sample Data' },
    }); // Check if dispatch was called with the expected arguments
  });

  it('should dispatch a GET action when no matching item is found', async () => {
    // Create a spy for the dispatch function
    const dispatchSpy = sinon.spy();

    // Mock the getDetail function and provide a sample response
    const getDetailStub = sinon
      .stub()
      .resolves({ id: '1', data: 'Sample Data' });

    // Call the dispatchDetails function with a list without a matching item
    await dispatchDetails(
      '2',
      [{ id: '1', data: 'Sample Data' }],
      dispatchSpy,
      getDetailStub,
      'GET_FROM_LIST',
      'GET',
    );

    // Expectations
    expect(dispatchSpy.calledOnce).to.be.true; // Check if dispatch was called
    expect(dispatchSpy.firstCall.args[0]).to.deep.equal({
      type: 'GET',
      response: { id: '1', data: 'Sample Data' },
    }); // Check if dispatch was called with the expected arguments
  });
});

describe('getActiveLinksStyle', () => {
  it('returns "is-active" when linkPath and currentPath are both "/"', () => {
    const linkPath = '/';
    const currentPath = '/';
    const expectedStyle = 'is-active';

    const style = getActiveLinksStyle(linkPath, currentPath);

    expect(style).to.equal(expectedStyle);
  });

  it('returns "is-active" when linkPath and currentPath have the same second segment', () => {
    const linkPath = '/example/1';
    const currentPath = '/example/1/some-page';
    const expectedStyle = 'is-active';

    const style = getActiveLinksStyle(linkPath, currentPath);

    expect(style).to.equal(expectedStyle);
  });

  it('returns "is-active" when linkPath and currentPath have the same second segment for labs-and-tests', () => {
    const linkPath = '/labs-and-tests/some-page';
    const currentPath = '/labs-and-tests/some-page';
    const expectedStyle = 'is-active';

    const style = getActiveLinksStyle(linkPath, currentPath);

    expect(style).to.equal(expectedStyle);
  });

  it('returns "is-active" when linkPath and currentPath have the same second segment for three-part paths', () => {
    const linkPath = '/example/1';
    const currentPath = '/example/1/some-page';
    const expectedStyle = 'is-active';

    const style = getActiveLinksStyle(linkPath, currentPath);

    expect(style).to.equal(expectedStyle);
  });

  it('returns an empty string when linkPath and currentPath have different second segments', () => {
    const linkPath = '/example/1';
    const currentPath = '/other-example/1/some-page';
    const expectedStyle = '';

    const style = getActiveLinksStyle(linkPath, currentPath);

    expect(style).to.equal(expectedStyle);
  });

  it('returns an empty string when linkPath and currentPath have no second segment', () => {
    const linkPath = '/example';
    const currentPath = '/other-example';
    const expectedStyle = '';

    const style = getActiveLinksStyle(linkPath, currentPath);

    expect(style).to.equal(expectedStyle);
  });
});

describe('formats', () => {
  it('formats a full date', () => {
    const expectedStyle = 'March 3, 2013';
    const date = formatDate('2013-03-03');

    expect(date).to.equal(expectedStyle);
  });

  it('formats a date that has a YYYY-MM format and no DD (day of month).', () => {
    const expectedStyle = 'February, 2013';
    const date = formatDate('2013-02'); // January starts at [0] instead of "1"

    expect(date).to.equal(expectedStyle);
  });

  it('formats a date that only has YYYY and no DD (day of month) nor MM (month)', () => {
    const expectedStyle = '2013';
    const date = formatDate('2013');

    expect(date).to.equal(expectedStyle);
  });
});

describe('getStatusExtractPhase', () => {
  const minutesBefore = (date, minutes) =>
    new Date(date.getTime() - minutes * 60000);
  const now = new Date();

  it('returns STALE when lastCompleted is older than VALID_REFRESH_DURATION', () => {
    const phrStatus = [
      {
        extract: 'VPR',
        lastRequested: minutesBefore(now, VALID_REFRESH_DURATION / 60000 + 10),
        lastCompleted: minutesBefore(now, VALID_REFRESH_DURATION / 60000 + 10),
        lastSuccessfulCompleted: minutesBefore(
          now,
          VALID_REFRESH_DURATION / 60000 + 10,
        ),
      },
    ];
    expect(getStatusExtractPhase(now, phrStatus, 'VPR')).to.equal(
      refreshPhases.STALE,
    );
  });

  it('returns IN_PROGRESS when lastCompleted < lastRequested', () => {
    const phrStatus = [
      {
        extract: 'VPR',
        lastRequested: minutesBefore(now, 10),
        lastCompleted: minutesBefore(now, 20),
        lastSuccessfulCompleted: minutesBefore(now, 20),
      },
    ];
    expect(getStatusExtractPhase(now, phrStatus, 'VPR')).to.equal(
      refreshPhases.IN_PROGRESS,
    );
  });

  it('returns FAILED when lastCompleted ≠ lastSuccessfulCompleted', () => {
    const phrStatus = [
      {
        extract: 'VPR',
        lastRequested: minutesBefore(now, 10),
        lastCompleted: minutesBefore(now, 5),
        lastSuccessfulCompleted: minutesBefore(now, 80),
      },
    ];
    expect(getStatusExtractPhase(now, phrStatus, 'VPR')).to.equal(
      refreshPhases.FAILED,
    );
  });

  it('returns CURRENT when lastCompleted === lastSuccessfulCompleted and within duration', () => {
    const phrStatus = [
      {
        extract: 'VPR',
        lastRequested: minutesBefore(now, 10),
        lastCompleted: minutesBefore(now, 5),
        lastSuccessfulCompleted: minutesBefore(now, 5),
      },
    ];
    expect(getStatusExtractPhase(now, phrStatus, 'VPR')).to.equal(
      refreshPhases.CURRENT,
    );
  });

  it('returns null if inputs are invalid', () => {
    expect(getStatusExtractPhase(null, [], 'VPR')).to.be.null;
    expect(getStatusExtractPhase(now, null, 'VPR')).to.be.null;
    expect(getStatusExtractPhase(now, [], '')).to.be.null;
  });

  it('handles hasExplicitLoadError branch when upToDate, loadStatus, and errorMessage are set', () => {
    // Use dates recent enough so that STALE check does not trigger
    const recent = minutesBefore(now, 1);
    const phrStatus = [
      {
        extract: 'VPR',
        upToDate: true,
        loadStatus: 'ERROR',
        errorMessage: 'Something went wrong',
        lastRequested: recent,
        lastCompleted: recent,
        lastSuccessfulCompleted: recent,
      },
    ];
    expect(getStatusExtractPhase(now, phrStatus, 'VPR')).to.equal(
      refreshPhases.FAILED,
    );
  });
});

describe('getLastUpdatedText', () => {
  it('should return the last updated string when the refreshStateStatus contains the extractType and lastSuccessfulCompleted', () => {
    const refreshStateStatus = [
      { extract: 'type1', lastSuccessfulCompleted: '2024-09-15T10:00:00Z' },
    ];
    const extractType = 'type1';

    const result = getLastUpdatedText(refreshStateStatus, extractType);

    const testDate = new Date('2024-09-15T10:00:00Z');

    expect(result).to.equal(
      `Last updated at ${testDate.getHours() % 12 ||
        12}:00 a.m. on ${testDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`,
    );
  });

  it('should return null when no matching extractType is found', () => {
    const refreshStateStatus = [
      { extract: 'type1', lastSuccessfulCompleted: '2024-09-15T10:00:00Z' },
    ];
    const extractType = 'type2';

    const result = getLastUpdatedText(refreshStateStatus, extractType);

    expect(result).to.be.null;
  });

  it('should return null when refreshStateStatus is undefined', () => {
    const result = getLastUpdatedText(undefined, 'type1');
    expect(result).to.be.null;
  });

  it('should return null when no lastSuccessfulCompleted is present', () => {
    const refreshStateStatus = [
      { extract: 'type1', lastSuccessfulCompleted: null },
    ];
    const extractType = 'type1';

    const result = getLastUpdatedText(refreshStateStatus, extractType);

    expect(result).to.be.null;
  });
});

describe('formatNameFirstToLast', () => {
  it('formats a name string from "Last,First" to "First Last"', () => {
    const input = 'Schmo,Joe';
    const expectedOutput = 'Joe Schmo';
    const result = formatNameFirstToLast(input);

    expect(result).to.eq(expectedOutput);
  });

  it('formats a name with middle initial from "Last,First Middle" to "First Middle Last"', () => {
    const input = 'Schmo,Joe R';
    const expectedOutput = 'Joe R Schmo';
    const result = formatNameFirstToLast(input);

    expect(result).to.eq(expectedOutput);
  });

  it('returns original name if not in "Last,First" format', () => {
    const input = 'Schmo Joe';
    const result = formatNameFirstToLast(input);

    expect(result).to.eq(input);
  });

  it('handles object input with given and family names correctly', () => {
    const input = { given: ['Joe', 'R'], family: 'Schmo' };
    const expectedOutput = 'Joe R Schmo';
    const result = formatNameFirstToLast(input);

    expect(result).to.eq(expectedOutput);
  });

  it('handles object input with text property in "Last,First" format', () => {
    const input = { text: 'Schmo,Joe' };
    const expectedOutput = 'Joe Schmo';
    const result = formatNameFirstToLast(input);

    expect(result).to.eq(expectedOutput);
  });

  it('returns text property if not in "Last,First" format', () => {
    const input = { text: 'Schmo Joe' };
    const result = formatNameFirstToLast(input);

    expect(result).to.eq(input.text);
  });

  it('returns null on unexpected object without necessary properties', () => {
    const input = { other: 'value' };
    const result = formatNameFirstToLast(input);

    expect(result).to.be.null;
  });

  it('returns null if input is null', () => {
    const result = formatNameFirstToLast(null);

    expect(result).to.be.null;
  });

  it('returns null if input is undefined', () => {
    const result = formatNameFirstToLast(undefined);

    expect(result).to.be.null;
  });

  it('handles a name string without a comma as original input', () => {
    const input = 'SingleName';
    const result = formatNameFirstToLast(input);

    expect(result).to.eq(input);
  });

  it('handles object input with empty given array and family name', () => {
    const input = { given: [], family: 'Schmo' };
    const expectedOutput = ' Schmo';
    const result = formatNameFirstToLast(input);

    expect(result).to.eq(expectedOutput);
  });

  it('handles empty string input as empty string', () => {
    const input = '';
    const result = formatNameFirstToLast(input);

    expect(result).to.eq('');
  });

  it('handles improperly formatted text field in object as original input', () => {
    const input = { text: 'SchmoJoe' };
    const result = formatNameFirstToLast(input);

    expect(result).to.eq(input.text);
  });
});

describe('getMonthFromSelectedDate', () => {
  it('should return the formatted date', () => {
    const date = '2024-01';
    const result = getMonthFromSelectedDate({ date });
    expect(result).to.equal('January 2024');
  });
  it('should accept a mask for the date', () => {
    const date = '2024-01';
    const result = getMonthFromSelectedDate({ date, mask: 'MMMM' });
    expect(result).to.equal('January');
  });
  it('should return null if the date is not provided', () => {
    const result = getMonthFromSelectedDate({});
    expect(result).to.be.null;
  });
  it('should return null is date string doesnt match the format', () => {
    const date = '2024';
    const result = getMonthFromSelectedDate({ date });
    expect(result).to.be.null;
  });
});

describe('handleDataDogAction', () => {
  it('should return a tag for the Vitals details page', () => {
    const tag = handleDataDogAction({
      locationBasePath: 'vitals',
      locationChildPath: 'heart-rate-history',
    });
    expect(tag).to.equal('Back - Vitals - Heart rate');
  });

  it('should return a tag for the list page', () => {
    const tag = handleDataDogAction({
      locationBasePath: 'labs-and-tests',
      locationChildPath: '1234',
    });
    expect(tag).to.equal('Back - Lab and test results - Detail');
  });

  it('should return a tag for the list page with no child path', () => {
    const tag = handleDataDogAction({
      locationBasePath: 'summaries-and-notes',
    });
    expect(tag).to.equal('Back - Care summaries and notes - List');
  });

  it('should return a tag for the settings page', () => {
    const tag = handleDataDogAction({
      locationBasePath: 'settings',
    });
    expect(tag).to.equal(
      'Breadcrumb - Manage your electronic sharing settings',
    );
  });

  it('should return a tag for the downloads page', () => {
    const tag = handleDataDogAction({
      locationBasePath: 'download',
    });
    expect(tag).to.equal('Breadcrumb - Download medical records reports');
  });
});

describe('formatDateInLocalTimezone', () => {
  let originalTZ;

  // Ensure these tests run in a predictable time zone
  before(() => {
    originalTZ = process.env.TZ;
    process.env.TZ = 'UTC';
  });

  // Restore the original time zone value
  after(() => {
    if (originalTZ === undefined) {
      delete process.env.TZ;
    } else {
      process.env.TZ = originalTZ;
    }
  });

  it('should format a valid ISO8601 date string to the local timezone', () => {
    const dateString = '2023-01-05T14:48:00.000-05:00';
    const formattedDate = formatDateInLocalTimezone(dateString);
    const expectedDate = 'January 5, 2023 7:48 p.m. UTC';
    expect(formattedDate).to.equal(expectedDate);
  });

  it('should format a date when providing a UNIX timestamp as a number', () => {
    const timestamp = 1672941680000; // Jan 5, 2023, 19:48 UTC
    const formattedDate = formatDateInLocalTimezone(timestamp);
    const expectedDate = 'January 5, 2023 6:01 p.m. UTC';
    expect(formattedDate).to.equal(expectedDate);
  });

  it('should hide time zone when hideTimeZone is true', () => {
    const dateString = '2023-01-05T14:48:00.000-05:00';
    const formattedDate = formatDateInLocalTimezone(dateString, true);
    const expectedDate = 'January 5, 2023 7:48 p.m.';
    expect(formattedDate).to.equal(expectedDate);
  });

  it('should show time zone by default', () => {
    const dateString = '2023-01-05T14:48:00.000-05:00';
    const formattedDate = formatDateInLocalTimezone(dateString);
    expect(formattedDate).to.include('UTC');
  });

  it('should handle an invalid date string gracefully', () => {
    const invalidDateString = 'invalid-date';
    expect(() => formatDateInLocalTimezone(invalidDateString)).to.throw();
  });

  it('should handle a null value gracefully', () => {
    const nullValue = null;
    expect(() => formatDateInLocalTimezone(nullValue)).to.throw();
  });

  it('should handle an undefined value gracefully', () => {
    const undefinedValue = undefined;
    expect(() => formatDateInLocalTimezone(undefinedValue)).to.throw();
  });

  it('should format a date string without time correctly', () => {
    const dateString = '2023-10-03';
    const formattedDate = formatDateInLocalTimezone(dateString);
    const expectedDate = 'October 3, 2023 12:00 a.m. UTC';
    expect(formattedDate).to.equal(expectedDate);
  });
});

describe('removeTrailingSlash', () => {
  it('should remove the trailing slash from a string', () => {
    const string = 'https://example.com/';
    const result = removeTrailingSlash(string);
    expect(result).to.equal('https://example.com');
  });
  it('should return the string if there is no trailing slash', () => {
    const string = 'https://example.com';
    const result = removeTrailingSlash(string);
    expect(result).to.equal(string);
  });
  it('should return the string if the string is empty', () => {
    const string = '';
    const result = removeTrailingSlash(string);
    expect(result).to.equal(string);
  });
  it('should return the string if the string is null', () => {
    const string = null;
    const result = removeTrailingSlash(string);
    expect(result).to.equal(string);
  });
});

describe('getAppointmentsDateRange', () => {
  let clock;
  // Freeze "now" at Jan 1, 2022 local time
  const fakeNow = new Date(2022, 0, 1, 0, 0, 0);
  const earliestFormatted = formatISO(startOfDay(subYears(fakeNow, 2)));
  const latestFormatted = formatISO(endOfDay(addMonths(fakeNow, 13)));

  beforeEach(() => {
    clock = sinon.useFakeTimers({
      now: fakeNow.getTime(),
      toFake: ['Date'],
    });
  });

  afterEach(() => {
    clock.restore();
  });

  function assertDateComponents(
    isoString,
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
  ) {
    const d = parseISO(isoString);
    expect(d.getFullYear()).to.equal(year);
    expect(d.getMonth()).to.equal(month);
    expect(d.getDate()).to.equal(day);
    expect(d.getHours()).to.equal(hours);
    expect(d.getMinutes()).to.equal(minutes);
    expect(d.getSeconds()).to.equal(seconds);
  }

  it('returns the full allowed window when both inputs are null', () => {
    const { startDate, endDate } = getAppointmentsDateRange(null, null);

    expect(startDate).to.equal(earliestFormatted);
    expect(endDate).to.equal(latestFormatted);
  });

  it('defaults `from` to earliest when only fromDate is null', () => {
    const to = '2021-06-15';
    const { startDate, endDate } = getAppointmentsDateRange(null, to);

    const providedTo = endOfDay(parseISO(to));

    expect(startDate).to.equal(earliestFormatted);
    expect(endDate).to.equal(formatISO(providedTo));
  });

  it('defaults `to` to latest when only toDate is null', () => {
    const from = '2021-06-15';
    const { startDate, endDate } = getAppointmentsDateRange(from, null);

    const providedFrom = startOfDay(parseISO(from));

    expect(startDate).to.equal(formatISO(providedFrom));
    expect(endDate).to.equal(latestFormatted);
  });

  it('returns the exact provided range when both dates are within bounds', () => {
    const from = '2021-06-01';
    const to = '2021-12-31';
    const { startDate, endDate } = getAppointmentsDateRange(from, to);

    expect(startDate).to.equal(formatISO(startOfDay(parseISO(from))));
    expect(endDate).to.equal(formatISO(endOfDay(parseISO(to))));
  });

  it('clamps out-of-bounds dates to [earliest, latest]', () => {
    const from = '2018-01-01'; // too early
    const to = '2025-01-01'; // too late
    const { startDate, endDate } = getAppointmentsDateRange(from, to);

    expect(startDate).to.equal(earliestFormatted);
    expect(endDate).to.equal(latestFormatted);
  });

  it('resets to full window if fromDate > latestAllowed and toDate in range', () => {
    const from = '2024-01-01'; // after fakeNow + 13m (2023-02-01)
    const to = '2022-05-01'; // within bounds
    const { startDate, endDate } = getAppointmentsDateRange(from, to);

    expect(startDate).to.equal(earliestFormatted);
    expect(endDate).to.equal(latestFormatted);
  });

  it('resets to full window if toDate < earliestAllowed and fromDate in range', () => {
    const from = '2021-05-01'; // within bounds
    const to = '2019-01-01'; // before fakeNow - 2y (2020-01-01)
    const { startDate, endDate } = getAppointmentsDateRange(from, to);

    expect(startDate).to.equal(earliestFormatted);
    expect(endDate).to.equal(latestFormatted);
  });

  it('returns a single‐day window [latest, latest] when fromDate > latestAllowed & toDate is null', () => {
    const from = '2024-01-01'; // after fakeNow + 13m
    const { startDate, endDate } = getAppointmentsDateRange(from, null);

    expect(startDate).to.equal(latestFormatted);
    expect(endDate).to.equal(latestFormatted);
  });

  it('returns a single‐day window [earliest, earliest] when toDate < earliestAllowed & fromDate is null', () => {
    const to = '2019-01-01'; // before fakeNow - 2y
    const { startDate, endDate } = getAppointmentsDateRange(null, to);

    expect(startDate).to.equal(earliestFormatted);
    expect(endDate).to.equal(earliestFormatted);
  });

  it('resets to full window when provided fromDate > toDate but both are within bounds', () => {
    const from = '2022-06-01';
    const to = '2021-06-01';
    const { startDate, endDate } = getAppointmentsDateRange(from, to);

    expect(startDate).to.equal(earliestFormatted);
    expect(endDate).to.equal(latestFormatted);
  });

  it('handles the one‐day case when fromDate === toDate within bounds', () => {
    const date = '2021-07-15';
    const { startDate, endDate } = getAppointmentsDateRange(date, date);

    expect(startDate).to.equal(formatISO(startOfDay(parseISO(date))));
    expect(endDate).to.equal(formatISO(endOfDay(parseISO(date))));
  });

  it('uses the correct start and end dates', () => {
    const from = '2021-06-01';
    const to = '2022-06-01';
    const { startDate, endDate } = getAppointmentsDateRange(from, to);

    assertDateComponents(startDate, 2021, 5, 1, 0, 0, 0); // 2021-06-01T00:00:00 local time
    assertDateComponents(endDate, 2022, 5, 1, 23, 59, 59); // 2022-06-01T23:59:59 local time
  });

  it('uses the correct start and end dates for maximum window', () => {
    const from = '2018-01-01';
    const to = '2025-01-01';
    const { startDate, endDate } = getAppointmentsDateRange(from, to);

    assertDateComponents(startDate, 2020, 0, 1, 0, 0, 0); // 2020-01-01T00:00:00 local time
    assertDateComponents(endDate, 2023, 1, 1, 23, 59, 59); // 2023-02-01T23:59:59 local time
  });
});

describe('formatDateAndTimeWithGenericZone', () => {
  let tzStub;

  before(() => {
    // Force user timezone to UTC for deterministic output
    tzStub = sinon
      .stub(Intl.DateTimeFormat.prototype, 'resolvedOptions')
      .returns({ timeZone: 'UTC' });
  });

  after(() => {
    tzStub.restore();
  });

  it('returns full date, time with “a.m.”/“p.m.” and generic zone for UTC', () => {
    const date = parseISO('2025-02-17T14:30:00Z');
    const { date: fullDate, time, timeZone } = formatDateAndTimeWithGenericZone(
      date,
    );

    expect(fullDate).to.equal('February 17, 2025');
    expect(time).to.equal('2:30 p.m.');
    expect(timeZone).to.equal('UTC');
  });

  it('formats midnight correctly as “12:00 a.m.”', () => {
    const date = parseISO('2025-02-17T00:00:00Z');
    const { time } = formatDateAndTimeWithGenericZone(date);

    expect(time).to.equal('12:00 a.m.');
  });

  it('strips “ST”/“DT” for other zones (e.g. PST→PT)', () => {
    // change stub to a DST-aware zone
    tzStub.returns({ timeZone: 'America/Los_Angeles' });
    // 2025-07-01T15:45:00Z is 08:45 a.m. PDT → “8:45 a.m. PT”
    const date = parseISO('2025-07-01T15:45:00Z');
    const { time, timeZone } = formatDateAndTimeWithGenericZone(date);

    expect(time).to.equal('8:45 a.m.');
    expect(timeZone).to.equal('PT');
  });
});

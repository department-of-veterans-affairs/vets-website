import { expect } from 'chai';
import sinon from 'sinon';
import {
  concatObservationInterpretations,
  dateFormat,
  dateFormatWithoutTime,
  dateFormatWithoutTimezone,
  dispatchDetails,
  extractContainedByRecourceType,
  extractContainedResource,
  formatDate,
  formatNameFirstLast,
  formatNameFirstToLast,
  getActiveLinksStyle,
  getLastUpdatedText,
  getObservationValueWithUnits,
  getReactions,
  getStatusExtractPhase,
  nameFormat,
  processList,
  getMonthFromSelectedDate,
  formatDateInLocalTimezone,
  handleDataDogAction,
  removeTrailingSlash,
} from '../../util/helpers';

import { refreshPhases } from '../../util/constants';

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

describe('Date formatter with no timezone', () => {
  it('removes the time from a dateTime', () => {
    const dateTime = 'October 27, 2023, 10:00 a.m.';
    const formattedDate = dateFormatWithoutTime(dateTime);
    expect(formattedDate).to.eq('October 27, 2023');
  });

  it('formats a date in the original time without a timezone', () => {
    const timeStamp = '2023-09-29T11:04:31.316-04:00';
    const formattedDate = dateFormatWithoutTimezone(timeStamp);
    expect(formattedDate).to.eq('September 29, 2023, 11:04 a.m.');
  });

  it('formats an epoch date in the original time without a timezone', () => {
    const timeStamp = 1605300748000;
    const formattedDate = dateFormatWithoutTimezone(timeStamp);
    expect(formattedDate).to.eq('November 13, 2020, 8:52 p.m.');
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
    expect(result).to.eq('None noted');
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
  const minutesBefore = (date, minutes) => {
    return new Date(date.getTime() - minutes * 60 * 1000);
  };

  const now = new Date();

  it('returns STALE', () => {
    const phrStatus = [
      {
        extract: 'VPR',
        lastRequested: minutesBefore(now, 80),
        lastCompleted: minutesBefore(now, 70),
        lastSuccessfulCompleted: minutesBefore(now, 70),
      },
    ];
    expect(getStatusExtractPhase(now, phrStatus, 'VPR')).to.equal(
      refreshPhases.STALE,
    );
  });

  it('returns IN_PROGRESS', () => {
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

  it('returns FAILED', () => {
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

  it('returns CURRENT', () => {
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

describe('formatNameFirstLast', () => {
  const user1 = {
    userFullName: {
      first: 'Joe',
      last: 'Schmo',
    },
  };

  const user2 = {
    userFullName: {
      first: 'Joe',
      last: 'Schmo',
      middle: 'R',
      suffix: 'Jr',
    },
  };

  it('returns a name formatted with the first name before to the last name', () => {
    const lastFirstName = 'Joe Schmo';
    const updatedName = formatNameFirstLast(user1.userFullName);

    expect(updatedName).to.eq(lastFirstName);
  });

  it('returns a name formatted with the first name and middle initial and suffix', () => {
    const firstMiddleLastSuffixName = 'Joe R Schmo, Jr';
    const updatedName = formatNameFirstLast(user2.userFullName);

    expect(updatedName).to.eq(firstMiddleLastSuffixName);
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
  it('should format a valid ISO8601 date string to the local timezone', () => {
    const dateString = '2023-01-05T14:48:00.000-05:00';
    const formattedDate = formatDateInLocalTimezone(dateString);
    const expectedDate = 'January 5, 2023 7:48 p.m. UTC';
    expect(formattedDate).to.equal(expectedDate);
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

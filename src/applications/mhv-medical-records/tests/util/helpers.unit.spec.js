import { expect } from 'chai';
import sinon from 'sinon';
import {
  concatObservationInterpretations,
  dateFormat,
  getStatusExtractPhase,
  getObservationValueWithUnits,
  getReactions,
  nameFormat,
  processList,
  extractContainedResource,
  dispatchDetails,
  getActiveLinksStyle,
  dateFormatWithoutTimezone,
  formatDate,
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
  it('formats a date in the original time without a timezone', () => {
    const timeStamp = '2023-09-29T11:04:31.316-04:00';
    const formattedDate = dateFormatWithoutTimezone(timeStamp);
    expect(formattedDate).to.eq('September 29, 2023, 11:04 a.m.');
  });
  it('formats an epoch date in the original time without a timezone', () => {
    const timeStamp = 1605300748000;
    const formattedDate = dateFormatWithoutTimezone(timeStamp);
    expect(formattedDate).to.eq('November 13, 2020, 1:52 p.m.');
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

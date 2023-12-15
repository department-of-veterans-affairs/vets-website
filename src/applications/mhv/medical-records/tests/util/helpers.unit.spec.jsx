import { expect } from 'chai';
import { useDispatch } from 'react-redux';
import sinon from 'sinon';
import React from 'react';
import {
  concatObservationInterpretations,
  dateFormat,
  getObservationValueWithUnits,
  getReactions,
  nameFormat,
  processList,
  extractContainedResource,
  useAutoFetchData,
} from '../../util/helpers';

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

describe('useAutoFetchData', () => {
  // Mock functions and objects as needed

  let fetchDataFunctionFactory;
  let useDispatchStub;

  beforeEach(() => {
    useDispatchStub = sinon.stub(React, 'useDispatch');
    useDispatchStub.returns(() => {}); // Mock the useDispatch function
    fetchDataFunctionFactory = () => {};
  });

  afterEach(() => {
    useDispatchStub.restore(); // Restore the original useDispatch function
  });

  it('should throw an error if dispatch is not provided', () => {
    expect(() => {
      useAutoFetchData(undefined, fetchDataFunctionFactory);
    }).to.throw(
      'useAutoFetchData requires dispatch and fetchDataFunctionFactory as arguments.',
    );
  });

  it('should throw an error if fetchDataFunctionFactory is not provided', () => {
    expect(() => {
      useAutoFetchData(useDispatch, undefined);
    }).to.throw(
      'useAutoFetchData requires dispatch and fetchDataFunctionFactory as arguments.',
    );
  });

  it('should not throw an error if both dispatch and fetchDataFunctionFactory are provided', () => {
    const dispatchProvided = useDispatchStub.returns(() => {});
    const fetchDataFunctionFactoryProvided = fetchDataFunctionFactory;

    expect(() => {
      useAutoFetchData(dispatchProvided, fetchDataFunctionFactoryProvided);
    }).to.not.throw(
      'useAutoFetchData requires dispatch and fetchDataFunctionFactory as arguments.',
    );
  });
});

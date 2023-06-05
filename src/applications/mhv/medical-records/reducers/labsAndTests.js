import environment from 'platform/utilities/environment';
import { Actions } from '../util/actionTypes';
import { getNames } from '../util/helpers';

const initialState = {
  /**
   * The list of lab and test results returned from the api
   * @type {array}
   */
  labsAndTestsList: undefined,
  /**
   * The lab or test result currently being displayed to the user
   */
  labsAndTestsDetails: undefined,
};

const convertResults = results => {
  return results.map(result => {
    return {
      name: result.code.coding[0].display,
      result: result.valueQuantity.value + result.valueQuantity.unit,
      standardRange: '4.5 - 10.5 K/ccm',
      status: result.status,
      labLocation: '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
      interpretation: 'ref. range prior to 1/16/03 was 26-71 mg/dL.',
    };
  });
};

const convertChemHemList = recordList => {
  return recordList.entry.map(item => {
    const record = item.resource;
    return {
      id: record.id,
      name: getNames(record),
      category: record.category[0].coding[0].display,
      orderedBy: 'Beth M. Smith',
      requestedBy: 'John J. Lydon',
      date: '2012-04-05T17:42:46.000Z',
      vaccineId: '000007',
      orderingLocation:
        '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
      collectingLocation:
        '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
      comments: [],
    };
  });
};

const convertChemHemDetails = bundle => {
  const record = bundle.entry[0].resource;
  const results = bundle.entry
    .filter(item => item.fullUrl.includes('Observation'))
    .map(item => item.resource);
  return {
    id: record.id,
    name: getNames(record),
    category: record.category[0].coding[0].display,
    orderedBy: 'Beth M. Smith',
    requestedBy: 'John J. Lydon',
    date: '2012-04-05T17:42:46.000Z',
    vaccineId: '000007',
    orderingLocation:
      '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
    collectingLocation:
      '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
    comments: [],
    results: convertResults(results),
  };
};

export const labsAndTestsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.LabsAndTests.GET: {
      return {
        ...state,
        labsAndTestsDetails:
          environment.BUILDTYPE === 'localhost'
            ? convertChemHemDetails(action.response)
            : action.response,
      };
    }
    case Actions.LabsAndTests.GET_LIST: {
      return {
        ...state,
        labsAndTestsList:
          environment.BUILDTYPE === 'localhost'
            ? convertChemHemList(action.response)
            : action.response.map(labsAndTests => {
                return { ...labsAndTests };
              }),
      };
    }
    default:
      return state;
  }
};

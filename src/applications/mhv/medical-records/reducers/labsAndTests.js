import environment from 'platform/utilities/environment';
import { Actions } from '../util/actionTypes';
import { getNames } from '../util/helpers';
import { /* labTypes, */ testing } from '../util/constants';

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

// const convertMicrobiologyRecord = record => {
//   return {
//     // name: 'Microbiology',
//     // category: '',
//     // orderedBy: 'Beth M. Smith',
//     // requestedBy: 'John J. Lydon',
//     // id: 124,
//     date: record.effectiveDateTime,
//     // sampleFrom: 'Blood',
//     sampleTested: record.specimen,
//     // vaccineId: '000003',
//     // orderingLocation: '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
//     collectingLocation: record.performer,
//     // labLocation: '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
//     results: record.conclusion || record.result,
//   };
// };

// const getType = record => {
//   if (record.category === 'LAB') return labTypes.CHEM_HEM;
//   if (record.code === '79381-0') return labTypes.MICRO;
//   return labTypes.OTHER;
// };

export const labsAndTestsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.LabsAndTests.GET: {
      return {
        ...state,
        labsAndTestsDetails:
          environment.BUILDTYPE === 'localhost' && testing
            ? convertChemHemDetails(action.response)
            : action.response,
      };
    }
    case Actions.LabsAndTests.GET_LIST: {
      return {
        ...state,
        labsAndTestsList:
          environment.BUILDTYPE === 'localhost' && testing
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

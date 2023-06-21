import environment from 'platform/utilities/environment';
import { Actions } from '../util/actionTypes';
import { getNames } from '../util/helpers';
import { labTypes, testing } from '../util/constants';

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
      type: labTypes.CHEM_HEM,
      name: getNames(record),
      category: record.category[0].coding[0].display,
      orderedBy: 'Beth M. Smith',
      requestedBy: 'John J. Lydon',
      date: '2012-04-05T17:42:46.000Z',
      orderingLocation:
        '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
      collectingLocation:
        '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
      comments: [],
    };
  });
};

const convertChemHemRecord = bundle => {
  const record = bundle.entry[0].resource;
  const results = bundle.entry
    .filter(item => item.fullUrl.includes('Observation'))
    .map(item => item.resource);
  return {
    id: record.id,
    type: labTypes.CHEM_HEM,
    name: getNames(record),
    category: record.category[0].coding[0].display,
    orderedBy: 'Beth M. Smith',
    requestedBy: 'John J. Lydon',
    date: '2012-04-05T17:42:46.000Z',
    orderingLocation:
      '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
    collectingLocation:
      '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
    comments: [],
    results: convertResults(results),
  };
};

const convertMicrobiologyRecord = record => {
  return {
    name: 'Microbiology',
    category: '',
    orderedBy: 'Beth M. Smith',
    requestedBy: 'John J. Lydon',
    id: 124,
    date: record.effectiveDateTime,
    sampleFrom: 'Blood',
    sampleTested: record.specimen,
    orderingLocation:
      '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
    collectingLocation: record.performer,
    labLocation: '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
    results: record.conclusion || record.result,
  };
};

const convertPathologyRecord = record => {
  return {
    name: 'Surgical pathology',
    type: labTypes.PATHOLOGY,
    category: '',
    orderedBy: 'Beth M. Smith',
    requestedBy: 'John J. Lydon',
    id: 125,
    date: record.effectiveDateTime,
    sampleTested: record.specimen,
    labLocation: '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
    collectingLocation: record.performer,
    results: record.conclusion || record.result,
  };
};

const convertEkgRecord = record => {
  return {
    name: 'Electrocardiogram (EKG)',
    type: labTypes.EKG,
    category: '',
    orderedBy: 'Beth M. Smith',
    requestedBy: 'John J. Lydon',
    id: 123,
    date: record.date,
    facility: 'school parking lot',
  };
};

const getType = record => {
  if (record.category === 'LAB') return labTypes.CHEM_HEM;
  if (record.code === '79381-0') return labTypes.MICROBIOLOGY;
  if (record.code === '60567-5') return labTypes.PATHOLOGY;
  if (record.code === '11524-6') return labTypes.EKG;
  return labTypes.OTHER;
};

export const labsAndTestsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.LabsAndTests.GET: {
      const record = action.response;
      let labsAndTestsDetails;
      if (environment.BUILDTYPE === 'localhost' && testing) {
        const type = getType(record);
        if (type === labTypes.CHEM_HEM)
          labsAndTestsDetails = convertChemHemRecord(record);
        if (type === labTypes.MICROBIOLOGY)
          labsAndTestsDetails = convertMicrobiologyRecord(record);
        if (type === labTypes.PATHOLOGY)
          labsAndTestsDetails = convertPathologyRecord(record);
        if (type === labTypes.EKG)
          labsAndTestsDetails = convertEkgRecord(record);
      } else {
        labsAndTestsDetails = record;
      }
      return {
        ...state,
        labsAndTestsDetails,
      };
    }
    case Actions.LabsAndTests.GET_LIST: {
      const recordList = action.response;
      let labsAndTestsList;
      if (environment.BUILDTYPE === 'localhost' && testing) {
        convertChemHemList(action.response);
      } else {
        labsAndTestsList = recordList.map(labsAndTests => {
          return { ...labsAndTests };
        });
      }
      return {
        ...state,
        labsAndTestsList,
      };
    }
    default:
      return state;
  }
};

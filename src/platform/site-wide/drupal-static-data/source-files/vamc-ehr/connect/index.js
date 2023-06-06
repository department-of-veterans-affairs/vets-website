import { connectDrupalStaticDataFile } from '../../../connect';
import { preProcessEhrData } from './preProcess';

export const connectDrupalStaticDataFileVamcEhr = dispatch => {
  connectDrupalStaticDataFile(dispatch, {
    fileName: 'vamc-ehr.json',
    preProcess: preProcessEhrData,
    statePropName: 'vamcEhrData',
  });
};

import { connectJsonStaticDataFile } from '../../../connect';
import { preProcessEhrData } from './preProcess';

export const connectJsonStaticDataFileVamcEhr = dispatch => {
  connectJsonStaticDataFile(dispatch, {
    fileName: 'vamc-ehr.json',
    preProcess: preProcessEhrData,
    statePropName: 'vamcEhrData',
  });
};

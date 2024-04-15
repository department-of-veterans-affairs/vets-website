import { connectDrupalStaticDataFile } from '../../../connect';
import { preProcessSystemData } from './preProcess';

export const connectDrupalStaticDataFileVamcSystem = dispatch => {
  connectDrupalStaticDataFile(dispatch, {
    fileName: 'vamc-system.json',
    preProcess: preProcessSystemData,
    statePropName: 'vamcSystemData',
  });
};

import { connectJsonStaticDataFile } from '../../../connect';
import { preProcessPoliceData } from './preProcess';

export const connectJsonStaticDataFileVamcPolice = dispatch => {
  connectJsonStaticDataFile(dispatch, {
    fileName: 'vamc-police.json',
    preProcess: preProcessPoliceData,
    statePropName: 'vamcPoliceData',
  });
};

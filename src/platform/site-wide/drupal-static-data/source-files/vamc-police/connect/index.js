import { connectDrupalStaticDataFile } from '../../../connect';
import { preProcessPoliceData } from './preProcess';

export const connectDrupalStaticDataFileVamcEhr = dispatch => {
  connectDrupalStaticDataFile(dispatch, {
    fileName: 'vamc-police.json',
    preProcess: preProcessPoliceData,
    statePropName: 'vamcPoliceData',
  });
};

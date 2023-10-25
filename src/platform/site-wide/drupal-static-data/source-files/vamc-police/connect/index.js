import { connectDrupalStaticDataFile } from '../../../connect';
import { preProcessPoliceData } from './preProcess';

export const connectDrupalStaticDataFileVamcPolice = dispatch => {
  connectDrupalStaticDataFile(dispatch, {
    fileName: 'vamc-police.json',
    preProcess: preProcessPoliceData,
    statePropName: 'vamcPoliceData',
  });
};

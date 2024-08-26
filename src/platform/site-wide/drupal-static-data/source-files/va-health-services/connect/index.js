import { connectDrupalStaticDataFile } from '../../../connect';
import { preProcessHealthServicesData } from './preProcess';

export const connectDrupalStaticDataFileVamcEhr = dispatch => {
  connectDrupalStaticDataFile(dispatch, {
    fileName: 'va-healthcare-services.json',
    preProcess: preProcessHealthServicesData,
    statePropName: 'vaHealthServicesData',
  });
};

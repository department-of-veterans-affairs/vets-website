import { connectDrupalStaticDataFile } from '../../../connect';
import { preProcessHealthServicesData } from './preProcess';

export const connectDrupalStaticDataFileVaHealthServices = dispatch => {
  connectDrupalStaticDataFile(dispatch, {
    fileName: 'va-healthcare-services.json',
    preProcess: preProcessHealthServicesData,
    statePropName: 'vaHealthServicesData',
  });
};

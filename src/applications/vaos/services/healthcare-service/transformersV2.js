import { map } from 'lodash';
import Facility from './Facility';
import LocationSetting from './LocationSetting';
// import Clinic from './Clinic';

export function transformFacility(response, _meta, _arg) {
  // Pluck the 'attributes' data
  return map([...response], 'attributes').map(resp => {
    // return new Clinic(resp);
    return new Facility(resp);
  });
}

export function transformLocationSettings(response, _meta, _arg) {
  // Pluck the 'attributes' data
  return map([...response], 'attributes').map(resp => {
    // return new Clinic(resp);
    return new LocationSetting(resp);
  });
}

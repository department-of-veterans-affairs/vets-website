import mockData from './mockData';
import getDataReducer from './getData';
import personalInfo from './personalInfo';
import bankInfo from './bankInfo';
import updateAddress from './updateAddress';
import verifyEnrollment from './verifyEnrollment';

const rootReducer = {
  mockData,
  getDataReducer,
  personalInfo,
  bankInfo,
  updateAddress,
  verifyEnrollment,
};

export default rootReducer;

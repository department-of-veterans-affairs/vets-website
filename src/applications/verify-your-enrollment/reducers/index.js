import mockData from './mockData';
import getDataReducer from './getData';
import personalInfo from './personalInfo';
import bankInfo from './bankInfo';
import updateAddress from './updateAddress';
import verifyEnrollment from './verifyEnrollment';
import enrollmentCard from './enrollmentCard';

const rootReducer = {
  mockData,
  getDataReducer,
  personalInfo,
  bankInfo,
  updateAddress,
  verifyEnrollment,
  enrollmentCard,
};

export default rootReducer;

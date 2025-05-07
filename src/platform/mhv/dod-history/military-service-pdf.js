import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import {
  formatNameFirstLast,
  formatUserDob,
  generatePdfScaffold,
  getNameDateAndTime,
  makePdf,
} from '../util/helpers';
import { edipiNotFound } from '../util/constants';

const apiBasePath = `${environment.API_URL}/my_health/v1`;

const textHeaders = {
  'Content-Type': 'text/plain',
};

// make api call
/**
 * Get a patient's military service info
 * @returns patient's military service info
 */
const getMilitaryService = async () => {
  try {
    return await apiRequest(`${apiBasePath}/medical_records/military_service`, {
      textHeaders,
    });
  } catch (error) {
    // Handle special case of missing EDIPI
    if (error?.error === 'No EDIPI found for the current user') {
      return edipiNotFound;
    }
    // Rethrow if it’s another error we don’t want to specially handle
    throw error;
  }
};

// generate pdf
/**
 * @param {Object} userProfile user profile object from redux store (state.user.profile)
 */
export const generateMilitaryServicePdf = async (
  userProfile,
  runningUnitTest,
) => {
  const name = formatNameFirstLast(userProfile.userFullName);
  const dob = formatUserDob(userProfile);
  const data = await getMilitaryService();

  const title = 'DOD military service information report';
  const subject = 'VA Medical Record';
  const scaffold = generatePdfScaffold(userProfile, title, subject);
  const pdfName = `VA-DOD-military-service-information-report-${getNameDateAndTime(
    userProfile,
  )}`;

  const pdfData = {
    type: 'military service',
    titleParagraphGap: 0,
    titleMoveDownAmount: 0.5,
    details: {
      monospace: true,
      lineGap: 0,
      value: data,
      indent: 16,
    },
    ...scaffold,
    name,
    dob,
    lastUpdated: 'Unknown',
  };

  return makePdf(pdfName, pdfData, title, runningUnitTest, 'militaryService')
    .then(() => {
      return { success: true };
    })
    .catch(error => {
      return { success: false, error };
    });
};

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

/**
 * Get a patient's military service info
 * @returns {Promise<{ data: any, isEdipiFallback: boolean } | { error: any }>}
 */
const getMilitaryService = async () => {
  try {
    const result = await apiRequest(
      `${apiBasePath}/medical_records/military_service`,
      {
        textHeaders,
      },
    );
    return { data: result };
  } catch (error) {
    // Handle special case of missing EDIPI
    if (error?.error === 'No EDIPI found for the current user') {
      return { data: edipiNotFound };
    }
    // Rethrow if it’s another error we don’t want to specially handle
    return { error };
  }
};

/**
 * Generate PDF of military service info
 * @param {Object} userProfile user profile object from redux store (state.user.profile)
 * @param {boolean} runningUnitTest
 * @returns {Promise<{ success: boolean, error?: any }>}
 */
export const generateMilitaryServicePdf = async (
  userProfile,
  runningUnitTest,
) => {
  const name = formatNameFirstLast(userProfile.userFullName);
  const dob = formatUserDob(userProfile);

  const serviceResponse = await getMilitaryService();

  if ('error' in serviceResponse) {
    return { success: false, error: serviceResponse.error };
  }

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
      value: serviceResponse.data,
      indent: 16,
    },
    ...scaffold,
    name,
    dob,
    lastUpdated: 'Unknown',
  };

  try {
    await makePdf(
      pdfName,
      pdfData,
      'militaryService',
      `Medical Records - ${title} - PDF generation error`,
      runningUnitTest,
    );
    return { success: true };
  } catch (pdfError) {
    return { success: false, error: pdfError };
  }
};

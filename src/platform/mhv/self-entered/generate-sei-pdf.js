import {
  SEI_DOMAIN_DISPLAY_MAP,
  SEI_DOMAINS,
  UNKNOWN,
} from '../util/constants';
import {
  formatNameFirstLast,
  formatUserDob,
  generatePdfScaffold,
  getNameDateAndTime,
  makePdf,
} from '../util/helpers';
import { generateSelfEnteredData } from './generate-pdf-data';
import { getAllSelfEnteredData } from './data-fetcher';
import { processAllDomainResponse } from './data-converters';

/**
 * Returns a formatted list of failed health domains using display names.
 *
 * Special case: If the 'allergies' domain has failed but 'medications' has not,
 * this function adds 'medications' to the list of failed domains. This ensures
 * completeness, as allergy data is clinically relevant when reviewed alongside
 * medication data.
 *
 * @param {string[]} failed - List of failed domain keys (e.g., ['allergies']).
 * @returns {string[]} - Corresponding list of human-readable display names.
 */
const processFailedDomainList = failed => {
  const modFailed = [...failed];
  if (modFailed.includes('allergies') && !modFailed.includes('medications')) {
    modFailed.push('medications');
  }
  return modFailed.map(domain => SEI_DOMAIN_DISPLAY_MAP[domain]);
};

const generatePdf = (userProfile, seiRecords, failed, runningUnitTest) => {
  const name = formatNameFirstLast(userProfile.userFullName);
  const dob = formatUserDob(userProfile);
  const title = 'Self-entered information report';
  const subject = 'VA Medical Record';
  const scaffold = generatePdfScaffold(userProfile, title, subject);
  const pdfName = `VA-self-entered-information-report-${getNameDateAndTime(
    userProfile,
  )}`;

  const domainsWithRecords = {};
  Object.keys(seiRecords).forEach(key => {
    const domainRecs = seiRecords[key];
    if (domainRecs && Array.isArray(domainRecs) && !domainRecs.length) {
      domainsWithRecords[key] = null;
    } else {
      domainsWithRecords[key] = domainRecs;
    }
  });

  const pdfData = {
    recordSets: generateSelfEnteredData(seiRecords),
    ...scaffold,
    name,
    dob,
    lastUpdated: UNKNOWN,
  };
  makePdf(
    pdfName,
    pdfData,
    'selfEnteredInfo',
    `Medical Records - ${title} - PDF generation error`,
    runningUnitTest,
  )
    .then(() => {
      return { success: true, failedDomains: processFailedDomainList(failed) };
    })
    .catch(error => {
      return { success: false, error };
    });
};

export const generateSEIPdf = async (userProfile, runningUnitTest) => {
  try {
    const res = await getAllSelfEnteredData();
    const { seiRecords = {}, failedDomains = [] } =
      processAllDomainResponse(res) || {};
    const success = failedDomains.length < SEI_DOMAINS.length;
    if (success) {
      generatePdf(userProfile, seiRecords, failedDomains, runningUnitTest);
    }
    return { success, failedDomains };
  } catch (error) {
    return { success: false };
  }
};

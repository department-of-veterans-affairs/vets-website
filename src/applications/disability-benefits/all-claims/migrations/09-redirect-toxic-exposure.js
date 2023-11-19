import { formConfigBase } from '../config/form';
import formConfig8940 from '../config/8940';
import formConfig4192 from '../config/4192';
import { SHOW_8940_4192 } from '../constants';

/**
 * Migration for new Toxic Exposure (TE) pages. If user has a return url for a save in
 * progress form that would skip the new TE pages, redirect to the first TE
 * page.
 *
 * Note: for any new pages that are added after TE's location, consider adding to this migration.
 *
 * TODO: move this logic to Form526EZApp.jsx (see https://github.com/department-of-veterans-affairs/va.gov-team/issues/68207)
 */
export default function redirectToxicExposure(savedData) {
  const { returnUrl } = savedData.metadata;
  const formConfig = formConfigBase;
  let afterTEUrls = [];

  // add remaining, subsequent url's from disabilities chapter
  afterTEUrls = afterTEUrls.concat([
    '/pow',
    '/additional-disability-benefits',
    '/adaptive-benefits',
    '/aid-and-attendance',
    '/individual-unemployability',
    '/additional-disability-benefits-summary',
    '/disabilities/summary',
  ]);

  // add 8940 and 4192 if enabled
  if (sessionStorage.getItem(SHOW_8940_4192) === 'true') {
    for (const page of Object.entries(formConfig8940())) {
      afterTEUrls.push(`/${page[1].path}`);
    }
    for (const page of Object.entries(formConfig4192)) {
      afterTEUrls.push(`/${page[1].path}`);
    }
  }

  // add the supporting evidence chapter
  for (const page of Object.entries(
    formConfig.chapters.supportingEvidence.pages,
  )) {
    afterTEUrls.push(`/${page[1].path}`);
  }

  // add additional information chapter
  for (const page of Object.entries(
    formConfig.chapters.additionalInformation.pages,
  )) {
    afterTEUrls.push(`/${page[1].path}`);
  }

  // anything else
  afterTEUrls.push('/review-and-submit');

  // if user has not filled out TE and previously left off on any of the url's after TE, redirect
  const { formData } = savedData;
  if (
    formData['view:exposureStatus'] === undefined &&
    afterTEUrls.includes(returnUrl)
  ) {
    return {
      ...savedData,
      metadata: {
        ...savedData.metadata,
        returnUrl: '/toxic-exposure',
      },
    };
  }

  return savedData;
}

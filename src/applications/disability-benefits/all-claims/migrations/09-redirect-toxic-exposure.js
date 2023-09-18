import formConfig from '../config/form';

/**
 * Adding new Toxic Exposure (TE) pages. If user has a return url for a save in
 * progress form that would skip the new TE pages, redirect to the first TE
 * page.
 */
export default function redirectToxicExposure(savedData) {
  const { returnUrl } = savedData.metadata;

  const veteranDetailsUrls = [];
  for (const page of Object.entries(formConfig.chapters.veteranDetails.pages)) {
    veteranDetailsUrls.push(`/${page[1].path}`);
  }

  // if user hasn't reached TE pages yet, nothing to do (business as usual)
  if (veteranDetailsUrls.includes(returnUrl)) {
    return savedData;
  }

  const { formData } = savedData;
  if (
    returnUrl !== '/toxic-exposure-intro' &&
    formData['view:exposureStatus'] === undefined
  ) {
    return {
      ...savedData,
      metadata: {
        ...savedData.metadata,
        returnUrl: '/toxic-exposure-intro',
      },
    };
  }

  return savedData;
}

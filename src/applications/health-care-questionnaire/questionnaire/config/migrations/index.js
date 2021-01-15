import { createPathFromTitle, TITLES } from '../utils';

const updateUrls = ({ formData, metadata }) => {
  // console.log('before migrations', { formData, metadata, formId });
  // do something
  const url = metadata.returnUrl || metadata.return_url;
  const newMetadata = metadata;

  if (url === '/demographics') {
    const path = createPathFromTitle(TITLES.demographics);
    newMetadata.returnUrl = `/${path}`;
  }
  if (url === '/reason-for-visit') {
    const path = createPathFromTitle(TITLES.reasonForVisit);
    newMetadata.returnUrl = `/${path}`;
  }
  // console.log('after migrations', { formData, metadata, formId });

  return {
    formData,
    metadata,
  };
};
export { updateUrls };

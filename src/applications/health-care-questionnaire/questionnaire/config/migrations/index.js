import { createPathFromTitle, TITLES } from '../utils';

const updateUrls = ({ formData, metadata }) => {
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

  return {
    formData,
    metadata,
  };
};
export { updateUrls };

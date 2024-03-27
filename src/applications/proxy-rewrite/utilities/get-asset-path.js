import buckets from 'site/constants/buckets';

/**
 * Performs a static lookup from the `buckets` dictionary of AWS S3 Bucket URLs.
 * @param targetEnvironment The target environment used for AWS S3 Bucket lookup ['localhost' | 'vagovdev' | 'vagovstaging' | 'vagovprod'].
 * @returns The AWS S3 Bucket URL to the static assets used within the project.
 */
export const getAssetPath = (targetEnvironment = 'localhost') => {
  let assetPath = '';

  // Localhost is not available in the buckets
  if (targetEnvironment !== 'localhost') {
    // If the bucket is not found, an empty string will use relative paths.
    assetPath = buckets[targetEnvironment] || '';
  }

  return assetPath;
};

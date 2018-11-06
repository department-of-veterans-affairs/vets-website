const prodEnvironments = [
  // www.vets.gov
  'production',

  // preview.va.gov
  'preview',

  // www.va.gov
  'vagovprod',
];

/**
 * Checks to see if the current build-type is a production-ready environment.
 */
export default function isProduction() {
  return prodEnvironments.includes(__BUILDTYPE__);
}

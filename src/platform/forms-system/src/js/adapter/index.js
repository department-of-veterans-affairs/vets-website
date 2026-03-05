/**
 * Forms library adapter — central import boundary for all external platform
 * dependencies used by forms-system and forms.
 *
 * When this code is extracted into a standalone npm package, this module
 * becomes the adapter *interface* (injection-based). The host application
 * (e.g. vets-website) provides the implementation via `setFormsAdapter()`.
 *
 * While the code still lives inside vets-website, the adapter simply
 * re-exports from the platform modules. This lets us enforce a single
 * import boundary and validate that the adapter contract is sufficient
 * before the code is physically moved.
 */

export * from './utilities';
export * from './monitoring';
export * from './user';
export * from './siteWide';
export * from './staticData';

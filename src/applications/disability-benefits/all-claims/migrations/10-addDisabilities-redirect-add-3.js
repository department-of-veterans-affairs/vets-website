/**
 * It is necessary to have temporary urls that contain the new content when using feature toggles in forms.
 * This redirects users that saved their form on the /new-disabilities/add-3 temporary url to the standard /new-disabilities/add url.
 * The /new-disabilities/add-3 url was named this because it was considered the 3rd major iteration of the Add Conditions page.
 * It updated the Add Conditions page from using src/applications/disability-benefits/all-claims/components/ArrayField.jsx to instead use the platform ArrayField. It also updated from the ComboBox component to the Autocomplete component.
 * Last PR before release: https://github.com/department-of-veterans-affairs/vets-website/pull/34038
 */

export default function addDisabilitiesRedirectAdd3(savedData) {
  const { returnUrl } = savedData.metadata;

  if (returnUrl === '/new-disabilities/add-3') {
    return {
      ...savedData,
      metadata: {
        ...savedData.metadata,
        returnUrl: '/new-disabilities/add',
      },
    };
  }

  return savedData;
}

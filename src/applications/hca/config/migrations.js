import get from 'platform/utilities/data/get';
import omit from 'platform/utilities/data/omit';
import set from 'platform/utilities/data/set';
import unset from 'platform/utilities/data/unset';

export default [
  // 0 -> 1, we had a bug where isSpanishHispanicLatino was defaulted in the wrong place
  // and this removes it and defaults it in the right spot if necessary
  savedData => {
    const newData = savedData;
    newData.formData = unset('isSpanishHispanicLatino', savedData.formData);

    if (
      typeof get(
        'view:demographicCategories.isSpanishHispanicLatino',
        newData.formData,
      ) === 'undefined'
    ) {
      newData.formData = set(
        'view:demographicCategories.isSpanishHispanicLatino',
        false,
        newData.formData,
      );
      return newData;
    }

    return newData;
  },
  // 1 -> 2, we converted the children page to a dependents page, then updated
  // all the field names to not reference child/children anymore
  ({ formData, metadata }) => {
    let newData = formData;

    if (typeof newData['view:reportChildren'] !== 'undefined') {
      newData = unset('view:reportChildren', newData);
      newData['view:reportDependents'] = formData['view:reportChildren'];
    }

    if (newData.children) {
      newData = unset('children', newData);
      newData.dependents = formData.children.map(child =>
        Object.keys(child).reduce((acc, field) => {
          if (field === 'view:childSupportDescription') {
            acc['view:dependentSupportDescription'] = child[field];
          } else if (field === 'childEducationExpenses') {
            acc.dependentEducationExpenses = child[field];
          } else if (field === 'childRelation') {
            acc.dependentRelation = child[field];
          } else if (field.startsWith('child')) {
            const newField = field.replace(/^child/, '');
            const [firstLetter, ...restOfField] = newField;
            acc[`${firstLetter.toLowerCase()}${restOfField.join('')}`] =
              child[field];
          } else {
            acc[field] = child[field];
          }

          return acc;
        }, {}),
      );
    }

    return { formData: newData, metadata };
  },
  // 2 -> 3, we're updating the url for the dependent info page since it's for dependents
  // and not just children anymore
  ({ formData, metadata }) => {
    const url = metadata.returnUrl || metadata.return_url;
    let newMetadata = metadata;

    if (url === '/household-information/child-information') {
      newMetadata = set(
        'returnUrl',
        '/household-information/dependent-information',
        metadata,
      );
    }

    return { formData, metadata: newMetadata };
  },
  // 3 -> 4, we need to ensure the correct compensation type is selected
  ({ formData, metadata }) => {
    const {
      compensableVaServiceConnected = null,
      isVaServiceConnected = null,
      receivesVaPension = null,
    } = formData;

    // Haven't gotten to this page yet
    if (
      compensableVaServiceConnected === null &&
      isVaServiceConnected === null &&
      receivesVaPension === null
    ) {
      return { formData, metadata };
    }

    const newFormData = omit(
      [
        'compensableVaServiceConnected',
        'isVaServiceConnected',
        'receivesVaPension',
      ],
      formData,
    );

    // We want to convert the data only when one option is true and the others are false
    // If more than one is true, we need to ask the user again
    if (
      compensableVaServiceConnected === false &&
      isVaServiceConnected === false &&
      receivesVaPension === false
    ) {
      return {
        formData: set('vaCompensationType', 'none', newFormData),
        metadata,
      };
    }

    if (
      compensableVaServiceConnected === true &&
      isVaServiceConnected === false &&
      receivesVaPension === false
    ) {
      return {
        formData: set('vaCompensationType', 'lowDisability', newFormData),
        metadata,
      };
    }

    if (
      compensableVaServiceConnected === false &&
      isVaServiceConnected === true &&
      receivesVaPension === false
    ) {
      return {
        formData: set('vaCompensationType', 'highDisability', newFormData),
        metadata,
      };
    }

    if (
      compensableVaServiceConnected === false &&
      isVaServiceConnected === false &&
      receivesVaPension === true
    ) {
      return {
        formData: set('vaCompensationType', 'pension', newFormData),
        metadata,
      };
    }

    // More than one option was chosen, or not all were filled out, so go back to the page and make the user pick again,
    // because we don't know for sure what they meant to pick
    return {
      formData: newFormData,
      metadata: metadata.prefill
        ? metadata
        : set('returnUrl', '/va-benefits/basic-information', metadata),
    };
  },
  // 4 -> 5, we need to ensure required strings cannot pass validation with only spaces
  ({ formData, metadata }) => {
    let newFormData = formData;
    let newMetaData = metadata || {};
    const notBlankStringPattern = /^.*\S.*/;

    [
      {
        selector: 'veteranAddress.city',
        returnUrl: 'veteran-information/veteran-address',
      },
      {
        selector: 'veteranAddress.street',
        returnUrl: 'veteran-information/veteran-address',
      },
    ].forEach(({ selector, returnUrl }) => {
      if (!notBlankStringPattern.test(get(selector, newFormData))) {
        newFormData = unset(selector, newFormData);
        newMetaData = set('returnUrl', returnUrl, newMetaData);
      }
    });

    return {
      formData: newFormData,
      metadata: newMetaData,
    };
  },
  // 5 -> 6, send user back to fields with only spaces
  ({ formData, metadata }) => {
    let newFormData = formData;
    let newMetaData = metadata || {};
    const notBlankStringPattern = /^.*\S.*/;

    if (newFormData.providers) {
      newFormData.providers.forEach((provider, index) => {
        if (!notBlankStringPattern.test(provider.insuranceGroupCode)) {
          newFormData = unset(
            ['providers', index, 'insuranceGroupCode'],
            newFormData,
          );
          newMetaData = set(
            'returnUrl',
            'insurance-information/general',
            newMetaData,
          );
        }

        if (!notBlankStringPattern.test(provider.insurancePolicyNumber)) {
          newFormData = unset(
            ['providers', index, 'insurancePolicyNumber'],
            newFormData,
          );
          newMetaData = set(
            'returnUrl',
            'insurance-information/general',
            newMetaData,
          );
        }
      });
    }

    return {
      formData: newFormData,
      metadata: newMetaData,
    };
  },
  // 6 -> 7, we fully adopted a revised household section and need update the URLs from
  // the to remove the `v2` reference
  ({ formData, metadata }) => {
    const url = metadata.returnUrl || metadata.return_url;
    let newMetadata = metadata;

    if (url.includes('household-information-v2')) {
      const returnUrl = url.replace(
        /household-information-v2/,
        'household-information',
      );

      newMetadata = set('returnUrl', returnUrl, newMetadata);
    }

    return { formData, metadata: newMetadata };
  },
  // 7 -> 8, with the addition of the Toxic Exposure questions, we need to ensure all
  // users go through these, so we will send users back to the start of the form
  ({ formData, metadata }) => {
    const returnUrl = '/veteran-information/personal-information';
    let newMetadata = metadata;
    newMetadata = set('returnUrl', returnUrl, newMetadata);
    return { formData, metadata: newMetadata };
  },
];

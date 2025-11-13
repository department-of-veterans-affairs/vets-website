import { cloneDeep } from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { dateSigned, transformPhoneNumber } from '../helpers';

export default function transform(formConfig, form) {
  const authorizedOfficialTransform = formData => {
    const clonedData = cloneDeep(formData);

    clonedData.authorizedOfficial = {
      ...clonedData.authorizedOfficial,
      usPhone: clonedData.authorizedOfficial.usPhone
        ? transformPhoneNumber(clonedData.authorizedOfficial.usPhone)
        : null,
      internationalPhone: clonedData.authorizedOfficial.internationalPhone
        ? transformPhoneNumber(clonedData.authorizedOfficial.internationalPhone)
        : null,
    };

    return clonedData;
  };
  const contactTransform = formData => {
    const clonedData = cloneDeep(formData);

    if (clonedData.authorizedOfficial['view:isPOC']) {
      // Principles of Excellence PoC is the same as the authorizing official
      const principlesOfExcellencePointOfContact = cloneDeep(
        clonedData.authorizedOfficial,
      );

      clonedData.newCommitment = {
        ...clonedData.newCommitment,
        principlesOfExcellencePointOfContact,
      };
    } else {
      clonedData.newCommitment = {
        ...clonedData.newCommitment,
        principlesOfExcellencePointOfContact: {
          ...clonedData.newCommitment.principlesOfExcellencePointOfContact,
          usPhone: clonedData.newCommitment.principlesOfExcellencePointOfContact
            .usPhone
            ? transformPhoneNumber(
                clonedData.newCommitment.principlesOfExcellencePointOfContact
                  .usPhone,
              )
            : null,
          internationalPhone: clonedData.newCommitment
            .principlesOfExcellencePointOfContact.internationalPhone
            ? transformPhoneNumber(
                clonedData.newCommitment.principlesOfExcellencePointOfContact
                  .internationalPhone,
              )
            : null,
        },
      };
    }

    if (clonedData.authorizedOfficial['view:isSCO']) {
      // School certifying official (SCO) is the same as the authorizing official
      const schoolCertifyingOfficial = cloneDeep(clonedData.authorizedOfficial);

      clonedData.newCommitment = {
        ...clonedData.newCommitment,
        schoolCertifyingOfficial,
      };
    } else {
      clonedData.newCommitment = {
        ...clonedData.newCommitment,
        schoolCertifyingOfficial: {
          ...clonedData.newCommitment.schoolCertifyingOfficial,
          usPhone: clonedData.newCommitment.schoolCertifyingOfficial.usPhone
            ? transformPhoneNumber(
                clonedData.newCommitment.schoolCertifyingOfficial.usPhone,
              )
            : null,
          internationalPhone: clonedData.newCommitment.schoolCertifyingOfficial
            .internationalPhone
            ? transformPhoneNumber(
                clonedData.newCommitment.schoolCertifyingOfficial
                  .internationalPhone,
              )
            : null,
        },
      };
    }

    if (
      clonedData.newCommitment?.principlesOfExcellencePointOfContact?.[
        'view:isSCO'
      ]
    ) {
      // School certifying official (SCO) is the same as the Principles of Excellence point of contact
      const schoolCertifyingOfficial = cloneDeep(
        clonedData.newCommitment.principlesOfExcellencePointOfContact,
      );

      clonedData.newCommitment = {
        ...clonedData.newCommitment,
        schoolCertifyingOfficial,
      };
    }

    return clonedData;
  };

  const institutionTransform = formData => {
    const clonedData = cloneDeep(formData);

    delete clonedData.institutionDetails.poeEligible;

    clonedData.mainInstitution = {
      ...clonedData.institutionDetails,
      institutionAddress: {
        street: clonedData.institutionDetails.institutionAddress.street
          ? clonedData.institutionDetails.institutionAddress.street
          : null,
        street2: clonedData.institutionDetails.institutionAddress.street2
          ? clonedData.institutionDetails.institutionAddress.street2
          : null,
        street3: clonedData.institutionDetails.institutionAddress.street3
          ? clonedData.institutionDetails.institutionAddress.street3
          : null,
        city: clonedData.institutionDetails.institutionAddress.city
          ? clonedData.institutionDetails.institutionAddress.city
          : null,
        state: clonedData.institutionDetails.institutionAddress.state
          ? clonedData.institutionDetails.institutionAddress.state
          : null,
        postalCode: clonedData.institutionDetails.institutionAddress.postalCode
          ? clonedData.institutionDetails.institutionAddress.postalCode
          : null,
        country: clonedData.institutionDetails.institutionAddress.country
          ? clonedData.institutionDetails.institutionAddress.country
          : null,
      },
    };

    return clonedData;
  };

  const additionalLocationsTransform = formData => {
    const clonedData = cloneDeep(formData);

    delete clonedData.addMoreLocations;

    clonedData.additionalInstitutions = clonedData.additionalLocations.map(
      institution => {
        let clonedInstitution = cloneDeep(institution);

        delete clonedInstitution.poeEligible;
        delete clonedInstitution.isLoading;

        if (institution.pointOfContact?.key === 'none') {
          clonedInstitution.pointOfContact = {
            fullName: institution?.fullName,
            email: institution?.email,
          };
        }

        clonedInstitution = {
          ...clonedInstitution,
          institutionAddress: {
            street: institution.institutionAddress?.street
              ? institution.institutionAddress.street
              : null,
            street2: institution.institutionAddress?.street2
              ? institution.institutionAddress.street2
              : null,
            street3: institution.institutionAddress?.street3
              ? institution.institutionAddress.street3
              : null,
            city: institution.institutionAddress?.city
              ? institution.institutionAddress.city
              : null,
            state: institution.institutionAddress?.state
              ? institution.institutionAddress.state
              : null,
            postalCode: institution.institutionAddress?.postalCode
              ? institution.institutionAddress.postalCode
              : null,
            country: institution.institutionAddress?.country
              ? institution.institutionAddress.country
              : null,
          },
        };

        delete clonedInstitution.pointOfContact.key;
        delete clonedInstitution.fullName;
        delete clonedInstitution.email;

        delete clonedInstitution.pointOfContact.title;
        delete clonedInstitution.pointOfContact.phone;

        return {
          ...clonedInstitution,
        };
      },
    );

    return clonedData;
  };

  const removePrincipleTransform = formData => {
    const clonedData = cloneDeep(formData);
    delete clonedData.principle1;
    delete clonedData.principle2;
    delete clonedData.principle3;
    delete clonedData.principle4;
    delete clonedData.principle5;
    delete clonedData.principle6;
    delete clonedData.principle7;
    delete clonedData.principle8;
    return clonedData;
  };

  const privacyAgreementTransform = formData => {
    const clonedData = cloneDeep(formData);

    delete clonedData.statementOfTruthCertified;
    delete clonedData.additionalLocations;
    delete clonedData.institutionDetails;

    return {
      ...clonedData,
      dateSigned: dateSigned(),
    };
  };

  // Stringifies the form data and removes empty fields
  const usFormTransform = formData =>
    transformForSubmit(
      formConfig,
      { ...form, data: formData },
      { allowPartialAddress: true },
    );

  const transformedData = [
    authorizedOfficialTransform,
    contactTransform,
    institutionTransform,
    additionalLocationsTransform,
    removePrincipleTransform,
    privacyAgreementTransform,
    usFormTransform, // this must appear last
  ].reduce((formData, transformer) => transformer(formData), form.data);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}

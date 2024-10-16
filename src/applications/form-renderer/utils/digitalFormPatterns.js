import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';

const defaultSchema = {
  type: 'object',
};

export const digitalFormAddress = ({ additionalFields, pageTitle }) => {
  const schema = {
    ...defaultSchema,
  };
  const uiSchema = { ...webComponentPatterns.titleUI(pageTitle) };
  if (additionalFields.militaryAddressCheckbox === false) {
    schema.properties = {
      address: webComponentPatterns.addressNoMilitarySchema(),
    };
    uiSchema.address = webComponentPatterns.addressNoMilitaryUI();
  } else {
    schema.properties = {
      address: webComponentPatterns.addressSchema(),
    };
    uiSchema.address = webComponentPatterns.addressUI();
  }

  return { schema, uiSchema };
};

export const digitalFormNameAndDoB = ({ additionalFields, pageTitle }) => {
  const schema = {
    ...defaultSchema,
    properties: {
      fullName: webComponentPatterns.fullNameSchema,
    },
  };
  const uiSchema = {
    ...webComponentPatterns.titleUI(pageTitle),
    fullName: webComponentPatterns.fullNameUI(),
  };

  if (additionalFields.includeDateOfBirth) {
    schema.properties.dateOfBirth = webComponentPatterns.dateOfBirthSchema;
    uiSchema.dateOfBirth = webComponentPatterns.dateOfBirthUI();
  }

  return { schema, uiSchema };
};

export const digitalFormIdentificationInfo = ({
  additionalFields,
  pageTitle,
}) => {
  const schema = {
    ...defaultSchema,
    properties: {
      veteranId: webComponentPatterns.ssnOrVaFileNumberSchema,
    },
  };
  const uiSchema = {
    ...webComponentPatterns.titleUI(pageTitle),
    veteranId: webComponentPatterns.ssnOrVaFileNumberUI(),
  };

  if (additionalFields.includeServiceNumber) {
    schema.properties.serviceNumber = webComponentPatterns.serviceNumberSchema;
    uiSchema.serviceNumber = webComponentPatterns.serviceNumberUI();
  }

  return { schema, uiSchema };
};

export const digitalFormPhoneAndEmail = ({ additionalFields, pageTitle }) => {
  const schema = {
    ...defaultSchema,
    properties: {
      homePhone: webComponentPatterns.phoneSchema,
      mobilePhone: webComponentPatterns.phoneSchema,
    },
    required: ['homePhone'],
  };
  const uiSchema = {
    ...webComponentPatterns.titleUI(pageTitle),
    homePhone: webComponentPatterns.phoneUI('Home phone number'),
    mobilePhone: webComponentPatterns.phoneUI('Mobile phone number'),
  };

  if (additionalFields.includeEmail) {
    schema.properties.emailAddress = webComponentPatterns.emailSchema;
    uiSchema.emailAddress = webComponentPatterns.emailUI();
  }

  return { schema, uiSchema };
};

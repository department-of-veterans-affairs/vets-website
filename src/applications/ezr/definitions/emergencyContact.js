import emergencyContactNameAndRelationship from '../config/chapters/emergencyContactInformation/contactNameAndRelationship';
import emergencyContactAddress from '../config/chapters/emergencyContactInformation/contactAddress';
import emergencyContactPhoneNumber from '../config/chapters/emergencyContactInformation/contactPhoneNumber';
// define uiSchemas for each page in the emergency contact flow
export const emergencyContactUISchema = {
  nameAndRelationship: emergencyContactNameAndRelationship.uiSchema,
  address: emergencyContactAddress.uiSchema,
  phoneNumber: emergencyContactPhoneNumber.uiSchema,
};

// define schemas for each page in the emergency contact flow
export const emergencyContactSchema = {
  nameAndRelationship: emergencyContactNameAndRelationship.schema,
  address: emergencyContactAddress.schema,
  phoneNumber: emergencyContactPhoneNumber.schema,
};

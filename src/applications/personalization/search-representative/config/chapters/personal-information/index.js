import * as authenticatedContent from './authenticated';
import * as unauthenticatedContent from './unauthenticated';

export const title = 'Service member or Veteran’s Information';

export const getSchema = authenticated => {
  return authenticated
    ? authenticatedContent.schema
    : unauthenticatedContent.schema;
};

export const getUiSchema = authenticated => {
  return authenticated
    ? authenticatedContent.uiSchema
    : unauthenticatedContent.uiSchema;
};

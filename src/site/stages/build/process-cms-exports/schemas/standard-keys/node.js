/* eslint-disable camelcase */
module.exports = {
  changed: {
    $ref: 'GenericNestedString',
  },
  created: {
    $ref: 'GenericNestedString',
  },
  default_langcode: {
    $ref: 'GenericNestedBoolean',
  },
  langcode: {
    $ref: 'GenericNestedString',
  },
  menu_link: {
    $ref: 'GenericNestedString',
  },
  metatag: {
    type: 'object',
  },
  moderation_state: {
    $ref: 'GenericNestedString',
  },
  path: {
    $ref: 'NestedAliasString',
  },
  promote: {
    $ref: 'GenericNestedBoolean',
  },
  revision_log: {
    $ref: 'GenericNestedString',
  },
  revision_timestamp: {
    $ref: 'GenericNestedString',
  },
  revision_translation_affected: {
    $ref: 'GenericNestedBoolean',
  },
  revision_uid: {
    $ref: 'EntityReferenceArray',
  },
  status: {
    $ref: 'GenericNestedBoolean',
  },
  sticky: {
    $ref: 'GenericNestedBoolean',
  },
  title: {
    $ref: 'GenericNestedString',
  },
  type: {
    $ref: 'EntityType',
  },
  uid: {
    $ref: 'EntityReferenceArray',
  },
  uuid: {
    type: 'string',
  },
};

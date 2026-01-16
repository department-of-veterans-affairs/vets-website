export const fileUploadWithMetadataSchema = ({
  enumNames = [],
  minItems = 1,
} = {}) => {
  const options = Array.isArray(enumNames) ? enumNames : [];
  const normalized = options.map(opt => opt.trim()).filter(Boolean);

  // de-duplicate while preserving first-seen order
  const enumValues = [...new Set(normalized)];

  // coerce minItems to a safe non-negative integer (default 1)
  const safeMin =
    Number.isFinite(minItems) && minItems >= 0 ? Math.floor(minItems) : 1;

  return {
    type: 'array',
    minItems: safeMin,
    items: {
      type: 'object',
      required: ['attachmentId', 'name'],
      properties: {
        name: {
          type: 'string',
        },
        attachmentId: {
          type: 'string',
          enum: enumValues,
          enumNames: enumValues,
        },
      },
    },
  };
};

export const fileUploadSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
    },
  },
};

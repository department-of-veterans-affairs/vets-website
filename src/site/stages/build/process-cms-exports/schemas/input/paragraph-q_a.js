/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_answer: { $ref: 'EntityReferenceArray' },
    field_question: { $ref: 'GenericNestedString' },
  },
  required: ['field_answer', 'field_question'],
};

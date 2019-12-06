/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_answer: { $ref: 'GenericNestedString' },
    field_question: { $ref: 'GenericNestedString' },
  },
  required: ['field_answer', 'field_question'],
};

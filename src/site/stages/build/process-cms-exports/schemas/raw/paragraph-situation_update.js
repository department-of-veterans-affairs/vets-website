/* eslint-disable camelcase */

module.exports = {
	type: 'object',
	properties: {
		field_date_and_time: {
			type: 'array',
			items: {
				properties: {
					// These are actually timestamps like: 2019-05-30T21:00:00
					value: { type: 'string' },
				},
			},
		},
		field_send_email_to_subscribers: { $ref: 'GenericNestedBoolean' },
		field_wysiwyg: {
			$ref: 'GenericNestedString',
		},
	},
	"required": [
		"field_date_and_time",
		"field_wysiwyg"
	]
};

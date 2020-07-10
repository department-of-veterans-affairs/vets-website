module.exports = {
	type: 'object',
	properties: {
		contentModelType: { type: 'string', enum: ['paragraph-situation_update'] },
		entity: {
			type: 'object',
			properties: {
				entityType: { type: 'string' },
				entityBundle: { type: 'string' },
				//fieldDateAndTime: { type: 'string' },
				fieldDateAndTime: {
					type: 'object',
					// These properties are strings resembling dates
					properties: {
						date: { type: 'string' },
						value: { type: 'string' },
					},
				},
				fieldSendEmailToSubscribers: { type: ['boolean'] },
				fieldWysiwyg: { type: ['string'] },
			},
			required: [
				'entityType',
				'entityBundle',
				'fieldDateAndTime',
				'fieldSendEmailToSubscribers',
				'fieldWysiwyg',
			],
		},
	},
	required: ['contentModelType', 'entity'],
};


const { partialSchema } = require('../../transformers/helpers');
const alertsSchema = require('./node-vamc_operating_status_and_alerts');

module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-full_width_banner_alert'] },
    entityType: { enum: ['node'] },
    entityBundle: { enum: ['full_width_banner_alert'] },
    title: { type: 'string' },
    created: { type: 'number' },
    changed: { type: 'number' },
    entityUrl: { $ref: 'EntityUrl' },
    entityMetatags: { $ref: 'MetaTags' },
    status: { type: 'boolean' },
    fieldAdministration: { $ref: 'output/taxonomy_term-administration' },
    fieldAlertDismissable: { type: 'boolean' },
    fieldAlertEmailUpdatesButton: { type: 'boolean' },
    fieldAlertFindFacilitiesCta: { type: 'boolean' },
    fieldAlertInheritanceSubpages: { type: ['boolean', 'null'] },
    fieldAlertOperatingStatusCta: { type: 'boolean' },
    fieldAlertType: { type: 'string' },
    fieldBannerAlertComputdvalues: { type: ['string', 'null'] },
    fieldBannerAlertVamcs: {
      type: 'array',
      items: {
        entity: partialSchema(alertsSchema, ['fieldOffice', 'entityUrl']),
      },
    },
    fieldBody: { type: 'string' },
    fieldOperatingStatusSendemail: { type: 'boolean' },
    fieldSituationUpdates: {
      type: 'array',
      items: {
        $ref: 'Paragraph',
      },
    },
  },
  required: [
    'title',
    'created',
    'changed',
    'entityUrl',
    'entityMetatags',
    'status',
    'fieldAdministration',
    'fieldAlertDismissable',
    'fieldAlertEmailUpdatesButton',
    'fieldAlertFindFacilitiesCta',
    'fieldAlertInheritanceSubpages',
    'fieldAlertOperatingStatusCta',
    'fieldAlertType',
    'fieldBannerAlertComputdvalues',
    'fieldBannerAlertVamcs',
    'fieldBody',
    'fieldOperatingStatusSendemail',
    'fieldSituationUpdates',
  ],
};

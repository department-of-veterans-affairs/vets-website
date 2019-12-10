/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    name: { $ref: 'GenericNestedString' },
    field_acronym: { $ref: 'GenericNestedString' },
    field_description: { $ref: 'GenericNestedString' },
    field_email_updates_link_text: { $ref: 'GenericNestedString' },
    field_email_updates_url: { $ref: 'GenericNestedString' },
    field_intro_text: { $ref: 'GenericNestedString' },
    field_link: {
      type: 'object',
      properties: {
        uri: { type: 'string' },
        title: { type: 'string' },
        // All examples had an empty array at the time this was written
        // To find field_link options:
        // rg -U --multiline-dotall '"field_link": \[\s+\{.+?"options"' $(rg -l '"target_id": "administration"' taxonomy_term.*.json)
        options: { type: 'array' },
      },
    },
    field_social_media_links: {
      type: 'object',
      properties: {
        // All examples were null
        platform: { type: ['null'] },
        value: { type: ['null'] },
        platform_values: {
          type: 'object',
          properties: {
            facebook: { $ref: 'GenericNestedString' },
            instgram: { $ref: 'GenericNestedString' },
            linkedin: { $ref: 'GenericNestedString' },
            twitter: { $ref: 'GenericNestedString' },
            youtube: { $ref: 'GenericNestedString' },
            youtube_channel: { $ref: 'GenericNestedString' },
          },
          required: [
            'facebook',
            'instagram',
            'linkedin',
            'twitter',
            'youtube',
            'youtube_channel',
          ],
        },
      },
    },
  },
  required: [
    'name',
    'field_acronym',
    'field_description',
    'field_email_updates_link_text',
    'field_email_updates_url',
    'field_intro_text',
    'field_link',
    'field_social_media_links',
  ],
};

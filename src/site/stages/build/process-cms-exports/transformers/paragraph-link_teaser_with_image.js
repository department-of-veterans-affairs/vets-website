const transform = entity => ({
  entity: {
    fieldLinkTeaser: entity.fieldLinkTeaser?.[0],
    fieldMedia: entity.fieldMedia?.[0],
  },
});

module.exports = {
  filter: ['field_link_teaser', 'field_media'],
  transform,
};

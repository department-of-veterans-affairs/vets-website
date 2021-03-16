const { getImageCrop } = require('./helpers');

const setImageCrop = media => {
  const imageObj = Object.assign({}, media);
  imageObj.image.derivative.url = encodeURI(
    imageObj.thumbnail.url.replace('public:/', '/img'),
  );
  imageObj.image.derivative.width = 0;
  imageObj.image.derivative.height = 0;
  // Re-apply the Image style size
  return getImageCrop(imageObj, '_1_1_SQUARE_MEDIUM_THUMBNAIL');
};

const transform = entity => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'staff_profile',
    queryFieldStaffProfile: {
      entities: entity.fieldStaffProfile.map(staffProfile => ({
        fieldMedia: staffProfile.fieldMedia
          ? setImageCrop(staffProfile.fieldMedia.entity)
          : null,
        ...staffProfile,
      })),
    },
    // Unpublished person nodes will still have status == true here
    // So we need to make sure we have fieldStaffProfile data instead.
    entityPublished: !!entity.fieldStaffProfile[0],
  },
});
module.exports = {
  filter: ['field_staff_profile'],
  transform,
};

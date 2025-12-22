import React from 'react';
import PropTypes from 'prop-types';
import FileUploadDescription from './FileUploadDescription';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--card-sample-title'];
const LABEL_FRONT = content['medicare--card-sample-label--front'];
const LABEL_BACK = content['medicare--card-sample-label--back'];

const CARD_IMAGES = {
  partsAB: {
    src: '/img/ivc-champva/part_a_and_b_front_high_res.png',
    altText: content['medicare--parts-ab-card-alt-text--front'],
  },
  partA: {
    src: '/img/ivc-champva/part_a_card_front_high_res.png',
    altText: content['medicare--part-a-card-alt-text--front'],
  },
  partB: {
    src: '/img/ivc-champva/part_b_card_front_high_res.png',
    altText: content['medicare--part-b-card-alt-text--front'],
  },
  allBack: {
    src: '/img/ivc-champva/medicare_back_high_res.png',
    altText: content['medicare--card-upload-alt-text--back'],
  },
};
const CARD_IMAGE_STYLE = { maxWidth: '300px' };
const CARD_IMAGE_CLASS = 'vads-u-width--full';
const CARD_FRONT_VARIANTS = ['partsAB', 'partA', 'partB'];

const MedicareCardDescription = ({ variant }) => (
  <>
    <div className="vads-u-background-color--gray-lightest vads-u-margin-y--4 vads-u-padding--2">
      <h2 className="vads-u-margin-top--0 vads-u-font-size--h3">
        {TITLE_TEXT}
      </h2>

      <p>{LABEL_FRONT}</p>
      <img
        src={CARD_IMAGES[variant]?.src}
        alt={CARD_IMAGES[variant]?.altText}
        className={`${CARD_IMAGE_CLASS} vads-u-margin-bottom--2`}
        style={CARD_IMAGE_STYLE}
      />

      <p>{LABEL_BACK}</p>
      <img
        src={CARD_IMAGES.allBack.src}
        alt={CARD_IMAGES.allBack.altText}
        className={CARD_IMAGE_CLASS}
        style={CARD_IMAGE_STYLE}
      />
    </div>

    <FileUploadDescription />
  </>
);

MedicareCardDescription.propTypes = {
  variant: PropTypes.oneOf(CARD_FRONT_VARIANTS).isRequired,
};

export default MedicareCardDescription;

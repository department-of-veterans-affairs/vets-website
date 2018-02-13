import React from 'react';

const FONT_FAMILY = 'Arial, Helvetica, sans-serif';
// sets the aspect ratio of svg
const VIEW_BOX = '0 0 2048 1284';
// height of font top to bottom bounding box in the above viewbox
const LARGE_FONT_SIZE = 90;
const SMALL_FONT_SIZE = 60;

const branchCodeLabels = {
  A: 'Army',
  C: 'Coast Guard',
  F: 'Air Force',
  N: 'Navy',
  M: 'Marine Corps'
};

const imagePaths = {
  A: '/img/vic-army-symbol.png',
  C: '/img/vic-cg-emblem.png',
  F: '/img/vic-air-force-coat-of-arms.png',
  N: '/img/vic-navy-emblem.png',
  M: '/img/vic-usmc-emblem.png',
  previewBackground: '/img/vic-preview-background.svg',
  VASeal: '/img/vic-va-seal.png'
};

function getIsLongName(name) {
  try {
    return document
      .createElement('canvas')
      .getContext('2d')
      .measureText(name)
    // manually determined max width
      .width > 120;
  } catch (e) {
    return true;
  }
}

const VeteranIDCard = ({
  veteranBranchCode,
  veteranFirstName,
  veteranID,
  veteranLastName,
  veteranPhotoUrl
}) => (
  // svg preserves aspect ratio
  <svg
    fill="white"
    fontFamily={FONT_FAMILY}
    preserveAspectRatio="xMidYMid meet"
    stroke="none"
    viewBox={VIEW_BOX}>

    <image href={imagePaths.previewBackground} width="100%"/>

    <image height="28.5%" href={imagePaths.VASeal} x="6.5%" y="7.3%"/>
    <text fontSize={LARGE_FONT_SIZE} x="26.3%" y="24.3%">
      Veteran Identification Card
    </text>

    {
      getIsLongName(`${veteranFirstName} ${veteranLastName}`) ?
        [
          (
            <text fontSize={LARGE_FONT_SIZE} key="firstName" x="6.5%" y="50.6%">
              {veteranFirstName}
            </text>
          ),
          (
            <text fontSize={LARGE_FONT_SIZE} key="lastName" x="6.5%" y="58.8%">
              {veteranLastName}
            </text>
          )
        ] : (
          <text fontSize={LARGE_FONT_SIZE} x="6.5%" y="55.2%">
            {`${veteranFirstName} ${veteranLastName}`}
          </text>
        )
    }

    <image height="21.1%" href={imagePaths[veteranBranchCode]} x="6.5%" y="70%"/>
    <text fontSize={SMALL_FONT_SIZE} x="22.8%" y="78.9%">
      {branchCodeLabels[veteranBranchCode]}
    </text>
    <text fontSize={SMALL_FONT_SIZE} x="22.8%" y="85.2%">
      Honorable Discharge
    </text>

    <image height="51.8%" href={veteranPhotoUrl} x="62.1%" y="34.1%"/>
    <text
      fontSize={SMALL_FONT_SIZE}
      x="62.1%"
      y="91.9%">
      ID no: {veteranID}
    </text>
  </svg>
);

VeteranIDCard.propTypes = {
  veteranBranchCode: React.PropTypes.oneOf(['F', 'A', 'C', 'M', 'N']),
  veteranFirstName: React.PropTypes.string.isRequired,
  veteranLastName: React.PropTypes.string.isRequired,
  veteranID: React.PropTypes.string.isRequired,
  veteranPhotoUrl: React.PropTypes.string.isRequired
};

export default VeteranIDCard;

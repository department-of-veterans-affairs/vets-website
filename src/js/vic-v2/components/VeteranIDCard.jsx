import React from 'react';

// will be able to set either height or width of component but not both:w
const WIDTH_HEIGHT_RATIO = 1.583;
const height = 300;

export default function VeteranIDCard() {
  // <img className="example-photo" alt="placeholder" src="/img/air-force-coat-of-arms.png"/>
  return (
    <div style={{ marginTop: '50px', backgroundColor: 'grey', height, width: height * WIDTH_HEIGHT_RATIO }}>
      <svg width={'100%'} height={'100%'}>
        <image width={'100%'} href={'/img/vic-preview-background.svg'} />
        <image height={'28.5%'} href={'/img/va-seal.png'} x={'6.5%'} y={'7.3%'} />
        <text x={'26.3%'} y={'24.3%'} stroke={'none'} fill={'white'} fontFamily={'Arial, Helvetica, sans-serif'} fontSize={23}>
          Veteran Identification Card
        </text>
        <image height={'51.8%'} href={'/img/example-photo-2.png'} x={'62.1%'} y={'34.1%'} />
        <image height={'21.1%'} href={'/img/air-force-coat-of-arms.png'} x={'7.3%'} y={'70%'} />
        <text x={'7.3%'} y={'55.2%'} stroke={'none'} fill={'white'} fontFamily={'Arial, Helvetica, sans-serif'} fontSize={23}>
          Firstname Lastname
        </text>
        <text x={'22.8%'} y={'78.9%'} stroke={'none'} fill={'white'} fontFamily={'Arial, Helvetica, sans-serif'} fontSize={15}>
          Air Force
        </text>
        <text x={'22.8%'} y={'85.2%'} stroke={'none'} fill={'white'} fontFamily={'Arial, Helvetica, sans-serif'} fontSize={15}>
          Honorable Discharge
        </text>
        <text x={'62.1%'} y={'91.9%'} stroke={'none'} fill={'white'} fontFamily={'Arial, Helvetica, sans-serif'} fontSize={12}>
          ID no: 05P3400000000pz
        </text>
      </svg>
    </div>
  );
}

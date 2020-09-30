import React from 'react';

const TemplateOne = () => <></>;

export const diaryCodes = Object.freeze({
  '71': 'Pending Veteran deployment verification',
  '109': 'Pending payment',
  '117': 'Pending payment',
  '123': 'Pending payment',
  '212': 'Pending Veteran address',
  '450': 'Pending automatic benefit offset',
  '811': 'Compromise offer is being reviewed',
});

export const renderAdditionalInfo = diaryCode => {
  switch (diaryCode) {
    case '71':
      return <TemplateOne />;
    case '109':
      return <TemplateOne />;
    case '117':
      return <TemplateOne />;
    case '123':
      return <TemplateOne />;
    case '212':
      return <TemplateOne />;
    case '450':
      return <TemplateOne />;
    case '811':
      return <TemplateOne />;
    case '815':
      return <TemplateOne />;
    case '816':
      return <TemplateOne />;
    case '821':
      return <TemplateOne />;
    case '822':
      return <TemplateOne />;
    case '825':
      return <TemplateOne />;
    case '430':
    case '431':
      return <TemplateOne />;
    case '002':
    case '005':
    case '032':
    case '609':
      return <TemplateOne />;
    case '061':
    case '065':
    case '070':
    case '440':
    case '442':
    case '448':
    case '453':
      return <TemplateOne />;
    case '080':
    case '850':
    case '852':
    case '860':
    case '855':
      return <TemplateOne />;
    case '081':
    case '500':
    case '510':
    case '503':
      return <TemplateOne />;
    case '100':
    case '102':
    case '130':
    case '140':
      return <TemplateOne />;
    case '101':
    case '602':
    case '607':
    case '608':
    case '610':
    case '611':
    case '614':
    case '615':
    case '617':
      return <TemplateOne />;
    case '321':
    case '400':
    case '420':
    case '421':
    case '422':
    case '425':
    case '627':
      return <TemplateOne />;
    case '439':
    case '449':
    case '459':
      return <TemplateOne />;
    case '481':
    case '482':
    case '483':
    case '484':
      return <TemplateOne />;
    case '600':
    case '601':
      return <TemplateOne />;
    case '603':
    case '613':
      return <TemplateOne />;
    case '655':
    case '817':
      return <TemplateOne />;
    case '680':
    case '681':
    case '682':
      return <TemplateOne />;
    case '801':
    case '802':
    case '803':
    case '804':
    case '809':
    case '820':
      return <TemplateOne />;
    default:
      return null;
  }
};

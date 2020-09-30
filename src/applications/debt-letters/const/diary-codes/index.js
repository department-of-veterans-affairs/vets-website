import React from 'react';

export const diaryCodes = Object.freeze({
  '71': 'Pending Veteran deployment verification',
  '109': 'Pending payment',
  '117': 'Pending payment',
  '123': 'Pending payment',
  '212': 'Pending Veteran address',
  '450': 'Pending automatic benefit offset',
  '811': 'Compromise offer is being reviewed',
  '815': 'Compromise offer accepted, pending payment',
  '816': 'Compromise offer payment received',
  '821':
    'Your notice of disagreement/reconsideration request is being reviewed',
  '822': 'Your dispute is being reviewed',
  '825': 'Your waiver/hearing request is being reviewed',
  '430': 'Pending automatic benefit offset',
  '431': 'Pending automatic benefit offset',
  '002': 'Pending review by the VA',
  '005': 'Pending review by the VA',
  '032': 'Pending review by the VA',
  '609': 'Pending review by the VA',
  '061': 'Debt collection suspended',
  '065': 'Debt collection suspended',
  '070': 'Debt collection suspended',
  '440': 'Debt collection suspended',
  '442': 'Debt collection suspended',
  '448': 'Debt collection suspended',
  '453': 'Debt collection suspended',
  '080': 'Referred to the Department of the Treasury',
  '850': 'Referred to the Department of the Treasury',
  '852': 'Referred to the Department of the Treasury',
  '860': 'Referred to the Department of the Treasury',
  '855': 'Referred to the Department of the Treasury',
  '081': 'Debt is pending referral to the Department of the Treasury',
  '500': 'Debt is pending referral to the Department of the Treasury',
  '510': 'Debt is pending referral to the Department of the Treasury',
  '503': 'Debt is pending referral to the Department of the Treasury',
  '100': 'Pending payment',
  '102': 'Pending payment',
  '130': 'Pending payment',
  '140': 'Pending payment',
  '101': 'Pending automatic benefit offset',
  '602': 'Pending automatic benefit offset',
  '607': 'Pending automatic benefit offset',
  '608': 'Pending automatic benefit offset',
  '610': 'Pending automatic benefit offset',
  '611': 'Pending automatic benefit offset',
  '614': 'Pending automatic benefit offset',
  '615': 'Pending automatic benefit offset',
  '617': 'Pending automatic benefit offset',
  '321': 'Pending review by the VA',
  '400': 'Pending review by the VA',
  '420': 'Pending review by the VA',
  '421': 'Pending review by the VA',
  '422': 'Pending review by the VA',
  '425': 'Pending review by the VA',
  '627': 'Pending review by the VA',
  '439': 'Debt suspension expired, awaiting payment',
  '449': 'Debt suspension expired, awaiting payment',
  '459': 'Debt suspension expired, awaiting payment',
  '481': 'Pending review by the VA',
  '482': 'Pending review by the VA',
  '483': 'Pending review by the VA',
  '484': 'Pending review by the VA',
  '600': 'Pending payment',
  '601': 'Pending payment',
  '603': 'Payment overdue',
  '613': 'Payment overdue',
  '655': 'Pending financial status report',
  '817': 'Pending financial status report',
  '680': 'Pending payment',
  '681': 'Pending payment',
  '682': 'Pending payment',
  '801': 'Your waiver request is being reviewed',
  '802': 'Your waiver request is being reviewed',
  '803': 'Your waiver request is being reviewed',
  '804': 'Your waiver request is being reviewed',
  '809': 'Your waiver request is being reviewed',
  '820': 'Your waiver request is being reviewed',
});

export const renderAdditionalInfo = diaryCode => {
  switch (diaryCode) {
    case '71':
      return <div>Content</div>;
    case '109':
      return <div>Content</div>;
    case '117':
      return <div>Content</div>;
    case '123':
      return <div>Content</div>;
    case '212':
      return <div>Content</div>;
    case '450':
      return <div>Content</div>;
    case '811':
      return <div>Content</div>;
    case '815':
      return <div>Content</div>;
    case '816':
      return <div>Content</div>;
    case '821':
      return <div>Content</div>;
    case '822':
      return <div>Content</div>;
    case '825':
      return <div>Content</div>;
    case '430':
    case '431':
      return <div>Content</div>;
    case '002':
    case '005':
    case '032':
    case '609':
      return <div>Content</div>;
    case '061':
    case '065':
    case '070':
    case '440':
    case '442':
    case '448':
    case '453':
      return <div>Content</div>;
    case '080':
    case '850':
    case '852':
    case '860':
    case '855':
      return <div>Content</div>;
    case '081':
    case '500':
    case '510':
    case '503':
      return <div>Content</div>;
    case '100':
    case '102':
    case '130':
    case '140':
      return <div>Content</div>;
    case '101':
    case '602':
    case '607':
    case '608':
    case '610':
    case '611':
    case '614':
    case '615':
    case '617':
      return <div>Content</div>;
    case '321':
    case '400':
    case '420':
    case '421':
    case '422':
    case '425':
    case '627':
      return <div>Content</div>;
    case '439':
    case '449':
    case '459':
      return <div>Content</div>;
    case '481':
    case '482':
    case '483':
    case '484':
      return <div>Content</div>;
    case '600':
    case '601':
      return <div>Content</div>;
    case '603':
    case '613':
      return <div>Content</div>;
    case '655':
    case '817':
      return <div>Content</div>;
    case '680':
    case '681':
    case '682':
      return <div>Content</div>;
    case '801':
    case '802':
    case '803':
    case '804':
    case '809':
    case '820':
      return <div>Content</div>;
    default:
      return null;
  }
};

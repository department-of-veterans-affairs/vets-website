/**
 * Maps diary codes to status types for debt processing
 * Figma Mock:
 * https://www.figma.com/design/OiiDTTVTCf8j0GngRg0xxD/VA-Debt-Portal?node-id=10527-16565&t=BcrIGkQHNAsON5Hs-0
 *
 * Status types by Category:
 * 1: Account is being updated
 * 2: Being sent to Treasury soon
 * 3: Benefits Offset
 * 4: Collections are paused
 * 5: Under review
 * 6: Make a Compromise offer payment
 * 7: Make a monthly payment
 * 8: Make a payment
 * 9: Sent to Treasury
 * 10: Verify status
 * 11: Address needed
 * 12: FSR needs to be submitted
 */

export const DIARY_CODE_STATUS_TYPE = {
  '002': '1',
  '005': '1',
  '032': '1',
  '321': '1',
  '400': '1',
  '420': '1',
  '421': '1',
  '422': '1',
  '481': '1',
  '482': '1',
  '483': '1',
  '484': '1',
  '609': '1',
  '627': '1',
  '816': '1',

  '081': '2',
  '500': '2',
  '503': '2',
  '510': '2',

  '101': '3',
  '430': '3',
  '431': '3',
  '450': '3',
  '602': '3',
  '607': '3',
  '608': '3',
  '610': '3',
  '611': '3',
  '614': '3',
  '615': '3',
  '617': '3',

  '061': '4',
  '065': '4',
  '070': '4',
  '440': '4',
  '442': '4',
  '448': '4',
  '453': '4',

  '801': '5',
  '802': '5',
  '803': '5',
  '804': '5',
  '809': '5',
  '811': '5',
  '820': '5',
  '821': '5',
  '822': '5',
  '825': '5',

  '815': '6',

  '600': '7',
  '601': '7',

  '100': '8',
  '102': '8',
  '109': '8',
  '117': '8',
  '123': '8',
  '130': '8',
  '140': '8',
  '439': '8',
  '449': '8',
  '459': '8',
  '603': '8',
  '613': '8',
  '680': '8',

  '080': '9',
  '681': '9',
  '682': '9',
  '850': '9',
  '852': '9',
  '855': '9',
  '860': '9',

  '71': '10',

  '212': '11',

  '655': '12',
  '817': '12',
};

export const getStatusTypeForDebtDiaryCode = diaryCode => {
  return DIARY_CODE_STATUS_TYPE[diaryCode] || 'default';
};

import { handleAlertMaxItems } from '../../../../components/FormAlerts';

export const options = {
  arrayPath: 'spouseMarriages',
  nounSingular: 'previous marriage',
  nounPlural: 'previous marriages',
  required: false,
  minItems: 0,
  isItemIncomplete: item =>
    !item?.previousSpouseName?.first ||
    !item?.previousSpouseName?.last ||
    !item?.marriageToVeteranDate ||
    !item?.marriageLocation?.city ||
    (!item?.marriedOutsideUS && !item?.marriageLocation?.state) ||
    (item?.marriedOutsideUS && !item?.marriageLocation?.country) ||
    !item?.marriageEndReason ||
    (item?.marriageEndReason === 'OTHER' && !item?.marriageEndOtherExplanation),
  maxItems: 2,
  text: {
    cancelAddTitle: 'Cancel adding this previous marriage?',
    cancelEditTitle: 'Cancel editing this previous marriage?',
    cancelAddDescription:
      'If you cancel, we won’t add this previous marriage to your list of marriages. You’ll return to a page where you can add another previous marriage for the Veteran.',
    cancelEditDescription:
      'If you cancel, you’ll lose any changes you made to this previous marriage and you will be returned to the previous marriage review page.',
    cancelAddYes: 'Yes, cancel adding',
    cancelAddNo: 'No, continue adding',
    cancelEditYes: 'Yes, cancel editing',
    cancelEditNo: 'No, continue editing',
    deleteDescription:
      'This will delete the information from your list of previous marriages. You’ll return to a page where you can add a new previous marriage for the Veteran.',
    deleteNo: 'No, keep',
    deleteTitle: 'Delete this previous marriage?',
    deleteYes: 'Yes, delete',
    alertMaxItems: handleAlertMaxItems,
    getItemName: item => {
      const name = item?.previousSpouseName;
      if (!name?.first && !name?.last) return '';

      const parts = [];
      if (name?.first) parts.push(name.first);
      if (name?.middle) parts.push(name.middle);
      if (name?.last) parts.push(name.last);
      if (name?.suffix) parts.push(name.suffix);

      return parts.join(' ');
    },
  },
};

import { APP_TYPES, getSortedDate } from './helpers';
import { getStatusTypeForDebtDiaryCode } from '../../debt-letters/const/diary-codes/diaryCodeStatusTypes';
import { STATUS_TYPE_CONFIG } from '../../debt-letters/const/statusTypeConfig';
import { PHONE_REGISTRY } from '../../debt-letters/const/phoneRegistry';
import { endDate } from '../../debt-letters/utils/helpers';
import { deductionCodes } from '../../debt-letters/const/deduction-codes';
import { currency } from '../../debt-letters/utils/page';
import { ACTION_TYPE_MAP } from '../../debt-letters/const/actionTypeMap';

/**
 * Transforms debt data to a standardized formats
 */
export const transformDebtData = debt => {
  return {
    id: debt.compositeDebtId,
    type: APP_TYPES.DEBT,
    header: deductionCodes[debt.deductionCode] || debt.benefitType, // maybe adjust for summary card since header will come from debt always
    amount: currency.format(parseFloat(debt.currentAr)),
    dateOfLetter: getSortedDate(debt),
    diaryCode: debt.diaryCode,
  };
};

/**
 * Transforms copay data to a standardized format
 */
export const transformCopayData = copay => {
  // Needs more tweaking due to showVHAPayment history flag
  return {
    id: copay.id,
    type: APP_TYPES.COPAY,
    header: `${copay.faciltyName} - ${copay.city}`,
    amount: copay.pharmacyBalance || copay.vistaBalance,
    dateOfLetter: copay.dateOfLetter,
    diaryCode: null, // Copays don't have diary codes
    stationId: copay.stationId,
  };
};

/**
 * Gets the status type for a debt based on diary code
 * Must refine for copays. Maybe based on balance status?
 */
const getStatusType = (type, diaryCode) =>
  type === APP_TYPES.DEBT
    ? getStatusTypeForDebtDiaryCode(diaryCode)
    : 'default'; // Add in for copays later

/**
 * Creates common content properties
 */
const getCommonContent = (data, linkView) => {
  const { type, diaryCode, dateOfLetter } = data;
  const statusType = getStatusType(type, diaryCode);
  const config = STATUS_TYPE_CONFIG[statusType];
  const linkIds = config?.linksByView?.[linkView] || config?.links || [];

  return {
    statusType,
    alertStatus: config?.alertType || 'info',
    endDateText: endDate(dateOfLetter, diaryCode),
    linkIds,
    config,
  };
};

/**
 * Centralized content helper for summary cards
 */
export const getSummaryCardContent = data => {
  const { amount } = data;
  const linkView = 'summary';
  const { statusType, alertStatus, endDateText, linkIds } = getCommonContent(
    data,
    linkView,
  );

  const messageKey = `diaryCodes.statusTypes.${statusType}.summary.body`;
  const messageValues = { endDateText, amountDue: amount };

  return {
    messageKey,
    messageValues,
    alertStatus,
    linkIds,
  };
};

/**
 * Centralized content helper for details cards
 */
export const getDetailsAlertContent = data => {
  const { amount, diaryCode } = data;
  const linkView = 'details';
  const {
    statusType,
    alertStatus,
    endDateText,
    linkIds,
    config,
  } = getCommonContent(data, linkView);

  const phoneSetId = config?.phoneSet;
  const phoneSet = phoneSetId ? PHONE_REGISTRY[phoneSetId] : null;

  const actionType = ACTION_TYPE_MAP[diaryCode];

  const headerKey = `diaryCodes.statusTypes.${statusType}.details.header`;
  const headerValues = { endDateText };

  const bodyKey = `diaryCodes.statusTypes.${statusType}.details.body`;
  const bodyValues = {
    endDateText,
    amountDue: amount,
    type: actionType,
  };

  return {
    headerKey,
    headerValues,
    bodyKey,
    bodyValues,
    alertStatus,
    linkIds,
    phoneSet,
  };
};

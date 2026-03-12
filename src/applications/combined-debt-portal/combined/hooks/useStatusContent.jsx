import { useMemo } from 'react';
import {
  getSummaryCardContent,
  getDetailsAlertContent,
  transformDebtData,
  transformCopayData,
} from '../utils/cardContentHelper';

export const useStatusContent = (type, data, view) => {
  const transformedData = useMemo(
    () =>
      type === 'debt' ? transformDebtData(data) : transformCopayData(data),
    [type, data],
  );
  const content = useMemo(
    () => {
      const getContentFn =
        view === 'summary' ? getSummaryCardContent : getDetailsAlertContent;
      return getContentFn(transformedData);
    },
    [transformedData, view],
  );
  return { transformedData, ...content };
};

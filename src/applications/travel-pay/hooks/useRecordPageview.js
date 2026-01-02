import { useEffect } from 'react';

import { recordPageview } from '../util/events-helpers';

const useRecordPageview = (variant, page) => {
  useEffect(
    () => {
      recordPageview(variant, page);
    },
    [variant, page],
  );
};

export default useRecordPageview;

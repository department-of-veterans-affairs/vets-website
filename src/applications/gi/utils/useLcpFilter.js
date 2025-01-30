import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  filterLcResults,
  fetchAndFilterLacpResults,
  fetchLicenseCertificationResults,
} from '../actions';

export const useLcpFilter = ({ flag, name, categoryValue, locationValue }) => {
  const dispatch = useDispatch();
  const { hasFetchedOnce } = useSelector(
    state => state.licenseCertificationSearch,
  );

  // initial fetch
  useEffect(() => {
    if (!hasFetchedOnce) {
      if (flag === 'singleFetch') {
        dispatch(fetchLicenseCertificationResults());
      }

      if (flag === 'serverSideFilter') {
        dispatch(fetchAndFilterLacpResults());
      }
    }
  }, []);

  // filter when dropdowns or input value changes
  useEffect(
    () => {
      if (flag === 'singleFetch') {
        dispatch(filterLcResults(name, categoryValue, locationValue));
      }

      if (flag === 'serverSideFilter') {
        dispatch(fetchAndFilterLacpResults(name, categoryValue, locationValue));
      }
    },
    [flag, name, categoryValue, locationValue],
  );
};

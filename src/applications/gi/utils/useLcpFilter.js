import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  filterLcResults,
  fetchAndFilterLacpResults,
  fetchLicenseCertificationResults,
} from '../actions';

export const useLcpFilter = ({
  flag,
  name,
  categoryValues,
  locationValue = 'all',
}) => {
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

  // filter when filters or input value changes
  useEffect(
    () => {
      if (flag === 'singleFetch') {
        dispatch(filterLcResults(name, categoryValues, locationValue));
      }

      if (flag === 'serverSideFilter') {
        dispatch(
          fetchAndFilterLacpResults(name, categoryValues, locationValue),
        );
      }
    },
    [flag, name, categoryValues, locationValue],
  );
};

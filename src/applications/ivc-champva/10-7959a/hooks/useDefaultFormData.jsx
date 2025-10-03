import { useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { FEATURE_TOGGLES } from '../utils/constants';

export const useDefaultFormData = () => {
  const dispatch = useDispatch();

  const toggles = useSelector(state => state.featureToggles, shallowEqual);
  const formData = useSelector(state => state.form.data, shallowEqual);
  const loading = !!toggles?.loading;

  const toggleViewFields = useMemo(
    () => {
      if (loading) return {};
      return Object.fromEntries(
        FEATURE_TOGGLES.map(key => [`view:${key}`, !!toggles[key]]),
      );
    },
    [loading, toggles],
  );

  useEffect(
    () => {
      if (loading) return;

      const updates = Object.entries(toggleViewFields).reduce((acc, [k, v]) => {
        if (formData[k] !== v) acc[k] = v;
        return acc;
      }, {});

      if (Object.keys(updates).length > 0) {
        dispatch(setData({ ...formData, ...updates }));
      }
    },
    [dispatch, formData, loading, toggleViewFields],
  );
};

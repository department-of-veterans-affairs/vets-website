import { useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';

// declare list of feature toggles for this app
export const FEATURE_TOGGLES = ['champvaForm107959cRev2025'];

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

  const toggleValues = useMemo(
    () => {
      if (loading) return {};
      return Object.fromEntries(
        Object.entries(toggleViewFields).filter(([k, v]) => formData[k] !== v),
      );
    },
    [formData, loading, toggleViewFields],
  );

  useEffect(
    () => {
      if (loading) return;
      if (Object.keys(toggleValues).length > 0) {
        dispatch(setData({ ...formData, ...toggleValues }));
      }
    },
    [dispatch, formData, loading, toggleValues],
  );
};

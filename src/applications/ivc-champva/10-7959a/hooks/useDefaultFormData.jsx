import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';

// declare list of feature toggles for this app
const FEATURE_TOGGLES = [
  'champvaEnableClaimResubmitQuestion',
  'champvaClaimsLlmValidation',
];

export const useDefaultFormData = () => {
  const toggles = useSelector(state => state.featureToggles);
  const formData = useSelector(state => state.form.data);
  const dispatch = useDispatch();

  const toggleViewFields = useMemo(
    () =>
      Object.fromEntries(
        FEATURE_TOGGLES.map(key => [`view:${key}`, !!toggles[key]]),
      ),
    [toggles],
  );

  useEffect(
    () => {
      const toAdd = Object.entries(toggleViewFields).reduce((acc, [k, v]) => {
        if (formData[k] === undefined) acc[k] = v;
        return acc;
      }, {});

      if (Object.keys(toAdd).length > 0) {
        dispatch(setData({ ...formData, ...toAdd }));
      }
    },
    [dispatch, formData, toggleViewFields],
  );
};

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { isLoggedIn } from 'platform/user/selectors';

/**
 * Hook to ensure login state is always available in formData
 * This allows hideIf functions in uiSchema to access isLoggedIn
 *
 * The prefill-transformer only runs when loading saved forms or fetching prefill data,
 * so this hook ensures isLoggedIn is set even when starting a new form directly.
 */

export const useDefaultFormData = () => {
  const { data: formData } = useSelector(state => state.form);
  const userLoggedIn = useSelector(isLoggedIn);
  const dispatch = useDispatch();

  const setFormData = data => dispatch(setData(data));

  useEffect(
    () => {
      if (formData?.isLoggedIn !== userLoggedIn) {
        setFormData({
          ...formData,
          isLoggedIn: userLoggedIn,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userLoggedIn],
  );
};

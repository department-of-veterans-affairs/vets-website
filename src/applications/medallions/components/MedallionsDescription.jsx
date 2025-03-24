import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';

export const MedallionsDescription = (formContext, description = '') => {
  const dispatch = useDispatch();
  const { isLoggedIn } = formContext.formContext;

  useEffect(
    () => {
      if (formContext.formData.isLoggedIn !== isLoggedIn) {
        dispatch(
          setData({
            ...formContext.formData,
            isLoggedIn,
          }),
        );
      }
      // Only run the effect when these things change
    },
    [dispatch, formContext.formData, isLoggedIn],
  );

  return description;
};

import { useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';

export const MedallionsDescription = (formContext, description = '') => {
  const dispatch = useDispatch();
  const { isLoggedIn } = formContext.formContext;
  const updatedFormData = {
    ...formContext.formData,
    isLoggedIn,
  };

  dispatch(setData(updatedFormData));
  return description;
};

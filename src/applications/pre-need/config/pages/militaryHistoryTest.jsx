import { useSelector } from 'react-redux';
import { isVeteran } from '../../utils/helpers';

export function GetTestTitle() {
  const data = useSelector(state => state.form.data || {});
  return isVeteran(data) ? 'This works VET' : 'This works NOVET';
}

export const getTestTitleGetter = {
  GetTestTitle,
};

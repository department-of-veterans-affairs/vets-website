import { useSelector } from 'react-redux';
import { isVeteran } from '../../utils/helpers';

export function GetTestTitle() {
  const data = useSelector(state => state.form.data || {});
  if (isVeteran(data)) {
    return 'This works VET';
  }
  return 'This works NOVET';
}

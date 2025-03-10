import { useLocation } from 'react-router-dom';
import { Breadcrumbs, Paths } from '../util/constants';

const usePageLocationName = () => {
  const location = useLocation();
  const pathElements = location.pathname.split('/');

  if (pathElements[0] === '') pathElements.shift();

  // Find the key in Paths that matches pathElements[0]
  const matchingKey = Object.keys(Paths).find(
    key => Paths[key] === `/${pathElements[0]}/`,
  );

  if (matchingKey === 'FOLDERS') {
    if (pathElements[1]?.trim()) {
      return 'Folders - custom';
    }
    return 'Folders';
  }

  if (matchingKey === 'COMPOSE') {
    return 'New message';
  }

  if (matchingKey === 'MESSAGE_THREAD') {
    return 'Thread';
  }

  // Get the corresponding label from Breadcrumbs
  return matchingKey ? Breadcrumbs[matchingKey]?.label : null;
};

export default usePageLocationName;

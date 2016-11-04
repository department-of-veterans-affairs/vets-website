import { createHistory } from 'history';
import { useRouterHistory } from 'react-router';

export default useRouterHistory(createHistory)({
  basename: '/healthcare/messaging'
});

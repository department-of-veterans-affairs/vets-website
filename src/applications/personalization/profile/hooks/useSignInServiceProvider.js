import { useSelector } from 'react-redux';
import { signInServiceName as signInServiceNameSelector } from '~/platform/user/authentication/selectors';
import { SERVICE_PROVIDERS } from '~/platform/user/authentication/constants';

export const useSignInServiceProvider = () => {
  const signInServiceName = useSelector(signInServiceNameSelector);

  const { link, label } = SERVICE_PROVIDERS[signInServiceName];
  return { signInServiceName, link, label };
};

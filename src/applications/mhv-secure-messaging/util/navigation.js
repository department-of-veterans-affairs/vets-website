import { useNavigate } from 'react-router-dom-v5-compat';

/**
 * Custom navigation hook that wraps useNavigate
 */
export const useAppNavigate = () => {
  const navigate = useNavigate();

  return (to, options) => navigate(to, options);
};

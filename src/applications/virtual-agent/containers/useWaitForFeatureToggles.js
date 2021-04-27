import { useSelector } from 'react-redux';

export default function useWaitForFeatureToggles() {
  const loading = useSelector(state => state.featureToggles.loading);

  return { loading };
}

/* eslint-disable no-console */
import useEffectOnce from './useEffectOnce';
import useUpdateEffect from './useUpdateEffect';

const useLogger = (componentName, ...rest) => {
  useEffectOnce(() => {
    console.log(`${componentName} mounted`, ...rest);
    return () => console.log(`${componentName} unmounted`);
  });

  useUpdateEffect(() => {
    console.log(`${componentName} updated`, ...rest);
  });
};

export default useLogger;

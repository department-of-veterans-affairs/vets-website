import { useEffect } from 'react';

export const useSetVetTecToggle = showVetTecToggle => {
  useEffect(
    () => {
      sessionStorage.setItem(
        'showVecTecToggle',
        JSON.stringify(showVetTecToggle),
      );
    },
    [showVetTecToggle],
  );
};

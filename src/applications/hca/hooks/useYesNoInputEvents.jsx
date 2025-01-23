import { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';

export const useYesNoInputEvents = (loading, location) => {
  const handleClick = ({ target: element }) => {
    const label = element.nextElementSibling.innerText;
    recordEvent({
      event: 'hca-yesno-option-click',
      'hca-radio-label': label,
      'hca-radio-clicked': element,
      'hca-radio-value-selected': element.value,
    });
  };

  useEffect(
    () => {
      if (loading) return false;

      const radios = document.querySelectorAll('input[id$=Yes], input[id$=No]');
      const modifyEventListeners = action => {
        for (const radio of radios) {
          radio[action]('click', handleClick);
        }
      };

      modifyEventListeners('addEventListener');
      return () => modifyEventListeners('removeEventListener');
    },
    [loading, location],
  );
};

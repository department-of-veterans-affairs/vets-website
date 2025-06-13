import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export const Portal = ({
  children,
  element = 'div',
  prepend = true,
  target = document.body,
}) => {
  const [container] = useState(() => {
    return document.createElement(element);
  });

  React.useEffect(
    () => {
      if (target) {
        if (prepend) {
          target.prepend(container);
        } else {
          target.appendChild(container);
        }
      }
      return () => {
        if (target) {
          target.removeChild(container);
        }
      };
    },
    [container, prepend, target],
  );

  return createPortal(children, container);
};

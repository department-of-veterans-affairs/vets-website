import React from 'react';
import PropTypes from 'prop-types';

import { $, $$ } from '../utilities/ui';
import { FOCUSABLE_ELEMENTS } from '../../../../utilities/constants';
import { focusableWebComponentList } from '../web-component-fields/webComponentList';

const ErrorList = props => {
  // console.log('ErrorList props', props);
  const { errors } = props;
  const headerText =
    errors.length > 1
      ? `There are ${errors.length} errors:`
      : 'There is an error:';
  const main = $('#main');
  const formFocusable = FOCUSABLE_ELEMENTS.join(',');
  const allFocusable = [
    ...focusableWebComponentList,
    ...FOCUSABLE_ELEMENTS,
  ].join(',');

  const onClick = target => {
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
      window.scrollBy({ left: 0, top: -100, behavior: 'smooth' });
    }, 100);
  };

  return (
    <va-alert status="error" id="error-summary">
      <h3 slot="headline">{headerText}</h3>
      <ul className="list-group">
        {errors.map((error, i) => {
          const id = error.fieldPath.join('_');
          const target = $$(allFocusable, main).filter(
            el => el.getAttribute('name') === id,
          )?.[0];
          const href = target?.tagName.startsWith('VA-')
            ? $(formFocusable, target)?.id || id
            : id;
          console.log({ href, id, target, wc: $('[id]', target.shadowRoot) })
          return (
            <li key={i}>
              <a href={`#${href}`} onClick={() => onClick(target)}>
                {error.error}
              </a>
            </li>
          );
        })}
      </ul>
    </va-alert>
  );
};

ErrorList.propTypes = {
  errors: PropTypes.array,
};

export default ErrorList;

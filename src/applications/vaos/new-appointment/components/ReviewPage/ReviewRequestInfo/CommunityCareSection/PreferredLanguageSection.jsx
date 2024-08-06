import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { LANGUAGES } from '../../../../../utils/constants';
import getNewAppointmentFlow from '../../../../newAppointmentFlow';

function handleClick(history, home, ccLanguage) {
  return e => {
    // Stop default behavior for anchor tag since we are using React routing.
    e.preventDefault();

    if (
      history.location.pathname.endsWith('/') ||
      (ccLanguage.url.endsWith('/') && ccLanguage.url !== home.url)
    )
      history.push(`../${ccLanguage.url}`);
    else history.push(ccLanguage.url);
  };
}

export default function PreferredLanguageSection({ data }) {
  const history = useHistory();
  const { home, root, ccLanguage } = useSelector(getNewAppointmentFlow);

  return (
    <div className="vads-l-grid-container vads-u-padding--0">
      <div className="vads-l-row vads-u-justify-content--space-between">
        <div className="vads-u-flex--1 vads-u-padding-right--1">
          <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
            Language you’d prefer the provider speak
          </h2>
          {
            LANGUAGES.find(language => language.id === data.preferredLanguage)
              ?.value
          }
        </div>
        <div>
          <va-link
            href={`${root.url}/schedule/community-request/${ccLanguage.url}`}
            onClick={handleClick(history, home, ccLanguage)}
            aria-label="Edit preferred language"
            text="Edit"
            data-testid="edit-preferred-language"
          />
        </div>
      </div>
    </div>
  );
}
PreferredLanguageSection.propTypes = {
  data: PropTypes.object.isRequired,
};

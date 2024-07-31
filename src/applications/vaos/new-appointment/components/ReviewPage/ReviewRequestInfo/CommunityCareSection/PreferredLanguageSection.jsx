import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { LANGUAGES } from '../../../../../utils/constants';
import getNewAppointmentFlow from '../../../../newAppointmentFlow';

function handleClick(history, pageFlow) {
  const { home, ccPreferences } = pageFlow;

  return () => {
    if (
      history.location.pathname.endsWith('/') ||
      (ccPreferences.url.endsWith('/') && ccPreferences.url !== home.url)
    )
      history.push(`../${ccPreferences.url}`);
    else history.push(ccPreferences.url);
  };
}

export default function PreferredLanguageSection({ data }) {
  const history = useHistory();
  const pageFlow = useSelector(getNewAppointmentFlow);

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
            onClick={handleClick(history, pageFlow)}
            aria-label="Edit prefered language"
            text="Edit"
            data-testid="edit-preferred-language"
            role="link"
          />
        </div>
      </div>
    </div>
  );
}
PreferredLanguageSection.propTypes = {
  data: PropTypes.object.isRequired,
};

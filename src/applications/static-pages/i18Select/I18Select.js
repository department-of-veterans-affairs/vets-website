import React, { useState } from 'react';
import Select from '@department-of-veterans-affairs/component-library/Select';

const langsToLinkSuffixes = {
  Spanish: '-esp',
  Tagalog: '-tagalog',
};

const langAttributesToLangs = {
  es: 'Spanish',
  tg: 'Tagalog',
  en: 'English',
};

const faqI18Content = {
  en: {
    dropDownLabel: 'Read this page in: ',
  },
  es: {
    dropDownLabel: 'Leer esta página en: ',
    onThisPage: 'En esta página',
  },
};

const I18Select = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const langAttribute = document
    ?.getElementById('content')
    ?.getAttribute('lang');
  const currentLang = langAttributesToLangs[langAttribute];

  return (
    // TODO: remove inline styles, with a hook if possible
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Select
        label={
          <div>
            <i
              aria-hidden="true"
              className="fas fa-globe vads-u-color--primary vads-u-margin-right--0p5"
            />
            <span>{faqI18Content[langAttribute].dropDownLabel} </span>
          </div>
        }
        name="branch"
        onKeyDown={function noRefCheck() {}}
        onValueChange={event => {
          setSelectedValue(event.value);
          // oh man, I made a classic mistake from Edward Said's Orientalism, I made something
          // different into an "other" lol
          // i hope that would have been caught in a code review: https://www.jstor.org/stable/42981698?seq=1
          const otherLanguage = Object.values(langsToLinkSuffixes).filter(
            lang => {
              if (window.location.href.includes(lang)) {
                return lang;
              }
              return null;
            },
          )[0];
          const url = window.location.href;
          if (otherLanguage) {
            const newUrl = url.replace(
              otherLanguage,
              langsToLinkSuffixes[event.value],
            );
            window.location.href = newUrl;
          } else {
            const currentUrl = window.location.href;
            const indexToReplace = window.location.href.lastIndexOf('/');
            const newUrl =
              currentUrl.substring(0, indexToReplace) +
              langsToLinkSuffixes[event.value];
            window.location.href = newUrl;
          }
        }}
        options={['Spanish', 'Tagalog']}
        value={{
          dirty: false,
          value: currentLang || selectedValue,
        }}
      />
    </div>
  );
};

export default I18Select;

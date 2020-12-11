import { useCallback, useState } from 'react';

// temporary localhost key. will need to get real key from CredStash or ??
const SITE_KEY = '6Lcbbf0ZAAAAABAWyrsMSyTd1RRAM71rrk350SLa';

export default function useRecaptcha() {
  const [recaptchaState, setRecaptchaState] = useState(false);

  const setUpRecaptcha = useCallback(
    () => {
      const loadScriptByURL = (id, url, callback) => {
        const isScriptExist = document.getElementById(id);

        if (!isScriptExist) {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = url;
          script.id = id;
          script.onload = function() {
            if (callback) callback();
          };
          document.body.appendChild(script);
        }

        if (isScriptExist && callback) callback();
      };

      if (!recaptchaState) {
        // load the script by passing the URL
        loadScriptByURL(
          'va-recaptcha-key',
          `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`,
          function() {
            setRecaptchaState(true);
          },
        );
      }
    },
    [recaptchaState],
  );

  const executeRecaptcha = callback => {
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(SITE_KEY, { action: 'submit' }).then(token => {
        if (callback) callback(token);
      });
    });
  };

  return [setUpRecaptcha, executeRecaptcha];
}

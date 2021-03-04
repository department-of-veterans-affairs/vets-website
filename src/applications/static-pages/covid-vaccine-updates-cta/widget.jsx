import React from 'react';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { connect } from 'react-redux';
import OnState from './On';
import OffState from './Off';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

// TODO: follow on PR will introduce react-18-next, this is to get the word out stat
const copy = {
  en: {
    appTitle: 'Covid 19 Vaccination Information',
    cta: `Sign up for an easy way to stay informed about getting a COVID-19
      vaccine at VA.`,
    body: `   When you sign up, we’ll also ask about your vaccine plans. Your
      local VA health facility may use this information to determine
      when to contact you once your risk group becomes eligible.`,
    boldedNote: `Note:`,
    note: `We’ll contact every eligible Veteran in
      each risk group. You don't need to sign up to get a vaccine`,
    headline: 'Stay informed about getting a COVID-19 vaccine',
    buttonText: 'Sign up to stay informed',
  },
  es: {
    appTitle: `Información de vacunación contra Covid 19`,
    buttonText: `Regístrese para mantenerse informado (en inglés)`,
    headline:
      'Manténgase informado sobre cómo recibir la vacuna contra COVID-19',
    cta:
      'Inscríbase para una manera fácil de mantenerse informado sobre cómo recibir la vacuna contra COVID-19 en el VA.',
    body:
      'Cuando se inscriba, también le preguntaremos acerca de sus planes de vacunas. Su centro de salud del VA local puede usar esta información para determinar cuándo contactarle una vez que su grupo de riesgo sea elegible. Por favor, tenga presente que estas actualizaciones solo están disponibles en inglés en este momento.',
    boldedNote: 'Nota: ',
    note:
      'Intentaremos contactar a todos los Veteranos elegibles en cada grupo de riesgo. No es necesario que se inscriba para recibir la vacuna.',
  },
  tag: {
    headline: `Manatiling nakikibalita tungkol sa pagpapabakuna para sa COVID-19`,
    cta: `Mag-sign up para sa madaling paraan ng pakikibalita tungkol sa pagpapabakuna para sa COVID-19 sa VA.`,
    body: `Kapag nag-sign-up kayo, magtatanong din kami tungkol sa inyong mga plano sa bakuna. Maaaring gamitin ng inyong lokal na pasilidad-pangkalusugan ng VA ang impormasyong ito para matukoy kung kailan makikipag-ugnayan sa inyo kapag naging kwalipikado na ang inyong pangkat ng panganib (risk group). Pakitandaan na ang mga update na ito ay nasa English lang sa ngayon.`,
    boldedNote: 'Paalala:',
    note: `Susubukan naming makipag-ugnayan sa bawat-isang kwalipikadong Beterano sa bawat pangkat ng panganib. Hindi ninyo kailangang mag-sign up para makapagpabakuna.`,
    buttonText: `Mag-sign up para manatiling nakikibalita (sa English)`,
  },
};
function CovidVaccineUpdatesCTA({ lang, showLinkToOnlineForm }) {
  if (showLinkToOnlineForm) {
    return <OnState copy={copy[lang]} />;
  }

  if (showLinkToOnlineForm === false) {
    return <OffState copy={copy[lang]} />;
  }

  return <LoadingIndicator message="Loading..." />;
}

const mapStateToProps = store => ({
  showLinkToOnlineForm: toggleValues(store)[
    FEATURE_FLAG_NAMES.covidVaccineUpdatesCTA
  ],
});

export default connect(mapStateToProps)(CovidVaccineUpdatesCTA);

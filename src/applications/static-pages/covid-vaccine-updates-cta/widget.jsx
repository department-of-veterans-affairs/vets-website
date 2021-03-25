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
    expandedEligibilityContent: {
      veteran: {
        boldedNote: `If you're a Veteran currently receiving care through VA,`,
        body: ` we'll ask about your vaccine plans when you sign up. Your local VA health facility may use this information to determine when to contact you once your risk group becomes eligible.`,
      },
      nonVeteran: {
        boldedNote: `If you're a Veteran, spouse, or caregiver not receiving care through VA,`,
        body: ` sign up to tell us if you want to get a vaccine through VA. If you're eligible, we'll contact you when we have a vaccine available for you. At this time, we don't know when that will be.`,
      },
    },
    headline: 'Stay informed about getting a COVID-19 vaccine',
    buttonText: 'Sign up to stay informed',
  },
  es: {
    appTitle: `Información de vacunación contra Covid 19`,
    buttonText: `Regístrese para mantenerse informado (en inglés)`,
    headline:
      'Manténgase informado sobre cómo recibir la vacuna contra COVID-19',
    cta:
      'Inscríbase para una manera fácil de mantenerse informado sobre cómo recibir la vacuna contra COVID-19 en él VA.',
    expandedEligibilityContent: {
      veteran: {
        boldedNote: `Si usted es un Veterano que actualmente recibe atención a través de VA,`,
        body: ` le preguntaremos sobre sus planes de vacunación cuando se inscriba. Su centro de salud local de VA puede utilizar esta información para determinar cuándo ponerse en contacto con usted una vez que su grupo de riesgo sea elegible.`,
      },
      nonVeteran: {
        boldedNote: `Si usted es un Veterano, cónyuge o cuidador que no recibe atención a través de VA,`,
        body: ` inscríbase para indicarnos si desea vacunarse a través del VA. Si es elegible, nos pondremos en contacto con usted cuando tengamos una vacuna disponible. En este momento, no sabemos cuándo ocurrirá eso.`,
      },
    },
  },
  tag: {
    headline: `Manatiling nakikibalita tungkol sa pagpapabakuna para sa COVID-19`,
    cta: `Mag-sign up para sa madaling paraan ng pakikibalita tungkol sa pagpapabakuna para sa COVID-19 sa VA.`,
    expandedEligibilityContent: {
      veteran: {
        boldedNote: `Kung kayo ay isang Beterano na kasalukuyang tumatanggap ng pag-aaruga sa pamamagitan ng VA,`,
        body: ` tatanungin namin kayo kung ano ang inyong plano patungkol sa bakuna kapag nagparehistro kayo. Maaaring gamitin ng inyong lokal na pasilidad-pangkalusugan ng VA ang impormasyong ito, para matukoy kung kailan makikipag-ugnayan sa inyo kapag karapat-dapat na ang inyong pangkat ayon sa panganib.`,
      },
      nonVeteran: {
        boldedNote: `Kung kayo naman ay isang Beterano, asawa o tagapag-alaga na hindi tumatanggap ng pag-aaruga sa VA, `,
        body: ` magparehistro para malaman kung nais ninyong magpabakuna sa VA. Kung karapat-dapat, makikipag-ugnayan kami sa inyo kapag may bakuna na para sa inyo. Sa ngayon, hindi pa namin alam kung kailan ito.`,
      },
    },
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

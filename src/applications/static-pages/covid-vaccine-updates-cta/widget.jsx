import React from 'react';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { connect } from 'react-redux';
import OnState from './On';
import OffState from './Off';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

const copy = {
  en: {
    appTitle: 'Covid 19 Vaccination Information',
    expandedEligibilityContent: {
      veteran: {
        boldedNote: `Enrolled in VA health care or currently receiving care through VA?`,
        body: ` Sign up to tell us if you plan to get a COVID-19 vaccine. Your local VA health facility may use this information to determine when to contact you.`,
      },
      nonVeteran: {
        boldedNote: `Not enrolled, but need a COVID-19 vaccine?`,
        body: ` Sign up to tell us if you want to get a vaccine at VA. If you’re a Veteran, spouse, caregiver, or CHAMPVA recipient, we'll contact you when we have a vaccine for you. At this time, we don't know when that will be.`,
      },
    },
    headline: 'Sign up to get a COVID-19 vaccine at VA',
    buttonText: 'Sign up to get a COVID-19 vaccine',
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
  tl: {
    appTitle: 'Covid 19 Vaccination Information',
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

import React, { Fragment } from 'react';
import { BATCHES } from './question-batches';

export const accordions = {
  [BATCHES.BURN_PITS]: [
    {
      title: 'New PACT Act presumptive conditions for burn pit exposure',
      content: (
        <Fragment key={`${BATCHES.BURN_PITS}-1`}>
          <p>
            We’ve added more than 20 burn pit and other toxic exposure
            presumptive conditions based on the PACT Act. This change expands
            benefits for Gulf War era and post-9/11 Veterans.
          </p>
          <p>
            <strong>These cancers are now presumptive:</strong>
          </p>
          <ul>
            <li>Brain cancer</li>
            <li>Gastrointestinal cancer of any type</li>
            <li>Glioblastoma</li>
            <li>Head cancer of any type</li>
            <li>Kidney cancer</li>
            <li>Lymphoma of any type</li>
            <li>Melanoma</li>
            <li>Neck cancer of any type</li>
            <li>Pancreatic cancer</li>
            <li>Reproductive cancer of any type</li>
            <li>Respiratory (breathing-related) cancer of any type</li>
          </ul>
          <a
            className="vads-u-margin-top--3 vads-u-margin-bottom--3 vads-u-display--block"
            href="/resources/presumptive-cancers-related-to-burn-pit-exposure"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more about presumptive cancers related to burn pits (opens in
            a new tab)
          </a>
          <p>
            <strong>These illnesses are now presumptive:</strong>
          </p>
          <ul>
            <li>Asthma that was diagnosed after service</li>
            <li>Chronic bronchitis</li>
            <li>Chronic obstructive pulmonary disease (COPD)</li>
            <li>Chronic rhinitis</li>
            <li>Chronic sinusitis</li>
            <li>Constrictive bronchiolitis or obliterative bronchiolitis</li>
            <li>Emphysema</li>
            <li>Granulomatous disease</li>
            <li>Interstitial lung disease (ILD)</li>
            <li>Pleuritis</li>
            <li>Pulmonary fibrosis</li>
            <li>Sarcoidosis</li>
          </ul>
        </Fragment>
      ),
    },
    {
      title: 'Other Gulf War illnesses presumptive conditions',
      content: (
        <Fragment key={`${BATCHES.BURN_PITS}-2`}>
          <p>
            We presume that these conditions are caused by military service in
            Iraq, Afghanistan, and certain other locations during certain time
            periods:
          </p>
          <ul>
            <li>
              Undiagnosed illnesses (like chronic fatigue syndrome,
              fibromyalgia, and medically unexplained chronic multisymptom
              illness)
            </li>
            <li>
              Infectious diseases (like brucellosis, malaria, and West Nile
              virus)
            </li>
          </ul>
          <a
            href="/disability/eligibility/hazardous-materials-exposure/gulf-war-illness-afghanistan/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more about Gulf War illnesses and VA disability compensation
            (opens in a new tab)
          </a>
        </Fragment>
      ),
    },
  ],
  [BATCHES.ORANGE]: [
    {
      title: 'New PACT Act presumptive conditions for Agent Orange exposure',
      content: (
        <Fragment key={`${BATCHES.ORANGE}-1`}>
          <p>
            Based on the PACT Act, we’ve added 2 new Agent Orange presumptive
            conditions:
          </p>
          <ul>
            <li>High blood pressure (hypertension)</li>
            <li>Monoclonal gammopathy of undetermined significance (MGUS)</li>
          </ul>
        </Fragment>
      ),
    },
    {
      title: 'All presumptive conditions for Agent Orange exposure',
      content: (
        <Fragment key={`${BATCHES.ORANGE}-2`}>
          <p>We presume Agent Orange exposure causes these cancers:</p>
          <ul>
            <li>Bladder cancer</li>
            <li>Chronic B-cell leukemia</li>
            <li>High blood pressure (hypertension)</li>
            <li>Hodgkin’s disease</li>
            <li>Multiple myeloma</li>
            <li>Non-Hodgkin’s lymphoma</li>
            <li>Prostate cancer</li>
            <li>Respiratory cancers (including lung cancer)</li>
            <li>
              Some soft tissue sarcomas (<strong>Note</strong>: We don’t
              consider osteosarcoma, chondrosarcoma, Kaposi’s sarcoma, or
              mesothelioma presumptive)
            </li>
          </ul>
          <p>
            We also presume that Agent Orange exposure causes these conditions:
          </p>
          <ul>
            <li>AL amyloidosis</li>
            <li>Diabetes mellitus type 2</li>
            <li>High blood pressure (hypertension)</li>
            <li>Hypothyroidism</li>
            <li>Ischemic heart disease</li>
            <li>Monoclonal gammopathy of undetermined significance (MGUS)</li>
            <li>Parkinsonism</li>
            <li>Parkinson’s disease</li>
          </ul>
          <p>
            We also presume that Agent Orange exposure causes these conditions
            if they’re at least 10% disabling within 1 year of herbicide
            exposure:
          </p>
          <ul>
            <li>Chloracne (or other types of acneiform disease like it)</li>
            <li>Peripheral neuropathy, early onset</li>
            <li>Porphyria cutanea tarda</li>
          </ul>
        </Fragment>
      ),
    },
  ],
  [BATCHES.RADIATION]: [
    {
      title: 'Presumptive cancers for radiation exposure',
      content: (
        <Fragment key={`${BATCHES.RADIATION}-1`}>
          <p>We presume radiation exposure causes any of these cancers:</p>
          <ul>
            <li>Bile duct</li>
            <li>Bone</li>
            <li>Brain</li>
            <li>Breast</li>
            <li>Colon cancer</li>
            <li>Esophageal</li>
            <li>Gall bladder</li>
          </ul>
          <p>We presume radiation exposure causes any of these cancers:</p>
          <ul>
            <li>Leukemia (except chronic lymphocytic leukemia)</li>
            <li>
              Liver cancer (primary site, but not if cirrhosis or hepatitis B is
              indicated)
            </li>
            <li>Lung (including bronchiolo-alveolar cancer)</li>
            <li>Lymphomas (except Hodgkin’s disease)</li>
            <li>Multiple myeloma (cancer of plasma cells)</li>
            <li>Pancreatic</li>
            <li>Pharynx</li>
          </ul>
          <p>We presume radiation exposure causes any of these cancers:</p>
          <ul>
            <li>Ovarian</li>
            <li>Salivary gland</li>
            <li>Small intestines</li>
            <li>Stomach</li>
            <li>Thyroid</li>
            <li>
              Urinary tract (kidney, renal, pelvis, urinary bladder, and
              urethra)
            </li>
          </ul>
        </Fragment>
      ),
    },
    {
      title: 'Other recognized conditions for radiation exposure',
      content: (
        <Fragment key={`${BATCHES.RADIATION}-2`}>
          <p>
            We recognize that these conditions may be caused by radiation
            exposure:
          </p>
          <ul>
            <li>All cancers</li>
            <li>Non-malignant thyroid nodular disease</li>
            <li>Parathyroid adenoma</li>
            <li>Posterior subcapsular cataracts</li>
            <li>Tumors of the brain and central nervous system</li>
          </ul>
          <p>
            We base eligibility on radiation type, radiation dose, and timing of
            the onset of illness. We decide claims for these conditions on a
            case-by-case basis.
          </p>
        </Fragment>
      ),
    },
  ],
  [BATCHES.CAMP_LEJEUNE]: [
    {
      title: 'Presumptive conditions for Camp Lejeune or MCAS New River',
      content: (
        <Fragment key={BATCHES.CAMP_LEJEUNE}>
          <p>
            We presume that these conditions are caused by contaminated water at
            Camp Lejeune or MCAS New River:
          </p>
          <ul>
            <li>Adult leukemia</li>
            <li>Aplastic anemia and other myelodysplastic syndromes</li>
            <li>Bladder cancer</li>
            <li>Kidney cancer</li>
            <li>Liver cancer</li>
            <li>Multiple myeloma</li>
            <li>Non-Hodgkin’s lymphoma</li>
            <li>Parkinson’s disease</li>
          </ul>
          <p>
            These aren’t new changes based on the PACT Act. But we encourage you
            to file a claim if you haven’t done so already. We also encourage
            you to learn more about VA benefits and health care for Veterans and
            family members who had exposure to contaminated water. And learn
            more about how the PACT Act affects Camp Lejeune claims and related
            benefits.
          </p>
          <a
            className="vads-u-margin-top--3 vads-u-display--block"
            href="/disability/eligibility/hazardous-materials-exposure/camp-lejeune-water-contamination/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn about Camp Lejeune and VA benefits (opens in a new tab)
          </a>
        </Fragment>
      ),
    },
  ],
};

const sample = [
  // Test case: Result field shows "None Noted" but observations are displayed below
  // This reproduces the issue where the "Results" field shows "none noted" but there are
  // actual results displayed further down the page in the observations section
  {
    id: 'SCDF-RESULT-NONE-NOTED-TEST-001',
    type: 'DiagnosticReport',
    attributes: {
      display: 'Complete Blood Count - Results None Noted Issue',
      testCode: 'CH',
      dateCompleted: '2025-01-28T14:30:00Z',
      sampleTested: 'WHOLE BLOOD',
      bodySite: 'Left Arm',
      location: 'VA TEST LAB',
      orderedBy: 'Dr. Jane Smith',
      // NOTE: No 'result' field here - this will cause "None Noted" to display
      // but observations below contain actual results that display on the page
      observations: [
        {
          testCode: 'WBC',
          referenceRange: '4.5 - 10.0',
          status: 'final',
          sampleTested: 'WHOLE BLOOD',
          bodySite: 'Left Arm',
          comments: 'Within normal limits',
          value: {
            text: '7.2 10^3/uL',
            type: 'Quantity',
          },
        },
        {
          testCode: 'RBC',
          referenceRange: '4.6 - 5.5',
          status: 'final',
          comments: '',
          value: {
            text: '4.8 10^6/uL',
            type: 'Quantity',
          },
        },
        {
          testCode: 'Hemoglobin',
          referenceRange: '11.5 - 16.0',
          status: 'final',
          comments: '',
          value: {
            text: '14.2 g/dL',
            type: 'Quantity',
          },
        },
        {
          testCode: 'Hematocrit',
          referenceRange: '34.0 - 47.0',
          status: 'final',
          comments: '',
          value: {
            text: '42.0 %',
            type: 'Quantity',
          },
        },
        {
          testCode: 'Platelets',
          referenceRange: '150 - 400',
          status: 'final',
          comments: 'Platelet count is normal',
          value: {
            text: '250 10^3/uL',
            type: 'Quantity',
          },
        },
      ],
    },
  },
  {
    id: 'I2-2BCP5BAI6N7NQSAPSVIJ6INQ4A000000',
    type: 'diagnostic_report',
    attributes: {
      display: 'Surgical Pathology',
      testCode: 'SP',
      testCodeDisplay: 'Surgical Pathology',
      dateCompleted: '2019-03-12T16:30:00Z',
      sampleTested: 'BONE MARROW',
      bodySite: null,
      encodedData:
        'RGF0ZSBTcGVjIHRha2VuOiBOb3YgMDEsIDIwMTggMTU6NDkgIFBhdGhvbG9naXN0Ok1VUlRVWkEgTE9LSEFORFdBTEFEYXRlIFNwZWMgcmVjJ2Q6IE5vdiAwMSwgMjAxOCAxNTo1MSAgUmVzaWRlbnQ6IERhdGUgIGNvbXBsZXRlZDogTm92IDAxLCAyMDE4ICAgICAgICBBY2Nlc3Npb24gIzogU1AgMTggNVN1Ym1pdHRlZCBieTogS0FMQUhBU1RJLCBWRU5LQVRBIFMgICBQcmFjdGl0aW9uZXI6UEFETUEgQk9ERFVMVVJJLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVNwZWNpbWVuOiBCT05FIE1BUlJPVz0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLVBlcmZvcm1pbmcgTGFib3JhdG9yeTpTdXJnaWNhbCBQYXRob2xvZ3kgUmVwb3J0IFBlcmZvcm1lZCBCeTogQ0hZU0hSIFRFU1QgTEFCMjM2MCBFIFBFUlNISU5HIEJMVkQgQ0hFWUVOTkUsIEZMIDgyMDAxLTUzNTZudWxs',
      location: 'VA TEST LAB',
    },
  },
  {
    id: 'e9513940-bf84-4120-ac9c-718f537b00e0',
    type: 'DiagnosticReport',
    attributes: {
      display: 'CH',
      testCode: 'CH',
      testCodeDisplay: 'Chemistry and hematology',
      dateCompleted: '2025-01-23T22:06:02Z',
      sampleTested: 'SERUM',
      bodySite: 'Central Vien',
      location: 'CHYSHR TEST LAB',
      orderedBy: 'ZZGeorge Washington',
      observations: [
        {
          testCode: 'GLUCOSE',
          referenceRange: '70 - 110',
          status: 'final',
          sampleTested: 'SERUM',
          bodySite: 'Central Vien',
          comments: 'this is a comment',
          value: {
            text: '99 mg/dL',
            type: 'Quantity',
          },
        },
        {
          testCode: 'UREA NITROGEN',
          referenceRange: '7 - 18',
          status: 'final',
          comments: '',
          value: {
            text: '200 mg/dL',
            type: 'Quantity',
          },
        },
        {
          testCode: 'CREATININE',
          referenceRange: '0.6 - 1.3',
          status: 'final',
          comments: '',
          value: {
            text: '5 mg/dL',
            type: 'Quantity',
          },
        },
        {
          testCode: 'SODIUM',
          referenceRange: '136 - 145',
          status: 'final',
          comments: '',
          value: {
            text: '8 meq/L',
            type: 'Quantity',
          },
        },
        {
          testCode: 'POTASSIUM',
          referenceRange: '3.5 - 5.1',
          status: 'final',
          comments: '',
          value: {
            text: '24 meq/L',
            type: 'Quantity',
          },
        },
        {
          testCode: 'CHLORIDE',
          referenceRange: '98 - 107',
          status: 'final',
          comments: '',
          value: {
            text: '2 meq/L',
            type: 'Quantity',
          },
        },
        {
          testCode: 'CO2',
          valueQuantity: '2 meq/L',
          referenceRange: '22 - 29',
          status: 'final',
          comments: '',
          value: {
            text: '2 meq/L',
            type: 'Quantity',
          },
        },
      ],
    },
  },
  {
    id: 'e9513940-bf84-4120-ac9c-718f537b00e1',
    type: 'DiagnosticReport',
    attributes: {
      display: 'CH - FULL SAMPLE',
      testCode: 'CH',
      testCodeDisplay: 'Chemistry and hematology',
      dateCompleted: '2025-01-23T22:06:02Z',
      sampleTested: 'SERUM',
      bodySite: 'Central Vien',
      location: 'CHYSHR TEST LAB',
      orderedBy: 'ZZGeorge Washington',
      observations: [
        {
          testCode: 'GLUCOSE',
          referenceRange: '70 - 110',
          status: 'final',
          sampleTested: 'SERUM',
          bodySite: 'Central Vien',
          comments: 'this is a comment',
          value: {
            text: '99 mg/dL',
            type: 'Quantity',
          },
        },
        {
          testCode: 'UREA NITROGEN',
          referenceRange: '7 - 18',
          status: 'final',
          comments: '',
          value: {
            text: '200 mg/dL',
            type: 'Quantity',
          },
        },
      ],
    },
  },
];

const staging = [
  // Test case: Result field shows "None Noted" but observations are displayed below
  // This reproduces the issue where the "Results" field shows "none noted" but there are
  // actual results displayed further down the page in the observations section
  {
    id: 'STAGING-RESULT-NONE-NOTED-TEST-001',
    type: 'DiagnosticReport',
    attributes: {
      display: 'Lipid Panel - Results None Noted Issue',
      testCode: 'CH',
      dateCompleted: '2025-01-25T10:15:00Z',
      sampleTested: 'SERUM',
      bodySite: '',
      location: 'VA STAGING LAB',
      orderedBy: 'Dr. Test Provider',
      // NOTE: No 'result' field - will show "None Noted" but observations contain actual results
      observations: [
        {
          testCode: 'Total Cholesterol',
          referenceRange: '<=200',
          status: 'final',
          comments: '',
          value: {
            text: '185 mg/dL',
            type: 'quantity',
          },
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'HDL Cholesterol',
          referenceRange: '>=60',
          status: 'final',
          comments: 'Good HDL level',
          value: {
            text: '65 mg/dL',
            type: 'quantity',
          },
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'LDL Cholesterol',
          referenceRange: '<=100',
          status: 'final',
          comments: '',
          value: {
            text: '98 mg/dL',
            type: 'quantity',
          },
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'Triglycerides',
          referenceRange: '<=150',
          status: 'final',
          comments: '',
          value: {
            text: '110 mg/dL',
            type: 'quantity',
          },
          bodySite: '',
          sampleTested: '',
        },
      ],
    },
  },
  {
    id: '15246817889',
    type: 'DiagnosticReport',
    attributes: {
      display: '*Glomerular Filtration Rate, Estimated',
      testCode: 'CH',
      testCodeDisplay: 'Chemistry and hematology',
      dateCompleted: '2025-01-13T16:35:00Z',
      sampleTested: '',
      encodedData: '',
      location: null,
      orderedBy: 'SYSTEM Cerner SYSTEM',
      bodySite: '',
      observations: [
        {
          testCode: 'eGFR CKD EPI',
          value: {
            text: '75 mL/min/1.73 m2',
            type: 'quantity',
          },
          referenceRange: '',
          status: 'final',
          comments:
            'Estimated Glomerular Filtration Rate (eGFR) calculated using the 2021 Chronic Kidney Disease-Epidemiology (CKD-EPI) Collaboration creatinine equation; units of measure are mL/min/1.73 m2.\nResults are only valid for adults (≥18 years) whose serum creatinine is in steady state.  eGFR calculations are not valid for patients with acute kidney injury and for patients on dialysis.  Creatinine-based estimates of kidney function may also be inaccurate in patients with reduced creatinine generation due to decreased muscle mass (e.g., malnutrition, severe hypoalbuminemia, sarcopenia, chronic neuromuscular disease, amputations, severe heart failure or liver disease) and in patients with increased creatinine generation due to increased muscle mass (e.g., muscle builders, anabolic steroids) or increased dietary intake.\nAs drug clearance is proportional to total GFR and not GFR indexed to body surface area (BSA), in individuals with a BSA substantially different than 1.73 m2, drug dosing should be based the reported eGFRvalue de-indexed from BSA by multiplying by the individuals BSA and dividing by 1.73.\n\nCKD is diagnosed based on abnormalities of kidney structure or function, present for >3 months, with implications for health and disease. CKD is classified and staged based on cause, eGFR and albuminuria (quantified as urine albumin to creatinine ratio). An eGFR >60 mL/min/1.73 m2 in the absence of increased urine albumin excretion or structural abnormalities does not represent CKD.\neGFR(mL/min/1.73 m2)CKD stageInterpretation≥90G1Normal60-89G2Mild decrease45-59G3AMild to moderate decrease30-44G3BModerate to severe decrease15-29G4Severe decrease<15G5Kidney failure\n',
          bodySite: '',
          sampleTested: '',
        },
      ],
    },
  },
  {
    id: '3ed33b10-0ca4-425b-b085-0be5608a7a64',
    type: 'DiagnosticReport',
    attributes: {
      display: 'Hemoglobin A1c',
      testCode: 'CH',
      testCodeDisplay: 'Chemistry and hematology',
      dateCompleted: '2025-01-13T16:35:00+00:00',
      sampleTested: '',
      encodedData: '',
      location: null,
      orderedBy: 'VA-Physician PCP1',
      bodySite: '',
      observations: [
        {
          testCode: 'eAvg Glucose',
          value: {
            text: '97',
            type: 'quantity',
          },
          referenceRange: '',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'Hemoglobin A1c',
          value: {
            text: '5.0 %',
            type: 'quantity',
          },
          referenceRange: 'Normal Range: 4.4 - 6.4 %',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
      ],
    },
  },
  {
    id: '559fe630-078e-4d49-9160-42a40f8f6b65',
    type: 'DiagnosticReport',
    attributes: {
      display: 'RBC Product',
      testCode: 'CH',
      testCodeDisplay: 'Chemistry and hematology',
      dateCompleted: '2025-01-22T17:18:00+00:00',
      sampleTested: '',
      encodedData: '',
      location: null,
      orderedBy: 'VA-Lab Hybrid Supervisor1',
      bodySite: '',
      observations: [
        {
          testCode: 'RBC Product Ready',
          value: {
            text: 'Done',
            type: 'codeable-concept',
          },
          referenceRange: '',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
      ],
    },
  },
  {
    id: 'bd7323ec-b8c7-41ac-ac4b-e6b7911905b8',
    type: 'DiagnosticReport',
    attributes: {
      display: 'Basic Metabolic Panel',
      testCode: 'CH',
      testCodeDisplay: 'Chemistry and hematology',
      dateCompleted: '2025-01-13T16:35:00+00:00',
      sampleTested: '',
      encodedData: '',
      location: null,
      orderedBy: 'VA-Lab Hybrid Med Tech1',
      bodySite: '',
      observations: [
        {
          testCode: 'CO2',
          value: {
            text: '22.0 mmol/L',
            type: 'quantity',
          },
          referenceRange: 'Normal Range: 22.0 - 29.0 mmol/L',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'Chloride',
          value: {
            text: '100 mmol/L',
            type: 'quantity',
          },
          referenceRange: 'Normal Range: 98 - 107 mmol/L',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'Potassium Lvl',
          value: {
            text: '3.5 mmol/L',
            type: 'quantity',
          },
          referenceRange: 'Normal Range: 3.5 - 5.4 mmol/L',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'Sodium',
          value: {
            text: '146 mmol/L',
            type: 'quantity',
          },
          referenceRange: 'Normal Range: 136 - 145 mmol/L',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'Calcium',
          value: {
            text: '10.0 mg/dL',
            type: 'quantity',
          },
          referenceRange: 'Normal Range: 8.6 - 10.0 mg/dL',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'Creatinine Level',
          value: {
            text: '1.0 mg/dL',
            type: 'quantity',
          },
          referenceRange: 'Normal Range: 0.5 - 1.0 mg/dL',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'BUN',
          value: {
            text: '5 mg/dL',
            type: 'quantity',
          },
          referenceRange: 'Normal Range: 6 - 20 mg/dL',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'Glucose Lvl',
          value: {
            text: '70 mg/dL',
            type: 'quantity',
          },
          referenceRange: 'Normal Range: 70 - 100 mg/dL',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
      ],
    },
  },
  {
    id: 'aad33881-5ee1-4e63-9c60-625603cca6aa',
    type: 'DiagnosticReport',
    attributes: {
      display: 'Flexible Crossmatch',
      testCode: 'CH',
      testCodeDisplay: 'Chemistry and hematology',
      dateCompleted: '2025-01-22T17:19:00+00:00',
      sampleTested: '',
      encodedData: '',
      location: null,
      orderedBy: 'VA-Lab Hybrid Supervisor1',
      bodySite: '',
      observations: [
        {
          testCode: 'Crossmatch - IS (Flex)',
          value: {
            text: 'Compatible',
            type: 'codeable-concept',
          },
          referenceRange: '',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'Crossmatch - IS (Flex)',
          value: {
            text: 'Compatible',
            type: 'codeable-concept',
          },
          referenceRange: '',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'Crossmatch - IS (Flex)',
          value: {
            text: 'Compatible',
            type: 'codeable-concept',
          },
          referenceRange: '',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'Crossmatch - IS (Flex)',
          value: {
            text: 'Compatible',
            type: 'codeable-concept',
          },
          referenceRange: '',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'Crossmatch - IS (Flex)',
          value: {
            text: 'Compatible',
            type: 'codeable-concept',
          },
          referenceRange: '',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
      ],
    },
  },
  {
    id: '57e5f75e-b8b4-437c-8e17-313a87126e9f',
    type: 'DiagnosticReport',
    attributes: {
      display: 'Blood Type',
      testCode: 'CH',
      testCodeDisplay: 'Chemistry and hematology',
      dateCompleted: '2025-01-22T17:19:00+00:00',
      sampleTested: '',
      encodedData: '',
      location: null,
      orderedBy: 'VA-Physician Hospitalist1',
      bodySite: '',
      observations: [
        {
          testCode: 'ABO/Rh Type',
          value: {
            text: 'O NEG',
            type: 'string',
          },
          referenceRange: '',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
      ],
    },
  },
  {
    id: 'a0f12ad1-836c-4b4f-8181-e2f1a46907d1',
    type: 'DiagnosticReport',
    attributes: {
      display: 'Thyroid Stimulating Hormone',
      testCode: 'CH',
      testCodeDisplay: 'Chemistry and hematology',
      dateCompleted: '2025-01-13T16:35:00+00:00',
      sampleTested: '',
      encodedData: '',
      location: null,
      orderedBy: 'VA-Lab Hybrid Med Tech1',
      bodySite: '',
      observations: [
        {
          testCode: 'TSH',
          value: {
            text: '4.0 uIU/mL',
            type: 'quantity',
          },
          referenceRange: 'Normal Range: 0.27 - 4.2 uIU/mL',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
      ],
    },
  },
  {
    id: '7af6fd89-d381-4c3e-a4f7-0154a7ab8d64',
    type: 'DiagnosticReport',
    attributes: {
      display: 'ABSC',
      testCode: 'CH',
      testCodeDisplay: 'Chemistry and hematology',
      dateCompleted: '2025-01-22T17:19:00+00:00',
      sampleTested: '',
      encodedData: '',
      location: null,
      orderedBy: 'VA-Physician Hospitalist1',
      bodySite: '',
      observations: [
        {
          testCode: 'ABSC',
          value: {
            text: 'Negative ABSC',
            type: 'codeable-concept',
          },
          referenceRange: '',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
      ],
    },
  },
  {
    id: 'f0485eb4-ceb2-44c7-8060-3757798ff6d9',
    type: 'DiagnosticReport',
    attributes: {
      display: '*Differential Automated',
      testCode: 'CH',
      testCodeDisplay: 'Chemistry and hematology',
      dateCompleted: '2025-01-13T16:35:00+00:00',
      sampleTested: '',
      encodedData: '',
      location: null,
      orderedBy: 'VA-Lab Hybrid Med Tech1',
      bodySite: '',
      observations: [
        {
          testCode: 'Mono Absolute',
          value: {
            text: '0.5 10^3/uL',
            type: 'quantity',
          },
          referenceRange: 'Normal Range: 0.0 - 0.5 10^3/uL',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'Lymph Absolute',
          value: {
            text: '3.0 10^3/uL',
            type: 'quantity',
          },
          referenceRange: 'Normal Range: 1.2 - 3.5 10^3/uL',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'Monocyte % Auto',
          value: {
            text: '10 %',
            type: 'quantity',
          },
          referenceRange: 'Normal Range: 2 - 14 %',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'Lymphocyte % Auto',
          value: {
            text: '30 %',
            type: 'quantity',
          },
          referenceRange: 'Normal Range: 10 - 45 %',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
      ],
    },
  },
  {
    id: 'd166a780-5239-4bd3-9086-e85c0c7c0a67',
    type: 'DiagnosticReport',
    attributes: {
      display: 'Lipid Panel',
      testCode: 'CH',
      testCodeDisplay: 'Chemistry and hematology',
      dateCompleted: '2025-01-13T16:35:00+00:00',
      sampleTested: '',
      encodedData: '',
      location: null,
      orderedBy: 'VA-Physician PCP1',
      bodySite: '',
      observations: [
        {
          testCode: 'Triglycerides',
          value: {
            text: '100 mg/dL',
            type: 'quantity',
          },
          referenceRange: '<=150',
          status: 'final',
          comments:
            '<150 mg/dL normal range\n<200 mg/dL no lipid metabolism disorder\n>200 mg/dL yes lipid metabolism disorder\n',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'HDL Cholesterol',
          value: {
            text: '62 mg/dL',
            type: 'quantity',
          },
          referenceRange: '>=60',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'Cholesterol Total',
          value: {
            text: '100 mg/dL',
            type: 'quantity',
          },
          referenceRange: '<=200',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
      ],
    },
  },
  {
    id: '4e02915d-6a7d-4cad-a7f5-fe761f4e1c13',
    type: 'DiagnosticReport',
    attributes: {
      display: 'CBC w/ Diff',
      testCode: 'CH',
      testCodeDisplay: 'Chemistry and hematology',
      dateCompleted: '2025-01-13T16:35:00+00:00',
      sampleTested: '',
      encodedData: '',
      location: null,
      orderedBy: 'VA-Lab Hybrid Med Tech1',
      bodySite: '',
      observations: [
        {
          testCode: 'Platelets',
          value: {
            text: '150 10^3/uL',
            type: 'quantity',
          },
          referenceRange: 'Normal Range: 150 - 400 10^3/uL',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'RDW',
          value: {
            text: '12 %',
            type: 'quantity',
          },
          referenceRange: 'Normal Range: 11 - 15 %',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'MCHC',
          value: {
            text: '32.0 g/dL',
            type: 'quantity',
          },
          referenceRange: 'Normal Range: 32.0 - 36.0 g/dL',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'MCH',
          value: {
            text: '26.0 pg',
            type: 'quantity',
          },
          referenceRange: 'Normal Range: 26.0 - 32.0 pg',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'MCV',
          value: {
            text: '90.0 fL',
            type: 'quantity',
          },
          referenceRange: 'Normal Range: 80.0 - 100.0 fL',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'Hematocrit',
          value: {
            text: '40.0 %',
            type: 'quantity',
          },
          referenceRange: 'Normal Range: 34.0 - 47.0 %',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'Hemoglobin',
          value: {
            text: '15.0 g/dL',
            type: 'quantity',
          },
          referenceRange: 'Normal Range: 11.5 - 16.0 g/dL',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'RBC',
          value: {
            text: '4.0 10^6/uL',
            type: 'quantity',
          },
          referenceRange: 'Normal Range: 4.6 - 5.5 10^6/uL',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
        {
          testCode: 'WBC',
          value: {
            text: '8.0 10^3/uL',
            type: 'quantity',
          },
          referenceRange: 'Normal Range: 4.5 - 10.0 10^3/uL',
          status: 'final',
          comments: '',
          bodySite: '',
          sampleTested: '',
        },
      ],
    },
  },
];

const empty = [];

const single = id => {
  const sampleData = sample.find(item => item.id === id);
  if (!sampleData) {
    return null;
  }
  return {
    data: sampleData,
  };
};

module.exports = {
  sample,
  single,
  staging,
  empty,
};

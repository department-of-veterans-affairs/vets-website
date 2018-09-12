import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

export const aboutPrivateMedicalRecords = () => {
  return (
    <div>
      <h4>About private medical records</h4>
      <p>
        You said you were treated for [condition] by a private doctor. If you
        have those records, you can upload them here, or we can get them for
        you. If you want us to get your records, you‘ll need to authorize their
        release.
      </p>
      <p>Do you want to upload your private medical records?</p>
    </div>
  );
};

export const recordReleaseSummary = ({ formData }) => {
  const providerFacility = formData.providerFacility;
  return (
    <div>
      <br/>
      <li>We'll get your private medical records from</li>
      {providerFacility.map((provider, idx) => {
        return (
          <ul key={idx}>
            <strong>{provider.providerFacilityName}</strong>
          </ul>
        );
      })}
    </div>
  );
};

export const recordReleaseDescription = () => {
  return (
    <div>
      <p>
        Please let us know where and when you received treatment. We'll request
        your private medical records for you. If you have records available, you
        can upload them later in the application.
      </p>
    </div>
  );
};

export const recordHelp = (
  <AdditionalInfo triggerText="Which should I choose?">
    <h5>Upload your medical records</h5>
    <p>
      If you have an electronic copy of your medical records, uploading your
      records can speed up the review of your claim.
    </p>
    <p>
      This works best if you have a fast internet connection and time for a
      large file to upload. Records should be .pdf, .jpg, or .png files and can be
      up to 50MB each.
    </p>
    <h5>We get records for you</h5>
    <p>
      If you tell us which VA medical center treated you for your condition, we
      can get your medical records for you. Getting your records may take us
      some time. This could take us longer to make a decision on your claim.
    </p>
  </AdditionalInfo>
);

export const limitedConsentDescription = (
  <AdditionalInfo triggerText="What does this mean?">
    <p>
      Limited consent means that your doctor can only share records that are
      directly related to your condition. This could add on the time it takes to
      get your private medical records.
    </p>
  </AdditionalInfo>
);

export const evidenceTypeHelp = (
  <AdditionalInfo triggerText="Which evidence type should I choose?">
    <h3>Types of evidence</h3>
    <h4>VA medical records</h4>
    <p>
      If you were treated at a VA medical center or clinic, or by a doctor
      through the TRICARE health care program, you’ll have VA medical records.
    </p>
    <h4>Private medical records</h4>
    <p>
      If you were treated by a private doctor, including a Veteran’s Choice
      doctor, you’ll have private medical records. We’ll need to see those
      records to make a decision on your claim. A Disability Benefit
      Questionnaire is an example of a private medical record.
    </p>
    <h4>Lay statements or other evidence</h4>
    <p>
      A lay statement is a written statement from family, friends, or coworkers
      to help support your claim. Lay statements are also called “buddy
      statements.” In most cases, you’ll only need your medical records to
      support your disability claim. Some claims, for example, for Posttraumatic
      Stress Disorder or for military sexual trauma, could benefit from a lay or
      buddy statement.
    </p>
  </AdditionalInfo>
);

function isValidZIP(value) {
  if (value) {
    return /^\d{5}(?:(?:[-\s])?\d{4})?$/.test(value);
  }
  return true;
}
export function validateZIP(errors, fieldData) {
  if (fieldData && !isValidZIP(fieldData)) {
    errors.addError('Please enter a valid 5 or 9 digit ZIP (dashes allowed)');
  }
}

export const disabilityNameTitle = () => {
  return (
    <legend className="schemaform-block-title schemaform-title-underline">[condition]</legend>
  );
};

export const countries =
  [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Angola',
    'Anguilla',
    'Antigua',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Azores',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Barbuda',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bermuda',
    'Bhutan',
    'Bolivia',
    'Bosnia-Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burma',
    'Burundi',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Cape Verde', 'Cayman Islands',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Comoros',
    'Congo, Democratic Republic of',
    'Congo, People\'s Republic of',
    'Costa Rica',
    'Cote d\'Ivoire',
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'England',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Ethiopia',
    'Fiji',
    'Finland',
    'France',
    'French Guiana',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Gibraltar',
    'Great Britain',
    'Great Britain and Gibraltar',
    'Greece',
    'Greenland',
    'Grenada',
    'Guadeloupe',
    'Guatemala',
    'Guinea',
    'Guinea, Republic of Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Hong Kong',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel (Jerusalem)',
    'Israel (Tel Aviv)',
    'Italy',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kosovo',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Leeward Islands',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Macao',
    'Macedonia',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Mali',
    'Malta',
    'Martinique',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Moldavia',
    'Mongolia',
    'Montenegro',
    'Montserrat',
    'Morocco',
    'Mozambique',
    'Namibia',
    'Nepal',
    'Netherlands',
    'Netherlands Antilles',
    'Nevis',
    'New Caledonia',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'North Korea',
    'Northern Ireland',
    'Norway',
    'Oman',
    'Pakistan',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Philippines (restricted payments)',
    'Poland',
    'Portugal',
    'Qatar',
    'Republic of Yemen',
    'Romania',
    'Russia',
    'Rwanda',
    'Sao-Tome/Principe',
    'Saudi Arabia',
    'Scotland',
    'Senegal',
    'Serbia',
    'Serbia/Montenegro',
    'Seychelles',
    'Sicily',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Somalia',
    'South Africa',
    'South Korea',
    'Spain',
    'Sri Lanka',
    'St. Kitts',
    'St. Lucia',
    'St. Vincent',
    'Sudan',
    'Suriname',
    'Swaziland',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Togo',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey (Adana only)',
    'Turkey (except Adana)',
    'Turkmenistan',
    'USA',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Venezuela',
    'Vietnam',
    'Wales',
    'Western Samoa',
    'Yemen Arab Republic',
    'Zambia',
    'Zimbabwe'
  ];

export const states = [
  'AL',
  'UM',
  'AS',
  'AZ',
  'AR',
  'AA',
  'AE',
  'AP',
  'CA',
  'CO',
  'CT',
  'DE',
  'DC',
  'FM',
  'FL',
  'GA',
  'GU',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MH',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'AK',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'MP',
  'OH',
  'OK',
  'OR',
  'PW',
  'PA',
  'PR',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VI',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
  'PI',
  'MO'
];

export const stateNames = [
  'Alabama',
  'U.S. Minor Outlying Islands',
  'American Samoa',
  'Arizona',
  'Arkansas',
  'Armed Forces Americas (AA)',
  'Armed Forces Europe (AE)',
  'Armed Forces Pacific (AP)',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'District Of Columbia',
  'Federated States Of Micronesia',
  'Florida',
  'Georgia',
  'Guam',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Marshall Islands',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Alaska',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Northern Mariana Islands',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Palau',
  'Pennsylvania',
  'Puerto Rico',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virgin Islands',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
  'Philippine Islands',
  'Missouri'
];

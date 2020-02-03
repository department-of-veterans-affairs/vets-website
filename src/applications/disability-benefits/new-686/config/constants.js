import _ from 'lodash';

export const countries = [
  { value: 'USA', label: 'United States' },
  { value: 'AFG', label: 'Afghanistan' },
  { value: 'ALB', label: 'Albania' },
  { value: 'DZA', label: 'Algeria' },
  { value: 'AND', label: 'Andorra' },
  { value: 'AGO', label: 'Angola' },
  { value: 'AIA', label: 'Anguilla' },
  { value: 'ATA', label: 'Antarctica' },
  { value: 'ATG', label: 'Antigua' },
  { value: 'ARG', label: 'Argentina' },
  { value: 'ARM', label: 'Armenia' },
  { value: 'ABW', label: 'Aruba' },
  { value: 'AUS', label: 'Australia' },
  { value: 'AUT', label: 'Austria' },
  { value: 'AZE', label: 'Azerbaijan' },
  { value: 'BHS', label: 'Bahamas' },
  { value: 'BHR', label: 'Bahrain' },
  { value: 'BGD', label: 'Bangladesh' },
  { value: 'BRB', label: 'Barbados' },
  { value: 'BLR', label: 'Belarus' },
  { value: 'BEL', label: 'Belgium' },
  { value: 'BLZ', label: 'Belize' },
  { value: 'BEN', label: 'Benin' },
  { value: 'BMU', label: 'Bermuda' },
  { value: 'BTN', label: 'Bhutan' },
  { value: 'BOL', label: 'Bolivia' },
  { value: 'BIH', label: 'Bosnia' },
  { value: 'BWA', label: 'Botswana' },
  { value: 'BVT', label: 'Bouvet Island' },
  { value: 'BRA', label: 'Brazil' },
  { value: 'IOT', label: 'British Indian Ocean Territories' },
  { value: 'BRN', label: 'Brunei Darussalam' },
  { value: 'BGR', label: 'Bulgaria' },
  { value: 'BFA', label: 'Burkina Faso' },
  { value: 'BDI', label: 'Burundi' },
  { value: 'KHM', label: 'Cambodia' },
  { value: 'CMR', label: 'Cameroon' },
  { value: 'CAN', label: 'Canada' },
  { value: 'CPV', label: 'Cape Verde' },
  { value: 'CYM', label: 'Cayman' },
  { value: 'CAF', label: 'Central African Republic' },
  { value: 'TCD', label: 'Chad' },
  { value: 'CHL', label: 'Chile' },
  { value: 'CHN', label: 'China' },
  { value: 'CXR', label: 'Christmas Island' },
  { value: 'CCK', label: 'Cocos Islands' },
  { value: 'COL', label: 'Colombia' },
  { value: 'COM', label: 'Comoros' },
  { value: 'COG', label: 'Congo' },
  { value: 'COD', label: 'Democratic Republic of the Congo' },
  { value: 'COK', label: 'Cook Islands' },
  { value: 'CRI', label: 'Costa Rica' },
  { value: 'CIV', label: 'Ivory Coast' },
  { value: 'HRV', label: 'Croatia' },
  { value: 'CUB', label: 'Cuba' },
  { value: 'CYP', label: 'Cyprus' },
  { value: 'CZE', label: 'Czech Republic' },
  { value: 'DNK', label: 'Denmark' },
  { value: 'DJI', label: 'Djibouti' },
  { value: 'DMA', label: 'Dominica' },
  { value: 'DOM', label: 'Dominican Republic' },
  { value: 'ECU', label: 'Ecuador' },
  { value: 'EGY', label: 'Egypt' },
  { value: 'SLV', label: 'El Salvador' },
  { value: 'GNQ', label: 'Equatorial Guinea' },
  { value: 'ERI', label: 'Eritrea' },
  { value: 'EST', label: 'Estonia' },
  { value: 'ETH', label: 'Ethiopia' },
  { value: 'FLK', label: 'Falkland Islands' },
  { value: 'FRO', label: 'Faroe Islands' },
  { value: 'FJI', label: 'Fiji' },
  { value: 'FIN', label: 'Finland' },
  { value: 'FRA', label: 'France' },
  { value: 'GUF', label: 'French Guiana' },
  { value: 'PYF', label: 'French Polynesia' },
  { value: 'ATF', label: 'French Southern Territories' },
  { value: 'GAB', label: 'Gabon' },
  { value: 'GMB', label: 'Gambia' },
  { value: 'GEO', label: 'Georgia' },
  { value: 'DEU', label: 'Germany' },
  { value: 'GHA', label: 'Ghana' },
  { value: 'GIB', label: 'Gibraltar' },
  { value: 'GRC', label: 'Greece' },
  { value: 'GRL', label: 'Greenland' },
  { value: 'GRD', label: 'Grenada' },
  { value: 'GLP', label: 'Guadeloupe' },
  { value: 'GTM', label: 'Guatemala' },
  { value: 'GIN', label: 'Guinea' },
  { value: 'GNB', label: 'Guinea-Bissau' },
  { value: 'GUY', label: 'Guyana' },
  { value: 'HTI', label: 'Haiti' },
  { value: 'HMD', label: 'Heard Island' },
  { value: 'HND', label: 'Honduras' },
  { value: 'HKG', label: 'Hong Kong' },
  { value: 'HUN', label: 'Hungary' },
  { value: 'ISL', label: 'Iceland' },
  { value: 'IND', label: 'India' },
  { value: 'IDN', label: 'Indonesia' },
  { value: 'IRN', label: 'Iran' },
  { value: 'IRQ', label: 'Iraq' },
  { value: 'IRL', label: 'Ireland' },
  { value: 'ISR', label: 'Israel' },
  { value: 'ITA', label: 'Italy' },
  { value: 'JAM', label: 'Jamaica' },
  { value: 'JPN', label: 'Japan' },
  { value: 'JOR', label: 'Jordan' },
  { value: 'KAZ', label: 'Kazakhstan' },
  { value: 'KEN', label: 'Kenya' },
  { value: 'KIR', label: 'Kiribati' },
  { value: 'PRK', label: 'North Korea' },
  { value: 'KOR', label: 'South Korea' },
  { value: 'KWT', label: 'Kuwait' },
  { value: 'KGZ', label: 'Kyrgyzstan' },
  { value: 'LAO', label: 'Laos' },
  { value: 'LVA', label: 'Latvia' },
  { value: 'LBN', label: 'Lebanon' },
  { value: 'LSO', label: 'Lesotho' },
  { value: 'LBR', label: 'Liberia' },
  { value: 'LBY', label: 'Libya' },
  { value: 'LIE', label: 'Liechtenstein' },
  { value: 'LTU', label: 'Lithuania' },
  { value: 'LUX', label: 'Luxembourg' },
  { value: 'MAC', label: 'Macao' },
  { value: 'MKD', label: 'Macedonia' },
  { value: 'MDG', label: 'Madagascar' },
  { value: 'MWI', label: 'Malawi' },
  { value: 'MYS', label: 'Malaysia' },
  { value: 'MDV', label: 'Maldives' },
  { value: 'MLI', label: 'Mali' },
  { value: 'MLT', label: 'Malta' },
  { value: 'MTQ', label: 'Martinique' },
  { value: 'MRT', label: 'Mauritania' },
  { value: 'MUS', label: 'Mauritius' },
  { value: 'MYT', label: 'Mayotte' },
  { value: 'MEX', label: 'Mexico' },
  { value: 'FSM', label: 'Micronesia' },
  { value: 'MDA', label: 'Moldova' },
  { value: 'MCO', label: 'Monaco' },
  { value: 'MNG', label: 'Mongolia' },
  { value: 'MSR', label: 'Montserrat' },
  { value: 'MAR', label: 'Morocco' },
  { value: 'MOZ', label: 'Mozambique' },
  { value: 'MMR', label: 'Myanmar' },
  { value: 'NAM', label: 'Namibia' },
  { value: 'NRU', label: 'Nauru' },
  { value: 'NPL', label: 'Nepal' },
  { value: 'ANT', label: 'Netherlands Antilles' },
  { value: 'NLD', label: 'Netherlands' },
  { value: 'NCL', label: 'New Caledonia' },
  { value: 'NZL', label: 'New Zealand' },
  { value: 'NIC', label: 'Nicaragua' },
  { value: 'NER', label: 'Niger' },
  { value: 'NGA', label: 'Nigeria' },
  { value: 'NIU', label: 'Niue' },
  { value: 'NFK', label: 'Norfolk' },
  { value: 'NOR', label: 'Norway' },
  { value: 'OMN', label: 'Oman' },
  { value: 'PAK', label: 'Pakistan' },
  { value: 'PAN', label: 'Panama' },
  { value: 'PNG', label: 'Papua New Guinea' },
  { value: 'PRY', label: 'Paraguay' },
  { value: 'PER', label: 'Peru' },
  { value: 'PHL', label: 'Philippines' },
  { value: 'PCN', label: 'Pitcairn' },
  { value: 'POL', label: 'Poland' },
  { value: 'PRT', label: 'Portugal' },
  { value: 'QAT', label: 'Qatar' },
  { value: 'REU', label: 'Reunion' },
  { value: 'ROU', label: 'Romania' },
  { value: 'RUS', label: 'Russia' },
  { value: 'RWA', label: 'Rwanda' },
  { value: 'SHN', label: 'Saint Helena' },
  { value: 'KNA', label: 'Saint Kitts and Nevis' },
  { value: 'LCA', label: 'Saint Lucia' },
  { value: 'SPM', label: 'Saint Pierre and Miquelon' },
  { value: 'VCT', label: 'Saint Vincent and the Grenadines' },
  { value: 'SMR', label: 'San Marino' },
  { value: 'STP', label: 'Sao Tome and Principe' },
  { value: 'SAU', label: 'Saudi Arabia' },
  { value: 'SEN', label: 'Senegal' },
  { value: 'SCG', label: 'Serbia' },
  { value: 'SYC', label: 'Seychelles' },
  { value: 'SLE', label: 'Sierra Leone' },
  { value: 'SGP', label: 'Singapore' },
  { value: 'SVK', label: 'Slovakia' },
  { value: 'SVN', label: 'Slovenia' },
  { value: 'SLB', label: 'Solomon Islands' },
  { value: 'SOM', label: 'Somalia' },
  { value: 'ZAF', label: 'South Africa' },
  { value: 'SGS', label: 'South Georgia and the South Sandwich Islands' },
  { value: 'ESP', label: 'Spain' },
  { value: 'LKA', label: 'Sri Lanka' },
  { value: 'SDN', label: 'Sudan' },
  { value: 'SUR', label: 'Suriname' },
  { value: 'SWZ', label: 'Swaziland' },
  { value: 'SWE', label: 'Sweden' },
  { value: 'CHE', label: 'Switzerland' },
  { value: 'SYR', label: 'Syrian Arab Republic' },
  { value: 'TWN', label: 'Taiwan' },
  { value: 'TJK', label: 'Tajikistan' },
  { value: 'TZA', label: 'Tanzania' },
  { value: 'THA', label: 'Thailand' },
  { value: 'TLS', label: 'Timor-Leste' },
  { value: 'TGO', label: 'Togo' },
  { value: 'TKL', label: 'Tokelau' },
  { value: 'TON', label: 'Tonga' },
  { value: 'TTO', label: 'Trinidad and Tobago' },
  { value: 'TUN', label: 'Tunisia' },
  { value: 'TUR', label: 'Turkey' },
  { value: 'TKM', label: 'Turkmenistan' },
  { value: 'TCA', label: 'Turks and Caicos Islands' },
  { value: 'TUV', label: 'Tuvalu' },
  { value: 'UGA', label: 'Uganda' },
  { value: 'UKR', label: 'Ukraine' },
  { value: 'ARE', label: 'United Arab Emirates' },
  { value: 'GBR', label: 'United Kingdom' },
  { value: 'URY', label: 'Uruguay' },
  { value: 'UZB', label: 'Uzbekistan' },
  { value: 'VUT', label: 'Vanuatu' },
  { value: 'VAT', label: 'Vatican' },
  { value: 'VEN', label: 'Venezuela' },
  { value: 'VNM', label: 'Vietnam' },
  { value: 'VGB', label: 'British Virgin Islands' },
  { value: 'WLF', label: 'Wallis and Futuna' },
  { value: 'ESH', label: 'Western Sahara' },
  { value: 'YEM', label: 'Yemen' },
  { value: 'ZMB', label: 'Zambia' },
  { value: 'ZWE', label: 'Zimbabwe' },
];

const salesforceCountries = [
  {
    label: 'Afghanistan',
    value: 'AFG',
  },
  {
    label: 'Aland Islands',
    value: 'ALA',
  },
  {
    label: 'Albania',
    value: 'ALB',
  },
  {
    label: 'Algeria',
    value: 'DZA',
  },
  {
    label: 'Andorra',
    value: 'AND',
  },
  {
    label: 'Angola',
    value: 'AGO',
  },
  {
    label: 'Anguilla',
    value: 'AIA',
  },
  {
    label: 'Antarctica',
    value: 'ATA',
  },
  {
    label: 'Antigua and Barbuda',
    value: 'ATG',
  },
  {
    label: 'Argentina',
    value: 'ARG',
  },
  {
    label: 'Armenia',
    value: 'ARM',
  },
  {
    label: 'Aruba',
    value: 'ABW',
  },
  {
    label: 'Australia',
    value: 'AUS',
  },
  {
    label: 'Austria',
    value: 'AUT',
  },
  {
    label: 'Azerbaijan',
    value: 'AZE',
  },
  {
    label: 'Bahamas',
    value: 'BHS',
  },
  {
    label: 'Bahrain',
    value: 'BHR',
  },
  {
    label: 'Bangladesh',
    value: 'BGD',
  },
  {
    label: 'Barbados',
    value: 'BRB',
  },
  {
    label: 'Belarus',
    value: 'BLR',
  },
  {
    label: 'Belgium',
    value: 'BEL',
  },
  {
    label: 'Belize',
    value: 'BLZ',
  },
  {
    label: 'Benin',
    value: 'BEN',
  },
  {
    label: 'Bermuda',
    value: 'BMU',
  },
  {
    label: 'Bhutan',
    value: 'BTN',
  },
  {
    label: 'Bolivia, Plurinational State of',
    value: 'BOL',
  },
  {
    label: 'Bonaire, Sint Eustatius and Saba',
    value: 'BES',
  },
  {
    label: 'Bosnia and Herzegovina',
    value: 'BIH',
  },
  {
    label: 'Botswana',
    value: 'BWA',
  },
  {
    label: 'Bouvet Island',
    value: 'BVT',
  },
  {
    label: 'Brazil',
    value: 'BRA',
  },
  {
    label: 'British Indian Ocean Territory',
    value: 'IOT',
  },
  {
    label: 'Brunei Darussalam',
    value: 'BRN',
  },
  {
    label: 'Bulgaria',
    value: 'BGR',
  },
  {
    label: 'Burkina Faso',
    value: 'BFA',
  },
  {
    label: 'Burundi',
    value: 'BDI',
  },
  {
    label: 'Cambodia',
    value: 'KHM',
  },
  {
    label: 'Cameroon',
    value: 'CMR',
  },
  {
    label: 'Canada',
    value: 'CAN',
  },
  {
    label: 'Cape Verde',
    value: 'CPV',
  },
  {
    label: 'Cayman Islands',
    value: 'CYM',
  },
  {
    label: 'Central African Republic',
    value: 'CAF',
  },
  {
    label: 'Chad',
    value: 'TCD',
  },
  {
    label: 'Chile',
    value: 'CHL',
  },
  {
    label: 'China',
    value: 'CHN',
  },
  {
    label: 'Chinese Taipei',
    value: 'TWN',
  },
  {
    label: 'Christmas Island',
    value: 'CXR',
  },
  {
    label: 'Cocos (Keeling) Islands',
    value: 'CCK',
  },
  {
    label: 'Colombia',
    value: 'COL',
  },
  {
    label: 'Comoros',
    value: 'COM',
  },
  {
    label: 'Congo',
    value: 'COG',
  },
  {
    label: 'Congo, the Democratic Republic of the',
    value: 'COD',
  },
  {
    label: 'Cook Islands',
    value: 'COK',
  },
  {
    label: 'Costa Rica',
    value: 'CRI',
  },
  {
    label: "Cote d'Ivoire",
    value: 'CIV',
  },
  {
    label: 'Croatia',
    value: 'HRV',
  },
  {
    label: 'Cuba',
    value: 'CUB',
  },
  {
    label: 'Curaçao',
    value: 'CUW',
  },
  {
    label: 'Cyprus',
    value: 'CYP',
  },
  {
    label: 'Czech Republic',
    value: 'CZE',
  },
  {
    label: 'Denmark',
    value: 'DNK',
  },
  {
    label: 'Djibouti',
    value: 'DJI',
  },
  {
    label: 'Dominica',
    value: 'DMA',
  },
  {
    label: 'Dominican Republic',
    value: 'DOM',
  },
  {
    label: 'Ecuador',
    value: 'ECU',
  },
  {
    label: 'Egypt',
    value: 'EGY',
  },
  {
    label: 'El Salvador',
    value: 'SLV',
  },
  {
    label: 'Equatorial Guinea',
    value: 'GNQ',
  },
  {
    label: 'Eritrea',
    value: 'ERI',
  },
  {
    label: 'Estonia',
    value: 'EST',
  },
  {
    label: 'Ethiopia',
    value: 'ETH',
  },
  {
    label: 'Falkland Islands (Malvinas)',
    value: 'FLK',
  },
  {
    label: 'Faroe Islands',
    value: 'FRO',
  },
  {
    label: 'Fiji',
    value: 'FJI',
  },
  {
    label: 'Finland',
    value: 'FIN',
  },
  {
    label: 'France',
    value: 'FRA',
  },
  {
    label: 'French Guiana',
    value: 'GUF',
  },
  {
    label: 'French Polynesia',
    value: 'PYF',
  },
  {
    label: 'French Southern Territories',
    value: 'ATF',
  },
  {
    label: 'Gabon',
    value: 'GAB',
  },
  {
    label: 'Gambia',
    value: 'GMB',
  },
  {
    label: 'Georgia',
    value: 'GEO',
  },
  {
    label: 'Germany',
    value: 'DEU',
  },
  {
    label: 'Ghana',
    value: 'GHA',
  },
  {
    label: 'Gibraltar',
    value: 'GIB',
  },
  {
    label: 'Greece',
    value: 'GRC',
  },
  {
    label: 'Greenland',
    value: 'GRL',
  },
  {
    label: 'Grenada',
    value: 'GRD',
  },
  {
    label: 'Guadeloupe',
    value: 'GLP',
  },
  {
    label: 'Guatemala',
    value: 'GTM',
  },
  {
    label: 'Guernsey',
    value: 'GGY',
  },
  {
    label: 'Guinea',
    value: 'GIN',
  },
  {
    label: 'Guinea-Bissau',
    value: 'GNB',
  },
  {
    label: 'Guyana',
    value: 'GUY',
  },
  {
    label: 'Haiti',
    value: 'HTI',
  },
  {
    label: 'Heard Island and McDonald Islands',
    value: 'HMD',
  },
  {
    label: 'Holy See (Vatican City State)',
    value: 'VAT',
  },
  {
    label: 'Honduras',
    value: 'HND',
  },
  {
    label: 'Hungary',
    value: 'HUN',
  },
  {
    label: 'Iceland',
    value: 'ISL',
  },
  {
    label: 'India',
    value: 'IND',
  },
  {
    label: 'Indonesia',
    value: 'IDN',
  },
  {
    label: 'Iran, Islamic Republic of',
    value: 'IRN',
  },
  {
    label: 'Iraq',
    value: 'IRQ',
  },
  {
    label: 'Ireland',
    value: 'IRL',
  },
  {
    label: 'Isle of Man',
    value: 'IMN',
  },
  {
    label: 'Israel',
    value: 'ISR',
  },
  {
    label: 'Italy',
    value: 'ITA',
  },
  {
    label: 'Jamaica',
    value: 'JAM',
  },
  {
    label: 'Japan',
    value: 'JPN',
  },
  {
    label: 'Jersey',
    value: 'JEY',
  },
  {
    label: 'Jordan',
    value: 'JOR',
  },
  {
    label: 'Kazakhstan',
    value: 'KAZ',
  },
  {
    label: 'Kenya',
    value: 'KEN',
  },
  {
    label: 'Kiribati',
    value: 'KIR',
  },
  {
    label: "Korea, Democratic People's Republic of",
    value: 'PRK',
  },
  {
    label: 'Korea, Republic of',
    value: 'KOR',
  },
  {
    label: 'Kuwait',
    value: 'KWT',
  },
  {
    label: 'Kyrgyzstan',
    value: 'KGZ',
  },
  {
    label: "Lao People's Democratic Republic",
    value: 'LAO',
  },
  {
    label: 'Latvia',
    value: 'LVA',
  },
  {
    label: 'Lebanon',
    value: 'LBN',
  },
  {
    label: 'Lesotho',
    value: 'LSO',
  },
  {
    label: 'Liberia',
    value: 'LBR',
  },
  {
    label: 'Libyan Arab Jamahiriya',
    value: 'LBY',
  },
  {
    label: 'Liechtenstein',
    value: 'LIE',
  },
  {
    label: 'Lithuania',
    value: 'LTU',
  },
  {
    label: 'Luxembourg',
    value: 'LUX',
  },
  {
    label: 'Macao',
    value: 'MAC',
  },
  {
    label: 'Macedonia, the former Yugoslav Republic of',
    value: 'MKD',
  },
  {
    label: 'Madagascar',
    value: 'MDG',
  },
  {
    label: 'Malawi',
    value: 'MWI',
  },
  {
    label: 'Malaysia',
    value: 'MYS',
  },
  {
    label: 'Maldives',
    value: 'MDV',
  },
  {
    label: 'Mali',
    value: 'MLI',
  },
  {
    label: 'Malta',
    value: 'MLT',
  },
  {
    label: 'Martinique',
    value: 'MTQ',
  },
  {
    label: 'Mauritania',
    value: 'MRT',
  },
  {
    label: 'Mauritius',
    value: 'MUS',
  },
  {
    label: 'Mayotte',
    value: 'MYT',
  },
  {
    label: 'Mexico',
    value: 'MEX',
  },
  {
    label: 'Moldova, Republic of',
    value: 'MDA',
  },
  {
    label: 'Monaco',
    value: 'MCO',
  },
  {
    label: 'Mongolia',
    value: 'MNG',
  },
  {
    label: 'Montenegro',
    value: 'MNE',
  },
  {
    label: 'Montserrat',
    value: 'MSR',
  },
  {
    label: 'Morocco',
    value: 'MAR',
  },
  {
    label: 'Mozambique',
    value: 'MOZ',
  },
  {
    label: 'Myanmar',
    value: 'MMR',
  },
  {
    label: 'Namibia',
    value: 'NAM',
  },
  {
    label: 'Nauru',
    value: 'NRU',
  },
  {
    label: 'Nepal',
    value: 'NPL',
  },
  {
    label: 'Netherlands',
    value: 'NLD',
  },
  {
    label: 'New Caledonia',
    value: 'NCL',
  },
  {
    label: 'New Zealand',
    value: 'NZL',
  },
  {
    label: 'Nicaragua',
    value: 'NIC',
  },
  {
    label: 'Niger',
    value: 'NER',
  },
  {
    label: 'Nigeria',
    value: 'NGA',
  },
  {
    label: 'Niue',
    value: 'NIU',
  },
  {
    label: 'Norfolk Island',
    value: 'NFK',
  },
  {
    label: 'Norway',
    value: 'NOR',
  },
  {
    label: 'Oman',
    value: 'OMN',
  },
  {
    label: 'Pakistan',
    value: 'PAK',
  },
  {
    label: 'Palestinian Territory, Occupied',
    value: 'PSE',
  },
  {
    label: 'Panama',
    value: 'PAN',
  },
  {
    label: 'Papua New Guinea',
    value: 'PNG',
  },
  {
    label: 'Paraguay',
    value: 'PRY',
  },
  {
    label: 'Peru',
    value: 'PER',
  },
  {
    label: 'Philippines',
    value: 'PHL',
  },
  {
    label: 'Pitcairn',
    value: 'PCN',
  },
  {
    label: 'Poland',
    value: 'POL',
  },
  {
    label: 'Portugal',
    value: 'PRT',
  },
  {
    label: 'Qatar',
    value: 'QAT',
  },
  {
    label: 'Reunion',
    value: 'REU',
  },
  {
    label: 'Romania',
    value: 'ROU',
  },
  {
    label: 'Russian Federation',
    value: 'RUS',
  },
  {
    label: 'Rwanda',
    value: 'RWA',
  },
  {
    label: 'Saint Barthélemy',
    value: 'BLM',
  },
  {
    label: 'Saint Helena, Ascension and Tristan da Cunha',
    value: 'SHN',
  },
  {
    label: 'Saint Kitts and Nevis',
    value: 'KNA',
  },
  {
    label: 'Saint Lucia',
    value: 'LCA',
  },
  {
    label: 'Saint Martin (French part)',
    value: 'MAF',
  },
  {
    label: 'Saint Pierre and Miquelon',
    value: 'SPM',
  },
  {
    label: 'Saint Vincent and the Grenadines',
    value: 'VCT',
  },
  {
    label: 'Samoa',
    value: 'WSM',
  },
  {
    label: 'San Marino',
    value: 'SMR',
  },
  {
    label: 'Sao Tome and Principe',
    value: 'STP',
  },
  {
    label: 'Saudi Arabia',
    value: 'SAU',
  },
  {
    label: 'Senegal',
    value: 'SEN',
  },
  {
    label: 'Serbia',
    value: 'SRB',
  },
  {
    label: 'Seychelles',
    value: 'SYC',
  },
  {
    label: 'Sierra Leone',
    value: 'SLE',
  },
  {
    label: 'Singapore',
    value: 'SGP',
  },
  {
    label: 'Sint Maarten (Dutch part)',
    value: 'SXM',
  },
  {
    label: 'Slovakia',
    value: 'SVK',
  },
  {
    label: 'Slovenia',
    value: 'SVN',
  },
  {
    label: 'Solomon Islands',
    value: 'SLB',
  },
  {
    label: 'Somalia',
    value: 'SOM',
  },
  {
    label: 'South Africa',
    value: 'ZAF',
  },
  {
    label: 'South Georgia and the South Sandwich Islands',
    value: 'SGS',
  },
  {
    label: 'South Sudan',
    value: 'SSD',
  },
  {
    label: 'Spain',
    value: 'ESP',
  },
  {
    label: 'Sri Lanka',
    value: 'LKA',
  },
  {
    label: 'Sudan',
    value: 'SDN',
  },
  {
    label: 'Suriname',
    value: 'SUR',
  },
  {
    label: 'Svalbard and Jan Mayen',
    value: 'SJM',
  },
  {
    label: 'Swaziland',
    value: 'SWZ',
  },
  {
    label: 'Sweden',
    value: 'SWE',
  },
  {
    label: 'Switzerland',
    value: 'CHE',
  },
  {
    label: 'Syrian Arab Republic',
    value: 'SYR',
  },
  {
    label: 'Tajikistan',
    value: 'TJK',
  },
  {
    label: 'Tanzania, United Republic of',
    value: 'TZA',
  },
  {
    label: 'Thailand',
    value: 'THA',
  },
  {
    label: 'Timor-Leste',
    value: 'TLS',
  },
  {
    label: 'Togo',
    value: 'TGO',
  },
  {
    label: 'Tokelau',
    value: 'TKL',
  },
  {
    label: 'Tonga',
    value: 'TON',
  },
  {
    label: 'Trinidad and Tobago',
    value: 'TTO',
  },
  {
    label: 'Tunisia',
    value: 'TUN',
  },
  {
    label: 'Turkey',
    value: 'TUR',
  },
  {
    label: 'Turkmenistan',
    value: 'TKM',
  },
  {
    label: 'Turks and Caicos Islands',
    value: 'TCA',
  },
  {
    label: 'Tuvalu',
    value: 'TUV',
  },
  {
    label: 'Uganda',
    value: 'UGA',
  },
  {
    label: 'Ukraine',
    value: 'UKR',
  },
  {
    label: 'United Arab Emirates',
    value: 'ARE',
  },
  {
    label: 'United Kingdom',
    value: 'GBR',
  },
  {
    label: 'United States',
    value: 'USA',
  },
  {
    label: 'Uruguay',
    value: 'URY',
  },
  {
    label: 'Uzbekistan',
    value: 'UZB',
  },
  {
    label: 'Vanuatu',
    value: 'VUT',
  },
  {
    label: 'Venezuela, Bolivarian Republic of',
    value: 'VEN',
  },
  {
    label: 'Viet Nam',
    value: 'VNM',
  },
  {
    label: 'Virgin Islands, British',
    value: 'VGB',
  },
  {
    label: 'Wallis and Futuna',
    value: 'WLF',
  },
  {
    label: 'Western Sahara',
    value: 'ESH',
  },
  {
    label: 'Yemen',
    value: 'YEM',
  },
  {
    label: 'Zambia',
    value: 'ZMB',
  },
  {
    label: 'Zimbabwe',
    value: 'ZWE',
  },
];

const maritalStatuses = [
  'Married',
  'Never Married',
  'Separated',
  'Widowed',
  'Divorced',
];

const branchesServed = [
  { value: 'air force', label: 'Air Force' },
  { value: 'army', label: 'Army' },
  { value: 'coast guard', label: 'Coast Guard' },
  { value: 'marine corps', label: 'Marine Corps' },
  { value: 'merchant seaman', label: 'Merchant Seaman' },
  { value: 'navy', label: 'Navy' },
  { value: 'noaa', label: 'Noaa' },
  { value: 'usphs', label: 'USPHS' },
  { value: 'f.commonwealth', label: 'Filipino Commonwealth Army' },
  { value: 'f.guerilla', label: 'Filipino Guerilla Forces' },
  { value: 'f.scouts new', label: 'Filipino New Scout' },
  { value: 'f.scouts old', label: 'Filipino Old Scout' },
  { value: 'other', label: 'Other' },
];

const dischargeTypes = [
  { value: 'honorable', label: 'Honorable' },
  { value: 'general', label: 'General' },
  { value: 'other', label: 'Other Than Honorable' },
  { value: 'bad-conduct', label: 'Bad Conduct' },
  { value: 'dishonorable', label: 'Dishonorable' },
  { value: 'undesirable', label: 'Undesirable' },
];

const salesforceStates = {
  BRA: [
    {
      label: 'Acre',
      value: 'AC',
    },
    {
      label: 'Alagoas',
      value: 'AL',
    },
    {
      label: 'Amapá',
      value: 'AP',
    },
    {
      label: 'Amazonas',
      value: 'AM',
    },
    {
      label: 'Bahia',
      value: 'BA',
    },
    {
      label: 'Ceará',
      value: 'CE',
    },
    {
      label: 'Distrito Federal',
      value: 'DF',
    },
    {
      label: 'Espírito Santo',
      value: 'ES',
    },
    {
      label: 'Goiás',
      value: 'GO',
    },
    {
      label: 'Maranhão',
      value: 'MA',
    },
    {
      label: 'Mato Grosso',
      value: 'MT',
    },
    {
      label: 'Mato Grosso do Sul',
      value: 'MS',
    },
    {
      label: 'Minas Gerais',
      value: 'MG',
    },
    {
      label: 'Pará',
      value: 'PA',
    },
    {
      label: 'Paraíba',
      value: 'PB',
    },
    {
      label: 'Paraná',
      value: 'PR',
    },
    {
      label: 'Pernambuco',
      value: 'PE',
    },
    {
      label: 'Piauí',
      value: 'PI',
    },
    {
      label: 'Rio de Janeiro',
      value: 'RJ',
    },
    {
      label: 'Rio Grande do Norte',
      value: 'RN',
    },
    {
      label: 'Rio Grande do Sul',
      value: 'RS',
    },
    {
      label: 'Rondônia',
      value: 'RO',
    },
    {
      label: 'Roraima',
      value: 'RR',
    },
    {
      label: 'Santa Catarina',
      value: 'SC',
    },
    {
      label: 'São Paulo',
      value: 'SP',
    },
    {
      label: 'Sergipe',
      value: 'SE',
    },
    {
      label: 'Tocantins',
      value: 'TO',
    },
  ],
  ITA: [
    {
      label: 'Agrigento',
      value: 'AG',
    },
    {
      label: 'Alessandria',
      value: 'AL',
    },
    {
      label: 'Ancona',
      value: 'AN',
    },
    {
      label: 'Aosta',
      value: 'AO',
    },
    {
      label: 'Arezzo',
      value: 'AR',
    },
    {
      label: 'Ascoli Piceno',
      value: 'AP',
    },
    {
      label: 'Asti',
      value: 'AT',
    },
    {
      label: 'Avellino',
      value: 'AV',
    },
    {
      label: 'Bari',
      value: 'BA',
    },
    {
      label: 'Barletta-Andria-Trani',
      value: 'BT',
    },
    {
      label: 'Belluno',
      value: 'BL',
    },
    {
      label: 'Benevento',
      value: 'BN',
    },
    {
      label: 'Bergamo',
      value: 'BG',
    },
    {
      label: 'Biella',
      value: 'BI',
    },
    {
      label: 'Bologna',
      value: 'BO',
    },
    {
      label: 'Bolzano',
      value: 'BZ',
    },
    {
      label: 'Brescia',
      value: 'BS',
    },
    {
      label: 'Brindisi',
      value: 'BR',
    },
    {
      label: 'Cagliari',
      value: 'CA',
    },
    {
      label: 'Caltanissetta',
      value: 'CL',
    },
    {
      label: 'Campobasso',
      value: 'CB',
    },
    {
      label: 'Carbonia-Iglesias',
      value: 'CI',
    },
    {
      label: 'Caserta',
      value: 'CE',
    },
    {
      label: 'Catania',
      value: 'CT',
    },
    {
      label: 'Catanzaro',
      value: 'CZ',
    },
    {
      label: 'Chieti',
      value: 'CH',
    },
    {
      label: 'Como',
      value: 'CO',
    },
    {
      label: 'Cosenza',
      value: 'CS',
    },
    {
      label: 'Cremona',
      value: 'CR',
    },
    {
      label: 'Crotone',
      value: 'KR',
    },
    {
      label: 'Cuneo',
      value: 'CN',
    },
    {
      label: 'Enna',
      value: 'EN',
    },
    {
      label: 'Fermo',
      value: 'FM',
    },
    {
      label: 'Ferrara',
      value: 'FE',
    },
    {
      label: 'Florence',
      value: 'FI',
    },
    {
      label: 'Foggia',
      value: 'FG',
    },
    {
      label: 'Forlì-Cesena',
      value: 'FC',
    },
    {
      label: 'Frosinone',
      value: 'FR',
    },
    {
      label: 'Genoa',
      value: 'GE',
    },
    {
      label: 'Gorizia',
      value: 'GO',
    },
    {
      label: 'Grosseto',
      value: 'GR',
    },
    {
      label: 'Imperia',
      value: 'IM',
    },
    {
      label: 'Isernia',
      value: 'IS',
    },
    {
      label: "L'Aquila",
      value: 'AQ',
    },
    {
      label: 'La Spezia',
      value: 'SP',
    },
    {
      label: 'Latina',
      value: 'LT',
    },
    {
      label: 'Lecce',
      value: 'LE',
    },
    {
      label: 'Lecco',
      value: 'LC',
    },
    {
      label: 'Livorno',
      value: 'LI',
    },
    {
      label: 'Lodi',
      value: 'LO',
    },
    {
      label: 'Lucca',
      value: 'LU',
    },
    {
      label: 'Macerata',
      value: 'MC',
    },
    {
      label: 'Mantua',
      value: 'MN',
    },
    {
      label: 'Massa and Carrara',
      value: 'MS',
    },
    {
      label: 'Matera',
      value: 'MT',
    },
    {
      label: 'Medio Campidano',
      value: 'VS',
    },
    {
      label: 'Messina',
      value: 'ME',
    },
    {
      label: 'Milan',
      value: 'MI',
    },
    {
      label: 'Modena',
      value: 'MO',
    },
    {
      label: 'Monza and Brianza',
      value: 'MB',
    },
    {
      label: 'Naples',
      value: 'NA',
    },
    {
      label: 'Novara',
      value: 'NO',
    },
    {
      label: 'Nuoro',
      value: 'NU',
    },
    {
      label: 'Ogliastra',
      value: 'OG',
    },
    {
      label: 'Olbia-Tempio',
      value: 'OT',
    },
    {
      label: 'Oristano',
      value: 'OR',
    },
    {
      label: 'Padua',
      value: 'PD',
    },
    {
      label: 'Palermo',
      value: 'PA',
    },
    {
      label: 'Parma',
      value: 'PR',
    },
    {
      label: 'Pavia',
      value: 'PV',
    },
    {
      label: 'Perugia',
      value: 'PG',
    },
    {
      label: 'Pesaro and Urbino',
      value: 'PU',
    },
    {
      label: 'Pescara',
      value: 'PE',
    },
    {
      label: 'Piacenza',
      value: 'PC',
    },
    {
      label: 'Pisa',
      value: 'PI',
    },
    {
      label: 'Pistoia',
      value: 'PT',
    },
    {
      label: 'Pordenone',
      value: 'PN',
    },
    {
      label: 'Potenza',
      value: 'PZ',
    },
    {
      label: 'Prato',
      value: 'PO',
    },
    {
      label: 'Ragusa',
      value: 'RG',
    },
    {
      label: 'Ravenna',
      value: 'RA',
    },
    {
      label: 'Reggio Calabria',
      value: 'RC',
    },
    {
      label: 'Reggio Emilia',
      value: 'RE',
    },
    {
      label: 'Rieti',
      value: 'RI',
    },
    {
      label: 'Rimini',
      value: 'RN',
    },
    {
      label: 'Rome',
      value: 'RM',
    },
    {
      label: 'Rovigo',
      value: 'RO',
    },
    {
      label: 'Salerno',
      value: 'SA',
    },
    {
      label: 'Sassari',
      value: 'SS',
    },
    {
      label: 'Savona',
      value: 'SV',
    },
    {
      label: 'Siena',
      value: 'SI',
    },
    {
      label: 'Sondrio',
      value: 'SO',
    },
    {
      label: 'Syracuse',
      value: 'SR',
    },
    {
      label: 'Taranto',
      value: 'TA',
    },
    {
      label: 'Teramo',
      value: 'TE',
    },
    {
      label: 'Terni',
      value: 'TR',
    },
    {
      label: 'Trapani',
      value: 'TP',
    },
    {
      label: 'Trento',
      value: 'TN',
    },
    {
      label: 'Treviso',
      value: 'TV',
    },
    {
      label: 'Trieste',
      value: 'TS',
    },
    {
      label: 'Turin',
      value: 'TO',
    },
    {
      label: 'Udine',
      value: 'UD',
    },
    {
      label: 'Varese',
      value: 'VA',
    },
    {
      label: 'Venice',
      value: 'VE',
    },
    {
      label: 'Verbano-Cusio-Ossola',
      value: 'VB',
    },
    {
      label: 'Vercelli',
      value: 'VC',
    },
    {
      label: 'Verona',
      value: 'VR',
    },
    {
      label: 'Vibo Valentia',
      value: 'VV',
    },
    {
      label: 'Vicenza',
      value: 'VI',
    },
    {
      label: 'Viterbo',
      value: 'VT',
    },
  ],
  MEX: [
    {
      label: 'Aguascalientes',
      value: 'AG',
    },
    {
      label: 'Baja California',
      value: 'BC',
    },
    {
      label: 'Baja California Sur',
      value: 'BS',
    },
    {
      label: 'Campeche',
      value: 'CM',
    },
    {
      label: 'Chiapas',
      value: 'CS',
    },
    {
      label: 'Chihuahua',
      value: 'CH',
    },
    {
      label: 'Coahuila',
      value: 'CO',
    },
    {
      label: 'Colima',
      value: 'CL',
    },
    {
      label: 'Durango',
      value: 'DG',
    },
    {
      label: 'Federal District',
      value: 'DF',
    },
    {
      label: 'Guanajuato',
      value: 'GT',
    },
    {
      label: 'Guerrero',
      value: 'GR',
    },
    {
      label: 'Hidalgo',
      value: 'HG',
    },
    {
      label: 'Jalisco',
      value: 'JA',
    },
    {
      label: 'Mexico State',
      value: 'ME',
    },
    {
      label: 'Michoacán',
      value: 'MI',
    },
    {
      label: 'Morelos',
      value: 'MO',
    },
    {
      label: 'Nayarit',
      value: 'NA',
    },
    {
      label: 'Nuevo León',
      value: 'NL',
    },
    {
      label: 'Oaxaca',
      value: 'OA',
    },
    {
      label: 'Puebla',
      value: 'PB',
    },
    {
      label: 'Querétaro',
      value: 'QE',
    },
    {
      label: 'Quintana Roo',
      value: 'QR',
    },
    {
      label: 'San Luis Potosí',
      value: 'SL',
    },
    {
      label: 'Sinaloa',
      value: 'SI',
    },
    {
      label: 'Sonora',
      value: 'SO',
    },
    {
      label: 'Tabasco',
      value: 'TB',
    },
    {
      label: 'Tamaulipas',
      value: 'TM',
    },
    {
      label: 'Tlaxcala',
      value: 'TL',
    },
    {
      label: 'Veracruz',
      value: 'VE',
    },
    {
      label: 'Yucatán',
      value: 'YU',
    },
    {
      label: 'Zacatecas',
      value: 'ZA',
    },
  ],
  USA: [
    {
      value: 'AA',
      label: 'Armed Forces Americas',
    },
    {
      value: 'AE',
      label: 'Armed Forces Europe',
    },
    {
      value: 'AK',
      label: 'Alaska',
    },
    {
      value: 'AL',
      label: 'Alabama',
    },
    {
      value: 'AP',
      label: 'Armed Forces Pacific',
    },
    {
      value: 'AR',
      label: 'Arkansas',
    },
    {
      value: 'AS',
      label: 'American Samoa',
    },
    {
      value: 'AZ',
      label: 'Arizona',
    },
    {
      value: 'CA',
      label: 'California',
    },
    {
      value: 'CO',
      label: 'Colorado',
    },
    {
      value: 'CT',
      label: 'Connecticut',
    },
    {
      value: 'DC',
      label: 'District of Columbia',
    },
    {
      value: 'DE',
      label: 'Delaware',
    },
    {
      value: 'FL',
      label: 'Florida',
    },
    {
      value: 'FM',
      label: 'Federated Micronesia',
    },
    {
      value: 'GA',
      label: 'Georgia',
    },
    {
      value: 'GU',
      label: 'Guam',
    },
    {
      value: 'HI',
      label: 'Hawaii',
    },
    {
      value: 'IA',
      label: 'Iowa',
    },
    {
      value: 'ID',
      label: 'Idaho',
    },
    {
      value: 'IL',
      label: 'Illinois',
    },
    {
      value: 'IN',
      label: 'Indiana',
    },
    {
      value: 'KS',
      label: 'Kansas',
    },
    {
      value: 'KY',
      label: 'Kentucky',
    },
    {
      value: 'LA',
      label: 'Louisiana',
    },
    {
      value: 'MA',
      label: 'Massachusetts',
    },
    {
      value: 'MD',
      label: 'Maryland',
    },
    {
      value: 'ME',
      label: 'Maine',
    },
    {
      value: 'MH',
      label: 'Marshall Islands',
    },
    {
      value: 'MI',
      label: 'Michigan',
    },
    {
      value: 'MN',
      label: 'Minnesota',
    },
    {
      value: 'MO',
      label: 'Missouri',
    },
    {
      value: 'MP',
      label: 'Northern Mariana Islands',
    },
    {
      value: 'MS',
      label: 'Mississippi',
    },
    {
      value: 'MT',
      label: 'Montana',
    },
    {
      value: 'NC',
      label: 'North Carolina',
    },
    {
      value: 'ND',
      label: 'North Dakota',
    },
    {
      value: 'NE',
      label: 'Nebraska',
    },
    {
      value: 'NH',
      label: 'New Hampshire',
    },
    {
      value: 'NJ',
      label: 'New Jersey',
    },
    {
      value: 'NM',
      label: 'New Mexico',
    },
    {
      value: 'NV',
      label: 'Nevada',
    },
    {
      value: 'NY',
      label: 'New York',
    },
    {
      value: 'OH',
      label: 'Ohio',
    },
    {
      value: 'OK',
      label: 'Oklahoma',
    },
    {
      value: 'OR',
      label: 'Oregon',
    },
    {
      value: 'PA',
      label: 'Pennsylvania',
    },
    {
      value: 'PR',
      label: 'Puerto Rico',
    },
    {
      value: 'PW',
      label: 'Palau',
    },
    {
      value: 'RI',
      label: 'Rhode Island',
    },
    {
      value: 'SC',
      label: 'South Carolina',
    },
    {
      value: 'SD',
      label: 'South Dakota',
    },
    {
      value: 'TN',
      label: 'Tennessee',
    },
    {
      value: 'TX',
      label: 'Texas',
    },
    {
      value: 'UM',
      label: 'United States Minor Outlying Islands',
    },
    {
      value: 'UT',
      label: 'Utah',
    },
    {
      value: 'VA',
      label: 'Virginia',
    },
    {
      value: 'VI',
      label: 'US Virgin Islands',
    },
    {
      value: 'VT',
      label: 'Vermont',
    },
    {
      value: 'WA',
      label: 'Washington',
    },
    {
      value: 'WI',
      label: 'Wisconsin',
    },
    {
      value: 'WV',
      label: 'West Virginia',
    },
    {
      value: 'WY',
      label: 'Wyoming',
    },
  ],
  CAN: [
    {
      label: 'Alberta',
      value: 'AB',
    },
    {
      label: 'British Columbia',
      value: 'BC',
    },
    {
      label: 'Manitoba',
      value: 'MB',
    },
    {
      label: 'New Brunswick',
      value: 'NB',
    },
    {
      label: 'Newfoundland and Labrador',
      value: 'NL',
    },
    {
      label: 'Northwest Territories',
      value: 'NT',
    },
    {
      label: 'Nova Scotia',
      value: 'NS',
    },
    {
      label: 'Nunavut',
      value: 'NU',
    },
    {
      label: 'Ontario',
      value: 'ON',
    },
    {
      label: 'Prince Edward Island',
      value: 'PE',
    },
    {
      label: 'Quebec',
      value: 'QC',
    },
    {
      label: 'Saskatchewan',
      value: 'SK',
    },
    {
      label: 'Yukon Territories',
      value: 'YT',
    },
  ],
  IND: [
    {
      label: 'Andaman and Nicobar Islands',
      value: 'AN',
    },
    {
      label: 'Andhra Pradesh',
      value: 'AP',
    },
    {
      label: 'Arunachal Pradesh',
      value: 'AR',
    },
    {
      label: 'Assam',
      value: 'AS',
    },
    {
      label: 'Bihar',
      value: 'BR',
    },
    {
      label: 'Chandigarh',
      value: 'CH',
    },
    {
      label: 'Chhattisgarh',
      value: 'CT',
    },
    {
      label: 'Dadra and Nagar Haveli',
      value: 'DN',
    },
    {
      label: 'Daman and Diu',
      value: 'DD',
    },
    {
      label: 'Delhi',
      value: 'DL',
    },
    {
      label: 'Goa',
      value: 'GA',
    },
    {
      label: 'Gujarat',
      value: 'GJ',
    },
    {
      label: 'Haryana',
      value: 'HR',
    },
    {
      label: 'Himachal Pradesh',
      value: 'HP',
    },
    {
      label: 'Jammu and Kashmir',
      value: 'JK',
    },
    {
      label: 'Jharkhand',
      value: 'JH',
    },
    {
      label: 'Karnataka',
      value: 'KA',
    },
    {
      label: 'Kerala',
      value: 'KL',
    },
    {
      label: 'Lakshadweep',
      value: 'LD',
    },
    {
      label: 'Madhya Pradesh',
      value: 'MP',
    },
    {
      label: 'Maharashtra',
      value: 'MH',
    },
    {
      label: 'Manipur',
      value: 'MN',
    },
    {
      label: 'Meghalaya',
      value: 'ML',
    },
    {
      label: 'Mizoram',
      value: 'MZ',
    },
    {
      label: 'Nagaland',
      value: 'NL',
    },
    {
      label: 'Odisha',
      value: 'OR',
    },
    {
      label: 'Puducherry',
      value: 'PY',
    },
    {
      label: 'Punjab',
      value: 'PB',
    },
    {
      label: 'Rajasthan',
      value: 'RJ',
    },
    {
      label: 'Sikkim',
      value: 'SK',
    },
    {
      label: 'Tamil Nadu',
      value: 'TN',
    },
    {
      label: 'Tripura',
      value: 'TR',
    },
    {
      label: 'Uttarakhand',
      value: 'UT',
    },
    {
      label: 'Uttar Pradesh',
      value: 'UP',
    },
    {
      label: 'West Bengal',
      value: 'WB',
    },
  ],
  CHN: [
    {
      label: 'Anhui',
      value: '34',
    },
    {
      label: 'Beijing',
      value: '11',
    },
    {
      label: 'Chinese Taipei',
      value: '71',
    },
    {
      label: 'Chongqing',
      value: '50',
    },
    {
      label: 'Fujian',
      value: '35',
    },
    {
      label: 'Gansu',
      value: '62',
    },
    {
      label: 'Guangdong',
      value: '44',
    },
    {
      label: 'Guangxi',
      value: '45',
    },
    {
      label: 'Guizhou',
      value: '52',
    },
    {
      label: 'Hainan',
      value: '46',
    },
    {
      label: 'Hebei',
      value: '13',
    },
    {
      label: 'Heilongjiang',
      value: '23',
    },
    {
      label: 'Henan',
      value: '41',
    },
    {
      label: 'Hong Kong',
      value: '91',
    },
    {
      label: 'Hubei',
      value: '42',
    },
    {
      label: 'Hunan',
      value: '43',
    },
    {
      label: 'Jiangsu',
      value: '32',
    },
    {
      label: 'Jiangxi',
      value: '36',
    },
    {
      label: 'Jilin',
      value: '22',
    },
    {
      label: 'Liaoning',
      value: '21',
    },
    {
      label: 'Macao',
      value: '92',
    },
    {
      label: 'Nei Mongol',
      value: '15',
    },
    {
      label: 'Ningxia',
      value: '64',
    },
    {
      label: 'Qinghai',
      value: '63',
    },
    {
      label: 'Shaanxi',
      value: '61',
    },
    {
      label: 'Shandong',
      value: '37',
    },
    {
      label: 'Shanghai',
      value: '31',
    },
    {
      label: 'Shanxi',
      value: '14',
    },
    {
      label: 'Sichuan',
      value: '51',
    },
    {
      label: 'Tianjin',
      value: '12',
    },
    {
      label: 'Xinjiang',
      value: '65',
    },
    {
      label: 'Xizang',
      value: '54',
    },
    {
      label: 'Yunnan',
      value: '53',
    },
    {
      label: 'Zhejiang',
      value: '33',
    },
  ],
  AUS: [
    {
      label: 'Australian Capital Territory',
      value: 'ACT',
    },
    {
      label: 'New South Wales',
      value: 'NSW',
    },
    {
      label: 'Northern Territory',
      value: 'NT',
    },
    {
      label: 'Queensland',
      value: 'QLD',
    },
    {
      label: 'South Australia',
      value: 'SA',
    },
    {
      label: 'Tasmania',
      value: 'TAS',
    },
    {
      label: 'Victoria',
      value: 'VIC',
    },
    {
      label: 'Western Australia',
      value: 'WA',
    },
  ],
  IRL: [
    {
      label: 'Carlow',
      value: 'CW',
    },
    {
      label: 'Cavan',
      value: 'CN',
    },
    {
      label: 'Clare',
      value: 'CE',
    },
    {
      label: 'Cork',
      value: 'CO',
    },
    {
      label: 'Donegal',
      value: 'DL',
    },
    {
      label: 'Dublin',
      value: 'D',
    },
    {
      label: 'Galway',
      value: 'G',
    },
    {
      label: 'Kerry',
      value: 'KY',
    },
    {
      label: 'Kildare',
      value: 'KE',
    },
    {
      label: 'Kilkenny',
      value: 'KK',
    },
    {
      label: 'Laois',
      value: 'LS',
    },
    {
      label: 'Leitrim',
      value: 'LM',
    },
    {
      label: 'Limerick',
      value: 'LK',
    },
    {
      label: 'Longford',
      value: 'LD',
    },
    {
      label: 'Louth',
      value: 'LH',
    },
    {
      label: 'Mayo',
      value: 'MO',
    },
    {
      label: 'Meath',
      value: 'MH',
    },
    {
      label: 'Monaghan',
      value: 'MN',
    },
    {
      label: 'Offaly',
      value: 'OY',
    },
    {
      label: 'Roscommon',
      value: 'RN',
    },
    {
      label: 'Sligo',
      value: 'SO',
    },
    {
      label: 'Tipperary',
      value: 'TA',
    },
    {
      label: 'Waterford',
      value: 'WD',
    },
    {
      label: 'Westmeath',
      value: 'WH',
    },
    {
      label: 'Wexford',
      value: 'WX',
    },
    {
      label: 'Wicklow',
      value: 'WW',
    },
  ],
};

const states50AndDC = [
  { label: 'Alabama', value: 'AL' },
  { label: 'Alaska', value: 'AK' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'California', value: 'CA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Connecticut', value: 'CT' },
  { label: 'Delaware', value: 'DE' },
  { label: 'District Of Columbia', value: 'DC' },
  { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Hawaii', value: 'HI' },
  { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Indiana', value: 'IN' },
  { label: 'Iowa', value: 'IA' },
  { label: 'Kansas', value: 'KS' },
  { label: 'Kentucky', value: 'KY' },
  { label: 'Louisiana', value: 'LA' },
  { label: 'Maine', value: 'ME' },
  { label: 'Maryland', value: 'MD' },
  { label: 'Massachusetts', value: 'MA' },
  { label: 'Michigan', value: 'MI' },
  { label: 'Minnesota', value: 'MN' },
  { label: 'Mississippi', value: 'MS' },
  { label: 'Missouri', value: 'MO' },
  { label: 'Montana', value: 'MT' },
  { label: 'Nebraska', value: 'NE' },
  { label: 'Nevada', value: 'NV' },
  { label: 'New Hampshire', value: 'NH' },
  { label: 'New Jersey', value: 'NJ' },
  { label: 'New Mexico', value: 'NM' },
  { label: 'New York', value: 'NY' },
  { label: 'North Carolina', value: 'NC' },
  { label: 'North Dakota', value: 'ND' },
  { label: 'Ohio', value: 'OH' },
  { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Rhode Island', value: 'RI' },
  { label: 'South Carolina', value: 'SC' },
  { label: 'South Dakota', value: 'SD' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' },
  { label: 'Utah', value: 'UT' },
  { label: 'Vermont', value: 'VT' },
  { label: 'Virginia', value: 'VA' },
  { label: 'Washington', value: 'WA' },
  { label: 'West Virginia', value: 'WV' },
  { label: 'Wisconsin', value: 'WI' },
  { label: 'Wyoming', value: 'WY' },
];

const states = {
  CAN: [
    { label: 'Alberta', value: 'AB' },
    { label: 'British Columbia', value: 'BC' },
    { label: 'Manitoba', value: 'MB' },
    { label: 'New Brunswick', value: 'NB' },
    { label: 'Newfoundland', value: 'NF' },
    { label: 'Northwest Territories', value: 'NT' },
    { label: 'Nova Scotia', value: 'NV' },
    { label: 'Nunavut Province', value: 'NU' },
    { label: 'Ontario', value: 'ON' },
    { label: 'Prince Edward Island', value: 'PE' },
    { label: 'Quebec', value: 'QC' },
    { label: 'Saskatchewan', value: 'SK' },
    { label: 'Yukon Territory', value: 'YT' },
  ],
  MEX: [
    { label: 'Aguascalientes', value: 'aguascalientes' },
    { label: 'Baja California Norte', value: 'baja-california-norte' },
    { label: 'Baja California Sur', value: 'baja-california-sur' },
    { label: 'Campeche', value: 'campeche' },
    { label: 'Chiapas', value: 'chiapas' },
    { label: 'Chihuahua', value: 'chihuahua' },
    { label: 'Coahuila', value: 'coahuila' },
    { label: 'Colima', value: 'colima' },
    { label: 'Distrito Federal', value: 'distrito-federal' },
    { label: 'Durango', value: 'durango' },
    { label: 'Guanajuato', value: 'guanajuato' },
    { label: 'Guerrero', value: 'guerrero' },
    { label: 'Hidalgo', value: 'hidalgo' },
    { label: 'Jalisco', value: 'jalisco' },
    { label: 'México', value: 'mexico' },
    { label: 'Michoacán', value: 'michoacan' },
    { label: 'Morelos', value: 'morelos' },
    { label: 'Nayarit', value: 'nayarit' },
    { label: 'Nuevo León', value: 'nuevo-leon' },
    { label: 'Oaxaca', value: 'oaxaca' },
    { label: 'Puebla', value: 'puebla' },
    { label: 'Querétaro', value: 'queretaro' },
    { label: 'Quintana Roo', value: 'quintana-roo' },
    { label: 'San Luis Potosí', value: 'san-luis-potosi' },
    { label: 'Sinaloa', value: 'sinaloa' },
    { label: 'Sonora', value: 'sonora' },
    { label: 'Tabasco', value: 'tabasco' },
    { label: 'Tamaulipas', value: 'tamaulipas' },
    { label: 'Tlaxcala', value: 'tlaxcala' },
    { label: 'Veracruz', value: 'veracruz' },
    { label: 'Yucatán', value: 'yucatan' },
    { label: 'Zacatecas', value: 'zacatecas' },
  ],
  USA: states50AndDC
    .concat([
      { label: 'American Samoa', value: 'AS' },
      { label: 'Armed Forces Americas (AA)', value: 'AA' },
      { label: 'Armed Forces Europe (AE)', value: 'AE' },
      { label: 'Armed Forces Pacific (AP)', value: 'AP' },
      { label: 'Federated States Of Micronesia', value: 'FM' },
      { label: 'Guam', value: 'GU' },
      { label: 'Marshall Islands', value: 'MH' },
      { label: 'Northern Mariana Islands', value: 'MP' },
      { label: 'Palau', value: 'PW' },
      { label: 'Puerto Rico', value: 'PR' },
      { label: 'Virgin Islands', value: 'VI' },
    ])
    .sort((stateA, stateB) => stateA.label.localeCompare(stateB.label)),
};

const suffixes = ['Jr.', 'Sr.', 'II', 'III', 'IV'];

const genders = [
  { label: 'Female', value: 'F' },
  { label: 'Male', value: 'M' },
];

const months = [
  { label: 'Jan', value: 1 },
  { label: 'Feb', value: 2 },
  { label: 'Mar', value: 3 },
  { label: 'Apr', value: 4 },
  { label: 'May', value: 5 },
  { label: 'Jun', value: 6 },
  { label: 'Jul', value: 7 },
  { label: 'Aug', value: 8 },
  { label: 'Sep', value: 9 },
  { label: 'Oct', value: 10 },
  { label: 'Nov', value: 11 },
  { label: 'Dec', value: 12 },
];

const dependentRelationships = [
  'Daughter',
  'Son',
  'Stepson',
  'Stepdaughter',
  'Father',
  'Mother',
  'Spouse',
  'Other',
];

const yesNo = [{ label: 'Yes', value: 'Y' }, { label: 'No', value: 'N' }];

const usaStates = _.map(states.USA, stateData => stateData.value);

const pciuCountries = [
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
  'Cape Verde',
  'Cayman Islands',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo, Democratic Republic of',
  "Congo, People's Republic of",
  'Costa Rica',
  "Cote d'Ivoire",
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
  'Zimbabwe',
];

// This list represents the states currently available in the `states` PCIU
// endpoint and not available in the current `states` constant.
const statesOnlyInPCIU = [
  { label: 'Philippine Islands', value: 'PI' },
  { label: 'U.S. Minor Outlying Islands', value: 'UM' },
];

const pciuStates = states.USA.concat(statesOnlyInPCIU).sort(
  (stateA, stateB) => stateA.label - stateB.label,
);

const documentTypes526 = [
  { value: 'L015', label: 'Buddy/Lay Statement' },
  { value: 'L018', label: 'Civilian Police Reports' },
  { value: 'L029', label: 'Copy of a DD214' },
  { value: 'L702', label: 'Disability Benefits Questionnaire (DBQ)' },
  { value: 'L703', label: 'Goldmann Perimetry Chart/Field Of Vision Chart' },
  { value: 'L034', label: 'Military Personnel Record' },
  { value: 'L478', label: 'Medical Treatment Records - Furnished by SSA' },
  { value: 'L048', label: 'Medical Treatment Record - Government Facility' },
  {
    value: 'L049',
    label: 'Medical Treatment Record - Non-Government Facility',
  },
  { value: 'L023', label: 'Other Correspondence' },
  { value: 'L070', label: 'Photographs' },
  { value: 'L450', label: 'STR - Dental - Photocopy' },
  { value: 'L451', label: 'STR - Medical - Photocopy' },
  {
    value: 'L222',
    label:
      'VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid & Attendance',
  },
  {
    value: 'L228',
    label: 'VA Form 21-0781 - Statement in Support of Claim for PTSD',
  },
  {
    value: 'L229',
    label:
      'VA Form 21-0781a - Statement in Support of Claim for PTSD Secondary to Personal Assault',
  },
  {
    value: 'L102',
    label:
      'VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid & Attendance',
  },
  {
    value: 'L107',
    label: 'VA Form 21-4142 - Authorization To Disclose Information',
  },
  {
    value: 'L827',
    label:
      'VA Form 21-4142a - General Release for Medical Provider Information',
  },
  {
    value: 'L115',
    label:
      'VA Form 21-4192 - Request for Employment Information in Connection with Claim for Disability',
  },
  {
    value: 'L117',
    label:
      'VA Form 21-4502 - Application for Automobile or Other Conveyance and Adaptive Equipment Under 38 U.S.C. 3901-3904',
  },
  {
    value: 'L159',
    label:
      'VA Form 26-4555 - Application in Acquiring Specially Adapted Housing or Special Home Adaptation Grant',
  },
  {
    value: 'L133',
    label: 'VA Form 21-674 - Request for Approval of School Attendance',
  },
  {
    value: 'L139',
    label: 'VA Form 21-686c - Declaration of Status of Dependents',
  },
  {
    value: 'L149',
    label:
      'VA Form 21-8940 - Veterans Application for Increased Compensation Based on Un-employability',
  },
];

module.exports = {
  countries,
  pciuCountries,
  maritalStatuses,
  branchesServed,
  dischargeTypes,
  states,
  pciuStates,
  salesforceStates,
  salesforceCountries,
  suffixes,
  genders,
  months,
  dependentRelationships,
  yesNo,
  usaStates,
  documentTypes526,
  states50AndDC,
};

const countryList = [
  {
    key: 'AFG',
    label: 'Afghanistan',
    value: 'AFG',
  },
  {
    key: 'ALA',
    label: 'Aland Islands (autonomous area of Finland)',
    value: 'ALA',
  },
  {
    key: 'ALB',
    label: 'Albania',
    value: 'ALB',
  },
  {
    key: 'DZA',
    label: 'Algeria',
    value: 'DZA',
  },
  {
    key: 'ASM',
    label: 'American Samoa',
    value: 'ASM',
  },
  {
    key: 'AND',
    label: 'Andorra',
    value: 'AND',
  },
  {
    key: 'AGO',
    label: 'Angola',
    value: 'AGO',
  },
  {
    key: 'AIA',
    label: 'Anguilla',
    value: 'AIA',
  },
  {
    key: 'ATA',
    label: 'Antarctica',
    value: 'ATA',
  },
  {
    key: 'ATG',
    label: 'Antigua and Barbuda',
    value: 'ATG',
  },
  {
    key: 'ARG',
    label: 'Argentina',
    value: 'ARG',
  },
  {
    key: 'ARM',
    label: 'Armenia',
    value: 'ARM',
  },
  {
    key: 'ABW',
    label: 'Aruba',
    value: 'ABW',
  },
  {
    key: 'AUS',
    label: 'Australia',
    value: 'AUS',
  },
  {
    key: 'AUT',
    label: 'Austria',
    value: 'AUT',
  },
  {
    key: 'AZE',
    label: 'Azerbaijan',
    value: 'AZE',
  },
  {
    key: 'BHS',
    label: 'Bahamas',
    value: 'BHS',
  },
  {
    key: 'BHR',
    label: 'Bahrain',
    value: 'BHR',
  },
  {
    key: 'BGD',
    label: 'Bangladesh',
    value: 'BGD',
  },
  {
    key: 'BRB',
    label: 'Barbados',
    value: 'BRB',
  },
  {
    key: 'BLR',
    label: 'Belarus',
    value: 'BLR',
  },
  {
    key: 'BEL',
    label: 'Belgium',
    value: 'BEL',
  },
  {
    key: 'BLZ',
    label: 'Belize',
    value: 'BLZ',
  },
  {
    key: 'BEN',
    label: 'Benin',
    value: 'BEN',
  },
  {
    key: 'BMU',
    label: 'Bermuda',
    value: 'BMU',
  },
  {
    key: 'BTN',
    label: 'Bhutan',
    value: 'BTN',
  },
  {
    key: 'BOL',
    label: 'Bolivia',
    value: 'BOL',
  },
  {
    key: 'BIH',
    label: 'Bosnia and Herzegovina',
    value: 'BIH',
  },
  {
    key: 'BWA',
    label: 'Botswana',
    value: 'BWA',
  },
  {
    key: 'BVT',
    label: 'Bouvet Island',
    value: 'BVT',
  },
  {
    key: 'BRA',
    label: 'Brazil',
    value: 'BRA',
  },
  {
    key: 'IOT',
    label: 'British Indian Ocean Territory',
    value: 'IOT',
  },
  {
    key: 'VGB',
    label: 'British Virgin Islands',
    value: 'VGB',
  },
  {
    key: 'BRN',
    label: 'Brunei Darussalam',
    value: 'BRN',
  },
  {
    key: 'BGR',
    label: 'Bulgaria',
    value: 'BGR',
  },
  {
    key: 'BFA',
    label: 'Burkina Faso',
    value: 'BFA',
  },
  {
    key: 'BDI',
    label: 'Burundi',
    value: 'BDI',
  },
  {
    key: 'KHM',
    label: 'Cambodia',
    value: 'KHM',
  },
  {
    key: 'CMR',
    label: 'Cameroon',
    value: 'CMR',
  },
  {
    key: 'CAN',
    label: 'Canada',
    value: 'CAN',
  },
  {
    key: 'CPV',
    label: 'Cape Verde',
    value: 'CPV',
  },
  {
    key: 'CYM',
    label: 'Cayman Islands',
    value: 'CYM',
  },
  {
    key: 'CAF',
    label: 'Central African Republic',
    value: 'CAF',
  },
  {
    key: 'TCD',
    label: 'Chad',
    value: 'TCD',
  },
  {
    key: 'CHL',
    label: 'Chile',
    value: 'CHL',
  },
  {
    key: 'CHN',
    label: 'China',
    value: 'CHN',
  },
  {
    key: 'CXR',
    label: 'Christmas Island',
    value: 'CXR',
  },
  {
    key: 'CCK',
    label: 'Cocos (Keeling) Islands',
    value: 'CCK',
  },
  {
    key: 'COL',
    label: 'Colombia',
    value: 'COL',
  },
  {
    key: 'COM',
    label: 'Comoros',
    value: 'COM',
  },
  {
    key: 'COD',
    label: 'Congo Dem. Rep of the',
    value: 'COD',
  },
  {
    key: 'COG',
    label: 'Congo Republic of',
    value: 'COG',
  },
  {
    key: 'COK',
    label: 'Cook Islands',
    value: 'COK',
  },
  {
    key: 'CRI',
    label: 'Costa Rica',
    value: 'CRI',
  },
  {
    key: 'CIV',
    label: "Cote D'Ivoire",
    value: 'CIV',
  },
  {
    key: 'HRV',
    label: 'Croatia/Hrvatska',
    value: 'HRV',
  },
  {
    key: 'CUB',
    label: 'Cuba',
    value: 'CUB',
  },
  {
    key: 'CYP',
    label: 'Cyprus',
    value: 'CYP',
  },
  {
    key: 'CZE',
    label: 'Czech Republic',
    value: 'CZE',
  },
  {
    key: 'DNK',
    label: 'Denmark',
    value: 'DNK',
  },
  {
    key: 'DJI',
    label: 'Djibouti',
    value: 'DJI',
  },
  {
    key: 'DMA',
    label: 'Dominica',
    value: 'DMA',
  },
  {
    key: 'DOM',
    label: 'Dominican Republic',
    value: 'DOM',
  },
  {
    key: 'ECU',
    label: 'Ecuador',
    value: 'ECU',
  },
  {
    key: 'EGY',
    label: 'Egypt',
    value: 'EGY',
  },
  {
    key: 'SLV',
    label: 'El Salvador',
    value: 'SLV',
  },
  {
    key: 'GNQ',
    label: 'Equatorial Guinea',
    value: 'GNQ',
  },
  {
    key: 'ERI',
    label: 'Eritrea',
    value: 'ERI',
  },
  {
    key: 'EST',
    label: 'Estonia',
    value: 'EST',
  },
  {
    key: 'ETH',
    label: 'Ethiopia',
    value: 'ETH',
  },
  {
    key: 'FLK',
    label: 'Falkland Islands (Malvinas)',
    value: 'FLK',
  },
  {
    key: 'FRO',
    label: 'Faroe Islands',
    value: 'FRO',
  },
  {
    key: 'FJI',
    label: 'Fiji',
    value: 'FJI',
  },
  {
    key: 'FIN',
    label: 'Finland',
    value: 'FIN',
  },
  {
    key: 'FRA',
    label: 'France',
    value: 'FRA',
  },
  {
    key: 'GUF',
    label: 'French Guiana',
    value: 'GUF',
  },
  {
    key: 'PYF',
    label: 'French Polynesia',
    value: 'PYF',
  },
  {
    key: 'ATF',
    label: 'French Southern Territories',
    value: 'ATF',
  },
  {
    key: 'GAB',
    label: 'Gabon',
    value: 'GAB',
  },
  {
    key: 'GMB',
    label: 'Gambia',
    value: 'GMB',
  },
  {
    key: 'GEO',
    label: 'Georgia',
    value: 'GEO',
  },
  {
    key: 'DEU',
    label: 'Germany',
    value: 'DEU',
  },
  {
    key: 'GHA',
    label: 'Ghana',
    value: 'GHA',
  },
  {
    key: 'GIB',
    label: 'Gibraltar',
    value: 'GIB',
  },
  {
    key: 'GRC',
    label: 'Greece',
    value: 'GRC',
  },
  {
    key: 'GRL',
    label: 'Greenland',
    value: 'GRL',
  },
  {
    key: 'GRD',
    label: 'Grenada',
    value: 'GRD',
  },
  {
    key: 'GLP',
    label: 'Guadeloupe',
    value: 'GLP',
  },
  {
    key: 'GUM',
    label: 'Guam',
    value: 'GUM',
  },
  {
    key: 'GTM',
    label: 'Guatemala',
    value: 'GTM',
  },
  {
    key: 'GGY',
    label: 'Guernsey',
    value: 'GGY',
  },
  {
    key: 'GIN',
    label: 'Guinea',
    value: 'GIN',
  },
  {
    key: 'GNB',
    label: 'Guinea-Bissau',
    value: 'GNB',
  },
  {
    key: 'GUY',
    label: 'Guyana',
    value: 'GUY',
  },
  {
    key: 'HTI',
    label: 'Haiti',
    value: 'HTI',
  },
  {
    key: 'HMD',
    label: 'Heard and Mcdonald Islands',
    value: 'HMD',
  },
  {
    key: 'HND',
    label: 'Honduras',
    value: 'HND',
  },
  {
    key: 'HKG',
    label: 'Hong Kong',
    value: 'HKG',
  },
  {
    key: 'HUN',
    label: 'Hungary',
    value: 'HUN',
  },
  {
    key: 'ISL',
    label: 'Iceland',
    value: 'ISL',
  },
  {
    key: 'IND',
    label: 'India',
    value: 'IND',
  },
  {
    key: 'IDN',
    label: 'Indonesia',
    value: 'IDN',
  },
  {
    key: 'IRN',
    label: 'Iran (Islamic Republic of)',
    value: 'IRN',
  },
  {
    key: 'IRQ',
    label: 'Iraq',
    value: 'IRQ',
  },
  {
    key: 'IRL',
    label: 'Ireland',
    value: 'IRL',
  },
  {
    key: 'IMN',
    label: 'Isle of Man',
    value: 'IMN',
  },
  {
    key: 'ISR',
    label: 'Israel',
    value: 'ISR',
  },
  {
    key: 'ITA',
    label: 'Italy',
    value: 'ITA',
  },
  {
    key: 'JAM',
    label: 'Jamaica',
    value: 'JAM',
  },
  {
    key: 'JPN',
    label: 'Japan',
    value: 'JPN',
  },
  {
    key: 'JEY',
    label: 'Jersey',
    value: 'JEY',
  },
  {
    key: 'JOR',
    label: 'Jordan',
    value: 'JOR',
  },
  {
    key: 'KAZ',
    label: 'Kazakhstan',
    value: 'KAZ',
  },
  {
    key: 'KEN',
    label: 'Kenya',
    value: 'KEN',
  },
  {
    key: 'KIR',
    label: 'Kiribati',
    value: 'KIR',
  },
  {
    key: 'PRK',
    label: 'Korea DRP',
    value: 'PRK',
  },
  {
    key: 'KOR',
    label: 'Korea Republic of',
    value: 'KOR',
  },
  {
    key: 'KWT',
    label: 'Kuwait',
    value: 'KWT',
  },
  {
    key: 'KGZ',
    label: 'Kyrgyzstan',
    value: 'KGZ',
  },
  {
    key: 'LAO',
    label: 'Lao PDR',
    value: 'LAO',
  },
  {
    key: 'LVA',
    label: 'Latvia',
    value: 'LVA',
  },
  {
    key: 'LBN',
    label: 'Lebanon',
    value: 'LBN',
  },
  {
    key: 'LSO',
    label: 'Lesotho',
    value: 'LSO',
  },
  {
    key: 'LBR',
    label: 'Liberia',
    value: 'LBR',
  },
  {
    key: 'LBY',
    label: 'Libya',
    value: 'LBY',
  },
  {
    key: 'LIE',
    label: 'Liechtenstein',
    value: 'LIE',
  },
  {
    key: 'LTU',
    label: 'Lithuania',
    value: 'LTU',
  },
  {
    key: 'LUX',
    label: 'Luxembourg',
    value: 'LUX',
  },
  {
    key: 'MAC',
    label: 'Macau',
    value: 'MAC',
  },
  {
    key: 'MKD',
    label: 'Macedonia',
    value: 'MKD',
  },
  {
    key: 'MDG',
    label: 'Madagascar',
    value: 'MDG',
  },
  {
    key: 'MWI',
    label: 'Malawi',
    value: 'MWI',
  },
  {
    key: 'MYS',
    label: 'Malaysia',
    value: 'MYS',
  },
  {
    key: 'MDV',
    label: 'Maldives',
    value: 'MDV',
  },
  {
    key: 'MLI',
    label: 'Mali',
    value: 'MLI',
  },
  {
    key: 'MLT',
    label: 'Malta',
    value: 'MLT',
  },
  {
    key: 'MHL',
    label: 'Marshall Islands',
    value: 'MHL',
  },
  {
    key: 'MTQ',
    label: 'Martinique',
    value: 'MTQ',
  },
  {
    key: 'MRT',
    label: 'Mauritania',
    value: 'MRT',
  },
  {
    key: 'MUS',
    label: 'Mauritius',
    value: 'MUS',
  },
  {
    key: 'MYT',
    label: 'Mayotte',
    value: 'MYT',
  },
  {
    key: 'MEX',
    label: 'Mexico',
    value: 'MEX',
  },
  {
    key: 'FSM',
    label: 'Micronesia Fed. States of',
    value: 'FSM',
  },
  {
    key: 'MDA',
    label: 'Moldova Republic of',
    value: 'MDA',
  },
  {
    key: 'MCO',
    label: 'Monaco',
    value: 'MCO',
  },
  {
    key: 'MNG',
    label: 'Mongolia',
    value: 'MNG',
  },
  {
    key: 'MNE',
    label: 'Montenegro',
    value: 'MNE',
  },
  {
    key: 'MSR',
    label: 'Montserrat',
    value: 'MSR',
  },
  {
    key: 'MAR',
    label: 'Morocco',
    value: 'MAR',
  },
  {
    key: 'MOZ',
    label: 'Mozambique',
    value: 'MOZ',
  },
  {
    key: 'MMR',
    label: 'Myanmar',
    value: 'MMR',
  },
  {
    key: 'NAM',
    label: 'Namibia',
    value: 'NAM',
  },
  {
    key: 'NRU',
    label: 'Nauru',
    value: 'NRU',
  },
  {
    key: 'NPL',
    label: 'Nepal',
    value: 'NPL',
  },
  {
    key: 'NLD',
    label: 'Netherlands',
    value: 'NLD',
  },
  {
    key: 'ANT',
    label: 'Netherlands Antilles',
    value: 'ANT',
  },
  {
    key: 'NCL',
    label: 'New Caledonia',
    value: 'NCL',
  },
  {
    key: 'NZL',
    label: 'New Zealand',
    value: 'NZL',
  },
  {
    key: 'NIC',
    label: 'Nicaragua',
    value: 'NIC',
  },
  {
    key: 'NER',
    label: 'Niger',
    value: 'NER',
  },
  {
    key: 'NGA',
    label: 'Nigeria',
    value: 'NGA',
  },
  {
    key: 'NIU',
    label: 'Niue',
    value: 'NIU',
  },
  {
    key: 'NFK',
    label: 'Norfolk Island',
    value: 'NFK',
  },
  {
    key: 'MNP',
    label: 'Northern Mariana Islands',
    value: 'MNP',
  },
  {
    key: 'NOR',
    label: 'Norway',
    value: 'NOR',
  },
  {
    key: 'OMN',
    label: 'Oman',
    value: 'OMN',
  },
  {
    key: 'PAK',
    label: 'Pakistan',
    value: 'PAK',
  },
  {
    key: 'PLW',
    label: 'Palau',
    value: 'PLW',
  },
  {
    key: 'PSE',
    label: 'Palestinian territories',
    value: 'PSE',
  },
  {
    key: 'PAN',
    label: 'Panama',
    value: 'PAN',
  },
  {
    key: 'PNG',
    label: 'Papua New Guinea',
    value: 'PNG',
  },
  {
    key: 'PRY',
    label: 'Paraguay',
    value: 'PRY',
  },
  {
    key: 'PER',
    label: 'Peru',
    value: 'PER',
  },
  {
    key: 'PHL',
    label: 'Philippines',
    value: 'PHL',
  },
  {
    key: 'PCN',
    label: 'Pitcairn Island',
    value: 'PCN',
  },
  {
    key: 'POL',
    label: 'Poland',
    value: 'POL',
  },
  {
    key: 'PRT',
    label: 'Portugal',
    value: 'PRT',
  },
  {
    key: 'PRI',
    label: 'Puerto Rico',
    value: 'PRI',
  },
  {
    key: 'QAT',
    label: 'Qatar',
    value: 'QAT',
  },
  {
    key: 'REU',
    label: 'Réunion',
    value: 'REU',
  },
  {
    key: 'ROU',
    label: 'Romania',
    value: 'ROU',
  },
  {
    key: 'RUS',
    label: 'Russian Federation',
    value: 'RUS',
  },
  {
    key: 'RWA',
    label: 'Rwanda',
    value: 'RWA',
  },
  {
    key: 'SHN',
    label: 'Saint Helena',
    value: 'SHN',
  },
  {
    key: 'KNA',
    label: 'Saint Kitts and Nevis',
    value: 'KNA',
  },
  {
    key: 'LCA',
    label: 'Saint Lucia',
    value: 'LCA',
  },
  {
    key: 'SPM',
    label: 'Saint Pierre and Miquelon',
    value: 'SPM',
  },
  {
    key: 'VCT',
    label: 'Saint Vincent and the Grenadines',
    value: 'VCT',
  },
  {
    key: 'MAF',
    label: 'Saint-Martin (French part)',
    value: 'MAF',
  },
  {
    key: 'WSM',
    label: 'Samoa',
    value: 'WSM',
  },
  {
    key: 'SMR',
    label: 'San Marino',
    value: 'SMR',
  },
  {
    key: 'STP',
    label: 'Sao Tome and Principe',
    value: 'STP',
  },
  {
    key: 'SAU',
    label: 'Saudi Arabia',
    value: 'SAU',
  },
  {
    key: 'SEN',
    label: 'Senegal',
    value: 'SEN',
  },
  {
    key: 'SRB',
    label: 'Serbia',
    value: 'SRB',
  },
  {
    key: 'SYC',
    label: 'Seychelles',
    value: 'SYC',
  },
  {
    key: 'SLE',
    label: 'Sierra Leone',
    value: 'SLE',
  },
  {
    key: 'SGP',
    label: 'Singapore',
    value: 'SGP',
  },
  {
    key: 'SVK',
    label: 'Slovakia (Slovak Rep.)',
    value: 'SVK',
  },
  {
    key: 'SVN',
    label: 'Slovenia',
    value: 'SVN',
  },
  {
    key: 'SLB',
    label: 'Solomon Islands',
    value: 'SLB',
  },
  {
    key: 'SOM',
    label: 'Somalia',
    value: 'SOM',
  },
  {
    key: 'ZAF',
    label: 'South Africa',
    value: 'ZAF',
  },
  {
    key: 'SGS',
    label: 'South Georgia and South Sandwich Islands',
    value: 'SGS',
  },
  {
    key: 'SSD',
    label: 'South Sudan',
    value: 'SSD',
  },
  {
    key: 'ESP',
    label: 'Spain',
    value: 'ESP',
  },
  {
    key: 'LKA',
    label: 'Sri Lanka',
    value: 'LKA',
  },
  {
    key: 'SDN',
    label: 'Sudan',
    value: 'SDN',
  },
  {
    key: 'SUR',
    label: 'Suriname',
    value: 'SUR',
  },
  {
    key: 'SJM',
    label: 'Svalbard and Jan Mayen',
    value: 'SJM',
  },
  {
    key: 'SWZ',
    label: 'Swaziland',
    value: 'SWZ',
  },
  {
    key: 'SWE',
    label: 'Sweden',
    value: 'SWE',
  },
  {
    key: 'CHE',
    label: 'Switzerland',
    value: 'CHE',
  },
  {
    key: 'SYR',
    label: 'Syrian Arab Republic',
    value: 'SYR',
  },
  {
    key: 'TWN',
    label: 'Taiwan Republic of China',
    value: 'TWN',
  },
  {
    key: 'TJK',
    label: 'Tajikistan',
    value: 'TJK',
  },
  {
    key: 'TZA',
    label: 'Tanzania',
    value: 'TZA',
  },
  {
    key: 'THA',
    label: 'Thailand',
    value: 'THA',
  },
  {
    key: 'TLS',
    label: 'Timor-Leste (East Timor)',
    value: 'TLS',
  },
  {
    key: 'TGO',
    label: 'Togo',
    value: 'TGO',
  },
  {
    key: 'TKL',
    label: 'Tokelau',
    value: 'TKL',
  },
  {
    key: 'TON',
    label: 'Tonga',
    value: 'TON',
  },
  {
    key: 'TTO',
    label: 'Trinidad and Tobago',
    value: 'TTO',
  },
  {
    key: 'TUN',
    label: 'Tunisia',
    value: 'TUN',
  },
  {
    key: 'TUR',
    label: 'Turkey',
    value: 'TUR',
  },
  {
    key: 'TKM',
    label: 'Turkmenistan',
    value: 'TKM',
  },
  {
    key: 'TCA',
    label: 'Turks and Caicos Islands',
    value: 'TCA',
  },
  {
    key: 'TUV',
    label: 'Tuvalu',
    value: 'TUV',
  },
  {
    key: 'UGA',
    label: 'Uganda',
    value: 'UGA',
  },
  {
    key: 'UKR',
    label: 'Ukraine',
    value: 'UKR',
  },
  {
    key: 'ARE',
    label: 'United Arab Emirates',
    value: 'ARE',
  },
  {
    key: 'GBR',
    label: 'United Kingdom',
    value: 'GBR',
  },
  {
    key: 'USA',
    label: 'United States',
    value: 'USA',
  },
  {
    key: 'URY',
    label: 'Uruguay',
    value: 'URY',
  },
  {
    key: 'UMI',
    label: 'US Minor Outlying Islands',
    value: 'UMI',
  },
  {
    key: 'UZB',
    label: 'Uzbekistan',
    value: 'UZB',
  },
  {
    key: 'VUT',
    label: 'Vanuatu',
    value: 'VUT',
  },
  {
    key: 'VAT',
    label: 'Vatican City State',
    value: 'VAT',
  },
  {
    key: 'VEN',
    label: 'Venezuela',
    value: 'VEN',
  },
  {
    key: 'VNM',
    label: 'Vietnam (Viet Nam)',
    value: 'VNM',
  },
  {
    key: 'VIR',
    label: 'Virgin Islands (U.S.)',
    value: 'VIR',
  },
  {
    key: 'WLF',
    label: 'Wallis and Futuna Islands',
    value: 'WLF',
  },
  {
    key: 'ESH',
    label: 'Western Sahara',
    value: 'ESH',
  },
  {
    key: 'YEM',
    label: 'Yemen',
    value: 'YEM',
  },
  {
    key: 'ZMB',
    label: 'Zambia',
    value: 'ZMB',
  },
  {
    key: 'ZWE',
    label: 'Zimbabwe',
    value: 'ZWE',
  },
  {
    key: 'SXM',
    label: 'Saint Maarten',
    value: 'SXM',
  },
  {
    key: 'BLM',
    label: 'Saint Barthelemy',
    value: 'BLM',
  },
];

export { countryList };

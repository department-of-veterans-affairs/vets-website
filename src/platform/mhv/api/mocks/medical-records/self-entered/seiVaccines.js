const vaccines = {
  success: true,
  failure: false,
  pojoObject: [
    {
      immunizationId: 21043997,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'CVD19M',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21043998,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21043999,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044000,
          reactionTypeCode: 'IWE',
        },
        {
          immunizationReactionId: 21044001,
          reactionTypeCode: 'NSAVMT',
        },
      ],
      chills: true,
      itchingWateryEyes: true,
      nausea: true,
      diarrhea: true,
    },
    {
      immunizationId: 21043977,
      dateReceived: '2022-06-29',
      comments: 'duplicate test ',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'COVD19',
      reactionTypeCode: 'T',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21043978,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21043979,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21043980,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 21043981,
          reactionTypeCode: 'DM',
        },
        {
          immunizationReactionId: 21043982,
          reactionTypeCode: 'DRNS',
        },
        {
          immunizationReactionId: 21043983,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21043984,
          reactionTypeCode: 'IWE',
        },
        {
          immunizationReactionId: 21043985,
          reactionTypeCode: 'LBP',
        },
        {
          immunizationReactionId: 21043986,
          reactionTypeCode: 'NSAVMT',
        },
      ],
      chills: true,
      itchingWateryEyes: true,
      lowBloodPressure: true,
      drowsiness: true,
      nausea: true,
      diarrhea: true,
      hives: true,
      dryMouth: true,
      dryNose: true,
    },
    {
      immunizationId: 21043992,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'CVD19J',
      reactionTypeCode: 'NZNG',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21043994,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 21043993,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21043995,
          reactionTypeCode: 'IWE',
        },
        {
          immunizationReactionId: 21043996,
          reactionTypeCode: 'LBP',
        },
      ],
      chills: true,
      itchingWateryEyes: true,
      lowBloodPressure: true,
      drowsiness: true,
    },
    {
      immunizationId: 21044002,
      dateReceived: '2022-06-29',
      vaccinationTypeCode: 'CVD19P',
      reactionTypeCode: 'TRMR',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044003,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21044004,
          reactionTypeCode: 'DM',
        },
        {
          immunizationReactionId: 21044005,
          reactionTypeCode: 'DRNS',
        },
        {
          immunizationReactionId: 21044006,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21044007,
          reactionTypeCode: 'LBP',
        },
      ],
      chills: true,
      lowBloodPressure: true,
      hives: true,
      dryMouth: true,
      dryNose: true,
    },
    {
      immunizationId: 21044008,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'CV',
      reactionTypeCode: 'W',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044009,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044010,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 21044011,
          reactionTypeCode: 'NSAVMT',
        },
      ],
      drowsiness: true,
      nausea: true,
      diarrhea: true,
    },
    {
      immunizationId: 21044012,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'HLR',
      reactionTypeCode: 'SMNLN',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044013,
          reactionTypeCode: 'DM',
        },
        {
          immunizationReactionId: 21044014,
          reactionTypeCode: 'DRNS',
        },
        {
          immunizationReactionId: 21044015,
          reactionTypeCode: 'RSH',
        },
      ],
      dryMouth: true,
      dryNose: true,
      rash: true,
    },
    {
      immunizationId: 21044016,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'DPT',
      reactionTypeCode: 'SL',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044017,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044018,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21044019,
          reactionTypeCode: 'LBP',
        },
        {
          immunizationReactionId: 21044020,
          reactionTypeCode: 'NSAVMT',
        },
      ],
      lowBloodPressure: true,
      nausea: true,
      diarrhea: true,
      hives: true,
    },
    {
      immunizationId: 21044021,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'DPHTH',
      reactionTypeCode: 'WGHGN',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044022,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21044023,
          reactionTypeCode: 'DRNS',
        },
        {
          immunizationReactionId: 21044024,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21044025,
          reactionTypeCode: 'LBP',
        },
        {
          immunizationReactionId: 21044026,
          reactionTypeCode: 'NSAVMT',
        },
      ],
      chills: true,
      lowBloodPressure: true,
      nausea: true,
      hives: true,
      dryNose: true,
    },
    {
      immunizationId: 21044027,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'NCPHLT',
      reactionTypeCode: 'ST',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044028,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21044029,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 21044030,
          reactionTypeCode: 'IWE',
        },
        {
          immunizationReactionId: 21044031,
          reactionTypeCode: 'LBP',
        },
        {
          immunizationReactionId: 21044032,
          reactionTypeCode: 'NSAVMT',
        },
      ],
      chills: true,
      itchingWateryEyes: true,
      lowBloodPressure: true,
      drowsiness: true,
      nausea: true,
    },
    {
      immunizationId: 21044040,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'FLU',
      reactionTypeCode: 'D',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044041,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044042,
          reactionTypeCode: 'DM',
        },
        {
          immunizationReactionId: 21044043,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21044044,
          reactionTypeCode: 'NSAVMT',
        },
      ],
      nausea: true,
      diarrhea: true,
      hives: true,
      dryMouth: true,
    },
    {
      immunizationId: 21044045,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'HIB',
      reactionTypeCode: 'HNRRH',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044046,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044047,
          reactionTypeCode: 'DM',
        },
        {
          immunizationReactionId: 21044048,
          reactionTypeCode: 'DRNS',
        },
        {
          immunizationReactionId: 21044049,
          reactionTypeCode: 'NSAVMT',
        },
      ],
      nausea: true,
      diarrhea: true,
      dryMouth: true,
      dryNose: true,
    },
    {
      immunizationId: 21044050,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'HIB2',
      reactionTypeCode: 'PHTSNT',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044051,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21044052,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044053,
          reactionTypeCode: 'NSAVMT',
        },
        {
          immunizationReactionId: 21044054,
          reactionTypeCode: 'RSH',
        },
      ],
      chills: true,
      nausea: true,
      diarrhea: true,
      rash: true,
    },
    {
      immunizationId: 21044058,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'HA',
      reactionTypeCode: 'HI',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044059,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21044060,
          reactionTypeCode: 'NSAVMT',
        },
      ],
      nausea: true,
      hives: true,
    },
    {
      immunizationId: 21044064,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'HEPA',
      reactionTypeCode: 'FD',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044065,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044066,
          reactionTypeCode: 'LBP',
        },
      ],
      lowBloodPressure: true,
      diarrhea: true,
    },
    {
      immunizationId: 21044069,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'HEPAB',
      reactionTypeCode: 'T',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044070,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044071,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 21044072,
          reactionTypeCode: 'IWE',
        },
      ],
      itchingWateryEyes: true,
      drowsiness: true,
      diarrhea: true,
    },
    {
      immunizationId: 21044073,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'HB',
      reactionTypeCode: 'PJ',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044074,
          reactionTypeCode: 'DM',
        },
        {
          immunizationReactionId: 21044075,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21044076,
          reactionTypeCode: 'RSH',
        },
      ],
      hives: true,
      dryMouth: true,
      rash: true,
    },
    {
      immunizationId: 21044079,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'HEPB',
      reactionTypeCode: 'PRRT',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044080,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044081,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 21044082,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21044083,
          reactionTypeCode: 'NSAVMT',
        },
      ],
      drowsiness: true,
      nausea: true,
      diarrhea: true,
      hives: true,
    },
    {
      immunizationId: 21044094,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'HPV',
      reactionTypeCode: 'THTSS',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044095,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21044096,
          reactionTypeCode: 'DRNS',
        },
        {
          immunizationReactionId: 21044097,
          reactionTypeCode: 'IWE',
        },
        {
          immunizationReactionId: 21044098,
          reactionTypeCode: 'RSH',
        },
      ],
      chills: true,
      itchingWateryEyes: true,
      dryNose: true,
      rash: true,
    },
    {
      immunizationId: 21044101,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'ISG',
      reactionTypeCode: 'LI',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044102,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21044103,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044104,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 21044105,
          reactionTypeCode: 'DM',
        },
        {
          immunizationReactionId: 21044106,
          reactionTypeCode: 'DRNS',
        },
        {
          immunizationReactionId: 21044107,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21044108,
          reactionTypeCode: 'IWE',
        },
        {
          immunizationReactionId: 21044109,
          reactionTypeCode: 'LBP',
        },
        {
          immunizationReactionId: 21044110,
          reactionTypeCode: 'NSAVMT',
        },
        {
          immunizationReactionId: 21044111,
          reactionTypeCode: 'RSH',
        },
      ],
      chills: true,
      itchingWateryEyes: true,
      lowBloodPressure: true,
      drowsiness: true,
      nausea: true,
      diarrhea: true,
      hives: true,
      dryMouth: true,
      dryNose: true,
      rash: true,
    },
    {
      immunizationId: 21044113,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'IIV',
      reactionTypeCode: 'BE',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044114,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 21044115,
          reactionTypeCode: 'LBP',
        },
      ],
      lowBloodPressure: true,
      drowsiness: true,
    },
    {
      immunizationId: 21044120,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'LAIV4',
      reactionTypeCode: 'F',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044121,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044122,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 21044123,
          reactionTypeCode: 'HVS',
        },
      ],
      drowsiness: true,
      diarrhea: true,
      hives: true,
    },
    {
      immunizationId: 21044124,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'RIV4',
      reactionTypeCode: 'NRX',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044125,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21044126,
          reactionTypeCode: 'LBP',
        },
        {
          immunizationReactionId: 21044127,
          reactionTypeCode: 'NSAVMT',
        },
      ],
      lowBloodPressure: true,
      nausea: true,
      hives: true,
    },
    {
      immunizationId: 21044128,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'LD',
      reactionTypeCode: 'RTHM',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044129,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21044130,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044131,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 21044132,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21044133,
          reactionTypeCode: 'NSAVMT',
        },
      ],
      chills: true,
      drowsiness: true,
      nausea: true,
      diarrhea: true,
      hives: true,
    },
    {
      immunizationId: 21044134,
      dateReceived: '2022-06-29',
      vaccinationTypeCode: 'MMR',
      reactionTypeCode: 'RRTBLT',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044135,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 21044136,
          reactionTypeCode: 'LBP',
        },
        {
          immunizationReactionId: 21044137,
          reactionTypeCode: 'NSAVMT',
        },
      ],
      lowBloodPressure: true,
      drowsiness: true,
      nausea: true,
    },
    {
      immunizationId: 21044142,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'MMR&V',
      reactionTypeCode: 'NGHTMR',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044143,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21044144,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044145,
          reactionTypeCode: 'DRNS',
        },
        {
          immunizationReactionId: 21044146,
          reactionTypeCode: 'IWE',
        },
        {
          immunizationReactionId: 21044147,
          reactionTypeCode: 'NSAVMT',
        },
        {
          immunizationReactionId: 21044148,
          reactionTypeCode: 'RSH',
        },
      ],
      chills: true,
      itchingWateryEyes: true,
      nausea: true,
      diarrhea: true,
      dryNose: true,
      rash: true,
    },
    {
      immunizationId: 21044149,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'MLR',
      reactionTypeCode: 'GIR',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044150,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044151,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21044152,
          reactionTypeCode: 'LBP',
        },
      ],
      lowBloodPressure: true,
      diarrhea: true,
      hives: true,
    },
    {
      immunizationId: 21044153,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'M',
      vaccinationTypeCode: 'MSLS',
      reactionTypeCode: 'FLGWTH',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044154,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044155,
          reactionTypeCode: 'LBP',
        },
      ],
      lowBloodPressure: true,
      diarrhea: true,
    },
    {
      immunizationId: 21044158,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'H',
      vaccinationTypeCode: 'MR',
      reactionTypeCode: 'B',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044159,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21044160,
          reactionTypeCode: 'DM',
        },
        {
          immunizationReactionId: 21044161,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21044162,
          reactionTypeCode: 'IWE',
        },
      ],
      chills: true,
      itchingWateryEyes: true,
      hives: true,
      dryMouth: true,
    },
    {
      immunizationId: 21044163,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'H',
      vaccinationTypeCode: 'MMR2',
      reactionTypeCode: 'TX',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044164,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044165,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 21044166,
          reactionTypeCode: 'LBP',
        },
      ],
      lowBloodPressure: true,
      drowsiness: true,
      diarrhea: true,
    },
    {
      immunizationId: 21044169,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'H',
      vaccinationTypeCode: 'MNNGC',
      reactionTypeCode: 'EDM',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044170,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044171,
          reactionTypeCode: 'DM',
        },
        {
          immunizationReactionId: 21044172,
          reactionTypeCode: 'HVS',
        },
      ],
      diarrhea: true,
      hives: true,
      dryMouth: true,
    },
    {
      immunizationId: 21044173,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'M',
      vaccinationTypeCode: 'MACWY',
      reactionTypeCode: 'M',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044174,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044175,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 21044176,
          reactionTypeCode: 'DM',
        },
        {
          immunizationReactionId: 21044177,
          reactionTypeCode: 'LBP',
        },
      ],
      lowBloodPressure: true,
      drowsiness: true,
      diarrhea: true,
      dryMouth: true,
    },
    {
      immunizationId: 21044178,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'M',
      vaccinationTypeCode: 'MENB',
      reactionTypeCode: 'DPHRS',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044179,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21044180,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044181,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 21044182,
          reactionTypeCode: 'DM',
        },
        {
          immunizationReactionId: 21044183,
          reactionTypeCode: 'DRNS',
        },
        {
          immunizationReactionId: 21044184,
          reactionTypeCode: 'LBP',
        },
        {
          immunizationReactionId: 21044185,
          reactionTypeCode: 'RSH',
        },
      ],
      chills: true,
      lowBloodPressure: true,
      drowsiness: true,
      diarrhea: true,
      dryMouth: true,
      dryNose: true,
      rash: true,
    },
    {
      immunizationId: 21044186,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'H',
      vaccinationTypeCode: 'MPS',
      reactionTypeCode: 'N',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044187,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044188,
          reactionTypeCode: 'DM',
        },
        {
          immunizationReactionId: 21044189,
          reactionTypeCode: 'NSAVMT',
        },
      ],
      nausea: true,
      diarrhea: true,
      dryMouth: true,
    },
    {
      immunizationId: 21044192,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'H',
      vaccinationTypeCode: 'PLQ',
      reactionTypeCode: 'S',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044193,
          reactionTypeCode: 'DRNS',
        },
        {
          immunizationReactionId: 21044194,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21044195,
          reactionTypeCode: 'NSAVMT',
        },
      ],
      nausea: true,
      hives: true,
      dryNose: true,
    },
    {
      immunizationId: 21044206,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'P',
      reactionTypeCode: 'VB',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044207,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 21044208,
          reactionTypeCode: 'DM',
        },
        {
          immunizationReactionId: 21044209,
          reactionTypeCode: 'DRNS',
        },
        {
          immunizationReactionId: 21044210,
          reactionTypeCode: 'LBP',
        },
        {
          immunizationReactionId: 21044211,
          reactionTypeCode: 'NSAVMT',
        },
        {
          immunizationReactionId: 21044212,
          reactionTypeCode: 'RSH',
        },
      ],
      lowBloodPressure: true,
      drowsiness: true,
      nausea: true,
      dryMouth: true,
      dryNose: true,
      rash: true,
    },
    {
      immunizationId: 21044214,
      dateReceived: '2022-06-29',
      vaccinationTypeCode: 'PCV13',
      reactionTypeCode: 'MPTNC',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044215,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21044216,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21044217,
          reactionTypeCode: 'IWE',
        },
        {
          immunizationReactionId: 21044218,
          reactionTypeCode: 'LBP',
        },
      ],
      chills: true,
      itchingWateryEyes: true,
      lowBloodPressure: true,
      hives: true,
    },
    {
      immunizationId: 21044235,
      dateReceived: '2022-06-29',
      vaccinationTypeCode: 'RBS',
      reactionTypeCode: 'LPC',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044236,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21044237,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 21044238,
          reactionTypeCode: 'DM',
        },
        {
          immunizationReactionId: 21044239,
          reactionTypeCode: 'DRNS',
        },
        {
          immunizationReactionId: 21044240,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21044241,
          reactionTypeCode: 'IWE',
        },
        {
          immunizationReactionId: 21044242,
          reactionTypeCode: 'LBP',
        },
        {
          immunizationReactionId: 21044243,
          reactionTypeCode: 'RSH',
        },
      ],
      chills: true,
      itchingWateryEyes: true,
      lowBloodPressure: true,
      drowsiness: true,
      hives: true,
      dryMouth: true,
      dryNose: true,
      rash: true,
    },
    {
      immunizationId: 21044226,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'H',
      vaccinationTypeCode: 'POP',
      reactionTypeCode: 'PN',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044227,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044228,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 21044229,
          reactionTypeCode: 'LBP',
        },
      ],
      lowBloodPressure: true,
      drowsiness: true,
      diarrhea: true,
    },
    {
      immunizationId: 21044230,
      dateReceived: '2022-06-29',
      vaccinationTypeCode: 'PPSV23',
      reactionTypeCode: 'SNS',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044232,
          reactionTypeCode: 'LBP',
        },
        {
          immunizationReactionId: 21044233,
          reactionTypeCode: 'NSAVMT',
        },
        {
          immunizationReactionId: 21044231,
          reactionTypeCode: 'DRRHA',
        },
      ],
      lowBloodPressure: true,
      nausea: true,
      diarrhea: true,
    },
    {
      immunizationId: 21044244,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'RTVRS',
      reactionTypeCode: 'MI',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044245,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044246,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21044247,
          reactionTypeCode: 'NSAVMT',
        },
      ],
      nausea: true,
      diarrhea: true,
      hives: true,
    },
    {
      immunizationId: 21044256,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'H',
      vaccinationTypeCode: 'RGM',
      reactionTypeCode: 'F',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044257,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044258,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 21044259,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21044260,
          reactionTypeCode: 'NSAVMT',
        },
      ],
      drowsiness: true,
      nausea: true,
      diarrhea: true,
      hives: true,
    },
    {
      immunizationId: 21044262,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'RM',
      reactionTypeCode: 'N',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044263,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044264,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 21044265,
          reactionTypeCode: 'DRNS',
        },
        {
          immunizationReactionId: 21044266,
          reactionTypeCode: 'NSAVMT',
        },
        {
          immunizationReactionId: 21044267,
          reactionTypeCode: 'RSH',
        },
      ],
      drowsiness: true,
      nausea: true,
      diarrhea: true,
      dryNose: true,
      rash: true,
    },
    {
      immunizationId: 21044271,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'RZV',
      reactionTypeCode: 'LCD',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044272,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21044273,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21044274,
          reactionTypeCode: 'IWE',
        },
        {
          immunizationReactionId: 21044275,
          reactionTypeCode: 'NSAVMT',
        },
      ],
      chills: true,
      itchingWateryEyes: true,
      nausea: true,
      hives: true,
    },
    {
      immunizationId: 21044278,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'H',
      vaccinationTypeCode: 'RZV2',
      reactionTypeCode: 'DPLP',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044279,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21044280,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 21044281,
          reactionTypeCode: 'DRNS',
        },
        {
          immunizationReactionId: 21044282,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21044283,
          reactionTypeCode: 'LBP',
        },
        {
          immunizationReactionId: 21044284,
          reactionTypeCode: 'RSH',
        },
      ],
      chills: true,
      lowBloodPressure: true,
      drowsiness: true,
      hives: true,
      dryNose: true,
      rash: true,
    },
    {
      immunizationId: 21044288,
      dateReceived: '2022-06-29',
      vaccinationTypeCode: 'S',
      reactionTypeCode: 'HDCH',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044289,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21044290,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044291,
          reactionTypeCode: 'IWE',
        },
        {
          immunizationReactionId: 21044292,
          reactionTypeCode: 'NSAVMT',
        },
      ],
      chills: true,
      itchingWateryEyes: true,
      nausea: true,
      diarrhea: true,
    },
    {
      immunizationId: 21044293,
      dateReceived: '2022-06-29',
      vaccinationTypeCode: 'TT',
      reactionTypeCode: 'DT',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044294,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044295,
          reactionTypeCode: 'DRNS',
        },
        {
          immunizationReactionId: 21044296,
          reactionTypeCode: 'IWE',
        },
        {
          immunizationReactionId: 21044297,
          reactionTypeCode: 'RSH',
        },
      ],
      itchingWateryEyes: true,
      diarrhea: true,
      dryNose: true,
      rash: true,
    },
    {
      immunizationId: 21044298,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'TD',
      reactionTypeCode: 'P',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044299,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21044300,
          reactionTypeCode: 'DRNS',
        },
        {
          immunizationReactionId: 21044301,
          reactionTypeCode: 'IWE',
        },
        {
          immunizationReactionId: 21044302,
          reactionTypeCode: 'RSH',
        },
      ],
      chills: true,
      itchingWateryEyes: true,
      dryNose: true,
      rash: true,
    },
    {
      immunizationId: 21044305,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'M',
      vaccinationTypeCode: 'TD2',
      reactionTypeCode: 'NM',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044306,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 21044307,
          reactionTypeCode: 'DM',
        },
        {
          immunizationReactionId: 21044308,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21044309,
          reactionTypeCode: 'LBP',
        },
      ],
      lowBloodPressure: true,
      drowsiness: true,
      hives: true,
      dryMouth: true,
    },
    {
      immunizationId: 21044312,
      dateReceived: '2022-06-29',
      vaccinationTypeCode: 'TDAP',
      reactionTypeCode: 'SD',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044314,
          reactionTypeCode: 'NSAVMT',
        },
        {
          immunizationReactionId: 21044313,
          reactionTypeCode: 'DRRHA',
        },
      ],
      nausea: true,
      diarrhea: true,
    },
    {
      immunizationId: 21044318,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'H',
      vaccinationTypeCode: 'YPHD',
      reactionTypeCode: 'FVR',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044319,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21044320,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 21044321,
          reactionTypeCode: 'DM',
        },
        {
          immunizationReactionId: 21044322,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21044323,
          reactionTypeCode: 'IWE',
        },
        {
          immunizationReactionId: 21044324,
          reactionTypeCode: 'LBP',
        },
      ],
      chills: true,
      itchingWateryEyes: true,
      lowBloodPressure: true,
      diarrhea: true,
      hives: true,
      dryMouth: true,
    },
    {
      immunizationId: 21044327,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'H',
      vaccinationTypeCode: 'YPHS',
      reactionTypeCode: 'C',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044328,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21044329,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 21044330,
          reactionTypeCode: 'DM',
        },
      ],
      chills: true,
      drowsiness: true,
      dryMouth: true,
    },
    {
      immunizationId: 21044331,
      dateReceived: '2022-06-29',
      vaccinationTypeCode: 'VAR',
      reactionTypeCode: 'THTSS',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044332,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21044333,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21044334,
          reactionTypeCode: 'LBP',
        },
        {
          immunizationReactionId: 21044335,
          reactionTypeCode: 'NSAVMT',
        },
        {
          immunizationReactionId: 21044336,
          reactionTypeCode: 'RSH',
        },
      ],
      chills: true,
      lowBloodPressure: true,
      nausea: true,
      hives: true,
      rash: true,
    },
    {
      immunizationId: 21044337,
      dateReceived: '2022-06-29',
      vaccinationMethod: 'M',
      vaccinationTypeCode: 'YF',
      reactionTypeCode: 'V',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21044338,
          reactionTypeCode: 'DRNS',
        },
        {
          immunizationReactionId: 21044339,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 21044340,
          reactionTypeCode: 'IWE',
        },
        {
          immunizationReactionId: 21044341,
          reactionTypeCode: 'RSH',
        },
      ],
      itchingWateryEyes: true,
      hives: true,
      dryNose: true,
      rash: true,
    },
    {
      immunizationId: 21040393,
      dateReceived: '2022-06-28',
      comments: 'duplicate test ',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'A',
      otherVaccine: 'duplicate test ',
      reactionTypeCode: 'W',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21040394,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21040395,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 21040396,
          reactionTypeCode: 'IWE',
        },
        {
          immunizationReactionId: 21040397,
          reactionTypeCode: 'LBP',
        },
      ],
      chills: true,
      itchingWateryEyes: true,
      lowBloodPressure: true,
      drowsiness: true,
    },
    {
      immunizationId: 20607426,
      dateReceived: '2022-02-18',
      comments: 'test, test ',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'HB',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21142246,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21142247,
          reactionTypeCode: 'IWE',
        },
        {
          immunizationReactionId: 21142248,
          reactionTypeCode: 'LBP',
        },
      ],
      chills: true,
      itchingWateryEyes: true,
      lowBloodPressure: true,
    },
    {
      immunizationId: 20607436,
      dateReceived: '2022-02-18',
      comments: 'test',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'HB',
      reactionTypeCode: 'RTHM',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21142249,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21142250,
          reactionTypeCode: 'DRNS',
        },
        {
          immunizationReactionId: 21142251,
          reactionTypeCode: 'IWE',
        },
        {
          immunizationReactionId: 21142252,
          reactionTypeCode: 'LBP',
        },
      ],
      chills: true,
      itchingWateryEyes: true,
      lowBloodPressure: true,
      dryNose: true,
    },
    {
      immunizationId: 20607430,
      dateReceived: '2022-02-18',
      comments: 'test',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'HEPB',
      reactionTypeCode: 'RTHM',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 21142253,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 21142254,
          reactionTypeCode: 'IWE',
        },
        {
          immunizationReactionId: 21142255,
          reactionTypeCode: 'LBP',
        },
        {
          immunizationReactionId: 21142256,
          reactionTypeCode: 'RSH',
        },
      ],
      chills: true,
      itchingWateryEyes: true,
      lowBloodPressure: true,
      rash: true,
    },
    {
      immunizationId: 20208039,
      dateReceived: '2021-09-14',
      comments: 'test',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'COVD19',
      otherVaccine: 'moderna ',
      reactionTypeCode: 'V',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 20208040,
          reactionTypeCode: 'HLS',
        },
      ],
      chills: true,
    },
    {
      immunizationId: 19439602,
      dateReceived: '2021-02-12',
      comments: 'February 2021 Release regression',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'COVD19',
      otherVaccine: 'dose 1',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 19439603,
          reactionTypeCode: 'HLS',
        },
      ],
      chills: true,
    },
    {
      immunizationId: 18918201,
      dateReceived: '2020-12-03',
      comments: 'MHV9231 Regression ',
      vaccinationTypeCode: 'RGM',
      otherVaccine: 'MHV9231 Regression ',
      reactionTypeCode: 'OI',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 18918202,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 18918203,
          reactionTypeCode: 'HVS',
        },
      ],
      diarrhea: true,
      hives: true,
    },
    {
      immunizationId: 18724980,
      dateReceived: '2020-11-16',
      comments: 'November Release regression 2020',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'FLU',
      reactionTypeCode: 'PN',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 18724981,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 18724982,
          reactionTypeCode: 'IWE',
        },
      ],
      chills: true,
      itchingWateryEyes: true,
    },
    {
      immunizationId: 18677248,
      dateReceived: '2020-11-10',
      comments: 'MHV-8646 mhv-np-user-api Regression Test in SysTest',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'MPS',
      reactionTypeCode: 'SMNLN',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 18677249,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 18677250,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 18677251,
          reactionTypeCode: 'IWE',
        },
        {
          immunizationReactionId: 18677252,
          reactionTypeCode: 'LBP',
        },
      ],
      chills: true,
      itchingWateryEyes: true,
      lowBloodPressure: true,
      drowsiness: true,
    },
    {
      immunizationId: 17698731,
      dateReceived: '2020-07-24',
      comments: '2020.1.5.0 Release Regression ',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'OTHER',
      otherVaccine: 'COVID 19',
      reactionTypeCode: 'SL',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 17698732,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 17698733,
          reactionTypeCode: 'DM',
        },
      ],
      chills: true,
      dryMouth: true,
    },
    {
      immunizationId: 16979917,
      dateReceived: '2020-04-14',
      comments: 'April release Regression test 2020',
      vaccinationMethod: 'H',
      vaccinationTypeCode: 'MLR',
      userprofileId: 15176497,
      reactions: [],
    },
    {
      immunizationId: 16956749,
      dateReceived: '2020-04-03',
      comments: 'April release regression ',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'MR',
      otherVaccine: 'test ',
      reactionTypeCode: 'NZNG',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 16956750,
          reactionTypeCode: 'DRRHA',
        },
        {
          immunizationReactionId: 16956751,
          reactionTypeCode: 'DRWSNS',
        },
        {
          immunizationReactionId: 16956752,
          reactionTypeCode: 'DM',
        },
        {
          immunizationReactionId: 16956753,
          reactionTypeCode: 'HVS',
        },
        {
          immunizationReactionId: 16956754,
          reactionTypeCode: 'IWE',
        },
        {
          immunizationReactionId: 16956755,
          reactionTypeCode: 'LBP',
        },
        {
          immunizationReactionId: 16956756,
          reactionTypeCode: 'NSAVMT',
        },
      ],
      itchingWateryEyes: true,
      lowBloodPressure: true,
      drowsiness: true,
      nausea: true,
      diarrhea: true,
      hives: true,
      dryMouth: true,
    },
    {
      immunizationId: 16453498,
      dateReceived: '2019-12-03',
      comments: 'December release regression ',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'FLU',
      reactionTypeCode: 'PN',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 16453499,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 16453500,
          reactionTypeCode: 'RSH',
        },
      ],
      chills: true,
      rash: true,
    },
    {
      immunizationId: 16219164,
      dateReceived: '2019-11-05',
      comments: 'November release regression 11/05/2019',
      vaccinationMethod: 'J',
      vaccinationTypeCode: 'HB',
      reactionTypeCode: 'ST',
      userprofileId: 15176497,
      reactions: [
        {
          immunizationReactionId: 16219165,
          reactionTypeCode: 'HLS',
        },
        {
          immunizationReactionId: 16219166,
          reactionTypeCode: 'RSH',
        },
      ],
      chills: true,
      rash: true,
    },
  ],
};

module.exports = vaccines;

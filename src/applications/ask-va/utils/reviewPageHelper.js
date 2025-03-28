export const setupPages = formConfig => {
  const chapterKeys = Object.keys(formConfig?.chapters || {});
  const chapterTitles = Object.values(formConfig?.chapters || {}).map(
    value => value.title,
  );

  const getChapterPagesFromChapterIndex = chapterIndex => {
    const chapterKey = chapterKeys[chapterIndex];
    const chapter = formConfig.chapters[chapterKey];

    return Object.keys(chapter.pages || {}).map((page, index) => {
      const pg = Array.isArray(chapter.pages[page])
        ? chapter.pages[page][0]
        : chapter.pages[page];

      const { title, path, review, editModeOnReviewPage } = pg;

      return {
        chapterIndex,
        pageIndex: index,
        title,
        review,
        path: `/${path}`,
        editModeOnReviewPage,
        key: page,
        chapterTitle: chapter.title,
      };
    });
  };

  const allPages = Object.keys(formConfig?.chapters || {}).reduce(
    (pages, chapter, index) => {
      const pagesInChapter = getChapterPagesFromChapterIndex(index);
      return pages.concat(pagesInChapter);
    },
    [],
  );

  const findPageFromPath = path =>
    allPages.find(page => {
      const pagePath = page.path.includes('/:index')
        ? page.path.replace('/:index', '/')
        : page.path;
      return path.includes(pagePath);
    }) || { chapterIndex: 0 };

  return {
    chapterKeys,
    chapterTitles,
    allPages,
    getChapterPagesFromChapterIndex,
    findPageFromPath,
  };
};

export const getPageKeysForReview = config => {
  const pages = Object.entries(config.chapters) || [];
  const titles = pages.map(item => Object.keys(item[1].pages));
  return titles.flat();
};

export function createPageListByChapterAskVa(formConfig, pagesToMoveConfig) {
  const pagesByChapter = {};
  const modifiedFormConfig = {
    chapters: {},
  };

  // Process each chapter in pagesToMoveConfig
  Object.keys(pagesToMoveConfig).forEach(targetChapter => {
    if (!pagesByChapter[targetChapter]) {
      pagesByChapter[targetChapter] = [];
      modifiedFormConfig.chapters[targetChapter] = {
        pages: {},
        expandedPages: [],
      };
    }

    pagesToMoveConfig[targetChapter].forEach(pageKey => {
      Object.keys(formConfig.chapters).forEach(chapterKey => {
        const chapter = formConfig.chapters[chapterKey];
        if (chapter.pages && chapter.pages[pageKey]) {
          const page = {
            ...chapter.pages[pageKey],
            pageKey,
            chapterKey: targetChapter,
          };

          pagesByChapter[targetChapter].push(page);
          modifiedFormConfig.chapters[targetChapter].pages[pageKey] = page;
          modifiedFormConfig.chapters[targetChapter].expandedPages.push(page);
        }
      });
    });
  });

  // Extra check for dupes
  Object.keys(pagesByChapter).forEach(chapter => {
    pagesByChapter[chapter] = Array.from(
      new Map(
        pagesByChapter[chapter].map(page => [page.pageKey, page]),
      ).values(),
    );

    modifiedFormConfig.chapters[chapter].pages = Array.from(
      new Map(
        Object.entries(modifiedFormConfig.chapters[chapter].pages),
      ).values(),
    ).reduce((acc, page) => {
      acc[page.pageKey] = page;
      return acc;
    }, {});

    modifiedFormConfig.chapters[chapter].expandedPages = Array.from(
      new Map(
        modifiedFormConfig.chapters[chapter].expandedPages.map(page => [
          page.pageKey,
          page,
        ]),
      ).values(),
    );
  });

  return { pagesByChapter, modifiedFormConfig };
}

export function getChapterFormConfigAskVa(modifiedFormConfig, chapterName) {
  const chapterFormConfig = modifiedFormConfig.chapters[chapterName];
  if (!chapterFormConfig) {
    throw new Error(`Chapter "${chapterName}" does not exist in formConfig.`);
  }

  return chapterFormConfig;
}

export const removeDuplicatesByChapterAndPageKey = array => {
  const seen = new Set();

  return array.filter(item => {
    const uniqueKey = `${item.chapterKey}-${item.pageKey}`;

    if (seen.has(uniqueKey)) {
      return false;
    }

    seen.add(uniqueKey);
    return true;
  });
};

export const pagesToMoveConfig = {
  categoryTopics: [
    'selectCategory',
    'selectTopic',
    'selectSubtopic',
    'whoIsYourQuestionAbout',
  ],
  relationshipToTheVeteran: [
    'relationshipToVeteran',
    'moreAboutYourRelationshipToVeteran_aboutmyselfrelationshipfamilymember',
    'aboutYourRelationshipToFamilyMember_aboutsomeoneelserelationshipveteran',
    'isQuestionAboutVeteranOrSomeoneElse_aboutsomeoneelserelationshipfamilymember',
    'theirRelationshipToVeteran_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
    'yourRole_aboutsomeoneelserelationshipconnectedthroughwork',
    'yourRole_aboutsomeoneelserelationshipconnectedthroughworkeducation',
    'theirVREInformation_aboutsomeoneelserelationshipveteran',
    'theirVRECounselor_aboutsomeoneelserelationshipveteran',
  ],
  veteransPersonalInformation: [
    'aboutTheVeteran_aboutmyselfrelationshipfamilymember',
    'aboutTheVeteran_aboutsomeoneelserelationshipconnectedthroughwork',
    'aboutTheVeteran_aboutsomeoneelserelationshipfamilymember',
    'aboutTheVeteran_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
    'aboutTheVeteran_aboutsomeoneelserelationshipfamilymemberaboutveteran',
  ],
  veteransInformation: [
    'dateOfDeath_aboutmyselfrelationshipfamilymember',
    'dateOfDeath_aboutsomeoneelserelationshipconnectedthroughwork',
    'veteransLocationOfResidence_aboutsomeoneelserelationshipconnectedthroughwork',
    'veteransPostalCode_aboutsomeoneelserelationshipconnectedthroughwork',
    'dateOfDeath_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
    'dateOfDeath_aboutsomeoneelserelationshipfamilymemberaboutveteran',
    'veteransLocationOfResidence_aboutsomeoneelserelationshipfamilymemberaboutveteran',
    'veteransPostalCode_aboutsomeoneelserelationshipfamilymemberaboutveteran',
    'theirVREInformation_aboutsomeoneelserelationshipfamilymemberaboutveteran',
    'theirVRECounselor_aboutsomeoneelserelationshipfamilymemberaboutveteran',
    'theirVREInformation_aboutsomeoneelserelationshipconnectedthroughwork',
    'theirVRECounselor_aboutsomeoneelserelationshipconnectedthroughwork',
  ],
  familyMembersPersonalInformation: [
    'aboutYourFamilyMember_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
    'aboutYourFamilyMember_aboutsomeoneelserelationshipveteran',
  ],
  familyMembersInformation: [
    // 'aboutYourselfRelationshipFamilyMember_aboutmyselfrelationshipfamilymember',
    'familyMembersLocationOfResidence_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
    'familyMembersPostalCode_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
    'familyMembersLocationOfResidence_aboutsomeoneelserelationshipveteran',
    'familyMembersPostalCode_aboutsomeoneelserelationshipveteran',
    'theirVREInformation_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
    'theirVRECounselor_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
  ],
  yourInformation: [
    'aboutYourselfRelationshipFamilyMember_aboutmyselfrelationshipfamilymember',
    'aboutYourself_aboutmyselfrelationshipveteran',
    'aboutYourself_aboutsomeoneelserelationshipconnectedthroughwork',
    'aboutYourself_aboutsomeoneelserelationshipconnectedthroughworkeducation',
    'aboutYourselfRelationshipFamilyMember_aboutsomeoneelserelationshipfamilymemberaboutveteran',
    'aboutYourself_aboutsomeoneelserelationshipveteran',
    'aboutYourself_aboutsomeoneelserelationshipveteranorfamilymembereducation',
    'aboutYourselfGeneral_generalquestion',
  ],
  yourLocationOfResidence: [
    'yourLocationOfResidence_aboutmyselfrelationshipfamilymember',
    'yourLocationOfResidence_aboutmyselfrelationshipveteran',
    'yourLocationOfResidence_generalquestion',
  ],
  yourPostalCode: [
    'yourPostalCode_aboutmyselfrelationshipfamilymember',
    'yourPostalCode_aboutmyselfrelationshipveteran',
    'yourPostalCode_generalquestion',
  ],
  yourBranchOfService: [
    'yourBranchOfService_aboutsomeoneelserelationshipveteran',
    'yourBranchOfService_aboutmyselfrelationshipveteran',
  ],
  yourVAHealthFacility: [
    'yourVAHealthFacility_aboutmyselfrelationshipfamilymember',
    'yourVAHealthFacility_aboutmyselfrelationshipveteran',
    'yourVAHealthFacility_aboutsomeoneelserelationshipconnectedthroughwork',
    'yourVAHealthFacility_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
    'yourVAHealthFacility_aboutsomeoneelserelationshipfamilymemberaboutveteran',
    'yourVAHealthFacility_aboutsomeoneelserelationshipveteran',
    'yourVAHealthFacility_generalquestion',
  ],
  stateOfProperty: [
    'stateOfProperty_aboutmyselfrelationshipveteran',
    'stateOfProperty_aboutmyselfrelationshipfamilymember',
    'stateOfProperty_aboutsomeoneelserelationshipveteran',
    'stateOfProperty_aboutsomeoneelserelationshipfamilymemberaboutveteran',
    'stateOfProperty_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
    'stateOfProperty_aboutsomeoneelserelationshipconnectedthroughwork',
    'stateOfProperty_generalquestion',
  ],
  yourVREInformation: [
    'yourVREInformation_aboutmyselfrelationshipveteran',
    'yourVRECounselor_aboutmyselfrelationshipveteran',
    'yourVREInformation_aboutmyselfrelationshipfamilymember',
    'yourVRECounselor_aboutmyselfrelationshipfamilymember',
    'yourVREInformation_generalquestion',
    'yourVRECounselor_generalquestion',
  ],
  schoolInformation: [
    'searchSchools_aboutmyselfrelationshipveteran',
    'useThisSchool_aboutmyselfrelationshipveteran',
    'schoolInYourProfile_aboutmyselfrelationshipveteran',
    'searchSchools_aboutmyselfrelationshipfamilymember',
    'useThisSchool_aboutmyselfrelationshipfamilymember',
    'schoolInYourProfile_aboutmyselfrelationshipfamilymember',
    'searchSchools_aboutsomeoneelserelationshipconnectedthroughworkeducation',
    'schoolInYourProfile_aboutsomeoneelserelationshipconnectedthroughworkeducation',
    'stateOfFacility_aboutsomeoneelserelationshipconnectedthroughworkeducation',
    'stateOfSchool_aboutsomeoneelserelationshipconnectedthroughworkeducation',
    'schoolStOrResidency_aboutsomeoneelserelationshipveteranorfamilymembereducation',
    // 'useThisSchool_aboutsomeoneelserelationshipconnectedthroughworkeducation',
  ],
  yourContactInformation: [
    'yourContactInformation_aboutmyselfrelationshipfamilymember',
    'yourContactInformation_aboutmyselfrelationshipveteran',
    'yourContactInformation_aboutsomeoneelserelationshipconnectedthroughwork',
    'yourContactInformation_aboutsomeoneelserelationshipconnectedthroughworkeducation',
    'yourContactInformation_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
    'yourContactInformation_aboutsomeoneelserelationshipveteran',
    'yourContactInformation_aboutsomeoneelserelationshipfamilymemberaboutveteran',
    'yourContactInformation_aboutsomeoneelserelationshipveteranorfamilymembereducation',
    'yourContactInformation_generalquestion',
  ],
  yourMailingAddress: [
    'yourMailingAddress_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
    'yourMailingAddress_aboutmyselfrelationshipfamilymember',
    'yourMailingAddress_aboutmyselfrelationshipveteran',
    'yourMailingAddress_aboutsomeoneelserelationshipconnectedthroughwork',
    'yourMailingAddress_aboutsomeoneelserelationshipfamilymemberaboutveteran',
    'yourMailingAddress_aboutsomeoneelserelationshipveteran',
    'yourMailingAddress_generalquestion',
  ],
  yourQuestion: ['question'],
};

export const chapterTitles = {
  categoryTopics: '',
  relationshipToTheVeteran: '',
  veteransPersonalInformation: "Veteran's personal information",
  veteransInformation: '',
  familyMembersPersonalInformation: "Family member's personal information",
  familyMembersInformation: '',
  yourInformation: 'Your information',
  yourLocationOfResidence: '',
  yourPostalCode: 'Your postal code',
  yourBranchOfService: '',
  yourVAHealthFacility: 'Your VA health facility',
  stateOfProperty: 'Your state of property',
  yourVREInformation: 'Your VR&E information',
  schoolInformation: 'Your school information',
  yourContactInformation: 'Your contact information',
  yourMailingAddress: 'Your mailing address',
  yourQuestion: 'Your question',
};

// Checking aboutTheFamilyMember and aboutTheVeteran objects for valid values
export const hasValidValues = obj => {
  if (typeof obj !== 'object' || obj === null) return false;

  return Object.values(obj).some(value => {
    if (value !== undefined && value !== null) {
      return typeof value === 'object' ? hasValidValues(value) : true;
    }
    return false;
  });
};

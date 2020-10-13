const introTextTrait = `
fieldIntroTextLimitedHtml {
  processed
}
`;

const categoriesTrait = `
fieldPrimaryCategory {
  entity {
    ... on TaxonomyTermLcCategories {
      name
    }
  }
}
fieldOtherCategories {
  entity {
    ... on TaxonomyTermLcCategories {
      name
    }
  }
}
`;

module.exports = `
resourceAndSupportArticleListings: nodeQuery(filter: {
  conditions: [{
      field: "type",
      operator: IN
      value: [
        "step_by_step",
        "faq_multiple_q_a",
        "q_a",
        "checklist",
        "media_list_images",
        "media_list_videos",
        "support_resources_detail_page"
      ]
    },
    {
      field: "status",
      value: ["1"],
      enabled: false # $onlyPublishedContent
    }
  ]
  }, limit: 10000) {
  entities {

    ... on Node {
      title
      entityBundle
      entityUrl {
        ... on EntityCanonicalUrl {
          path
        }
      }
    }

    ... on NodeStepByStep {
      ${introTextTrait}
      ${categoriesTrait}
    }
    ... on NodeFaqMultipleQA {
      ${introTextTrait}
      ${categoriesTrait}
    }
    ... on NodeQA {
      fieldAnswer {
        entity {
          ... wysiwyg
        }
      }
      ${categoriesTrait}
    }
    ... on NodeChecklist {
      ${introTextTrait}
      ${categoriesTrait}
    }
    ... on NodeMediaListImages {
      ${introTextTrait}
      ${categoriesTrait}
    }
    ... on NodeMediaListVideos {
      ${introTextTrait}
      ${categoriesTrait}
    }
    ... on NodeSupportResourcesDetailPage {
      ${introTextTrait}
      ${categoriesTrait}
    }
  }
}
`;

const categoriesTrait = `
fieldIntroTextLimitedHtml {
  processed
}
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
    # Basics about the page
    ... on Node {
      title
      entityBundle
      entityUrl {
        ... on EntityCanonicalUrl {
          path
        }
      }
    }

    ... on NodeStepByStep { ${categoriesTrait} }
    ... on NodeFaqMultipleQA { ${categoriesTrait} }
    ... on NodeQA { ${categoriesTrait} }
    ... on NodeChecklist { ${categoriesTrait} }
    ... on NodeMediaListImages { ${categoriesTrait} }
    ... on NodeMediaListVideos { ${categoriesTrait} }
    ... on NodeSupportResourcesDetailPage { ${categoriesTrait} }
  }
}
`;

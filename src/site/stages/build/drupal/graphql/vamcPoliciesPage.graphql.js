const policiesPageFragment = `
  fragment policiesPageFragment on NodeVamcSystemPoliciesPage {
    title
    status
    entityBundle
    entityUrl {
      path
    }    
    fieldCcIntroText {
      fetched
      fetchedBundle
    }
    fieldCcTopOfPageContent {
      fetched
      fetchedBundle    
    }
    fieldVamcVisitationPolicy {
      processed
    }
    fieldVamcOtherPolicies {
      processed
    }
    fieldCcGenVisitationPolicy {
      fetched
      fetchedBundle        
    }
    fieldCcBottomOfPageContent {
      fetched
      fetchedBundle        
    }
    fieldOffice {
      entity {
        ...on NodeHealthCareRegionPage {
          entityLabel
          title
        }
      }
    }    
  }
`;

const GetPolicyPages = `
  ${policiesPageFragment}
  
query GetPolicyPages($onlyPublishedContent: Boolean!) {
    nodeQuery(limit: 500, filter: {
      conditions: [
        { field: "status", value: ["1"], enabled: $onlyPublishedContent },      
        { field: "type", value: ["vamc_system_policies_page"] }
      ]
    }) {
      entities {
        ... policiesPageFragment
      }
    }
  }
`;

module.exports = {
  fragment: policiesPageFragment,
  GetPolicyPages,
};

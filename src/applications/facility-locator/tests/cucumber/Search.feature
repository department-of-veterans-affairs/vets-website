Feature: Search functionality

  Scenario: Searching for All VA Health Facilities
    Given I am on the facility locator
    When I fill the search input with "New York" as the location
    And I click on the search button
    Then I see Results for "VA health" near  "New York, New York"
    And I select the first one on the list
    Then I can see basic information about the facility

  Scenario: Searching for All VA Benefits Facilities
    Given I am on the facility locator
    And I select "VA benefits" from the facilities options
    When I fill the search input with "TX, 78717" as the location
    And I click on the search button
    Then I see Results for "VA benefits" near  "Austin, Texas 78717"
    And I select the first one on the list
    Then I can see basic information about the facility

  Scenario: Searching for All VA cemeteries
    Given I am on the facility locator
    And I select "VA cemeteries" from the facilities options
    When I fill the search input with "Washington DC" as the location
    And I click on the search button
    Then I see Results for "VA cemeteries" near  "Washington, District of Columbia
    And I select the first one on the list
    Then I can see some information

  Scenario: Searching for All Vet Centers
    Given I am on the facility locator
    And I select "Vet Centers" from the facilities options
    When I fill the search input with "13926 Turkey Hollow Trail, Austin, Texas 78717, United States" as the location
    And I click on the search button
    Then I see Results for "Vet Centers" near  "78717"
    And I select the first one on the list
    Then I can see basic information about the facility


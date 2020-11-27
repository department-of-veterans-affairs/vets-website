/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    path: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          alias: { type: 'string' },
          langcode: { type: 'string' },
          pathauto: { type: 'number' },
        },
        required: ['alias', 'langcode', 'pathauto'],
      },
      maxItems: 1,
    },
    metatag: { $ref: 'RawMetaTags' },
    uid: { $ref: 'EntityReferenceArray' },
    title: { $ref: 'GenericNestedString' },
    changed: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: { type: 'string' },
          format: { type: 'string' },
        },
        required: ['value', 'format'],
      },
      maxItems: 1,
    },
    fieldAlertSingle: {
      type: ['object', 'null'],
      properties: {
        entity: {
          type: 'object',
          properties: {
            entityId: { type: 'string' },
            fieldAlertSelection: { type: 'string' },
            fieldAlertNonReusableRef: { type: 'boolean' },
            fieldAlertBlockReference: {
              type: ['object', 'null'],
              properties: {
                entity: {
                  type: ['object', 'null'],
                  properties: {
                    entityId: { type: 'string' },
                    fieldAlertTitle: { type: 'string' },
                    fieldAlertType: { type: 'string' },
                    fieldReusability: { type: 'string' },
                    fieldAlertContent: {
                      type: ['object', 'null'],
                      properties: {
                        entity: {
                          type: ['object', 'null'],
                          properties: {
                            entityId: { type: 'string' },
                            entityBundle: { type: 'string' },
                            fieldWysiwyg: {
                              type: ['object', 'null'],
                              properties: {
                                processed: { type: 'string' },
                              },
                              required: ['processed'],
                            },
                          },
                          required: [
                            'entityId',
                            'entityBundle',
                            'fieldWysiwyg',
                          ],
                        },
                      },
                      required: ['entity'],
                    },
                  },
                  required: [
                    'entityId',
                    'fieldAlertTitle',
                    'fieldAlertType',
                    'fieldReusability',
                    'fieldAlertContent',
                  ],
                },
              },
              required: ['entity'],
            },
          },
          required: [
            'entityId',
            'fieldAlertSelection',
            'fieldAlertNonReusableRef',
            'fieldAlertBlockReference',
          ],
        },
      },
      required: ['entity'],
    },
    fieldButtons: {
      type: ['array', 'null'],
      items: {
        properties: {
          entityId: { type: 'string' },
          entityBundle: { type: 'string' },
          fieldButtonLabel: { type: 'string' },
          fieldButtonLink: {
            type: ['object', 'null'],
            properties: {
              url: {
                type: 'object',
                properties: {
                  path: { type: 'string' },
                },
                required: ['path'],
              },
            },
            required: ['url'],
          },
        },
        required: [
          'entityId',
          'entityBundle',
          'fieldButtonLabel',
          'fieldButtonLink',
        ],
      },
    },
    fieldButtonsRepeat: { type: 'boolean' },
    fieldContactInformation: {
      type: ['object', 'null'],
      properties: {
        entity: {
          type: ['object', 'null'],
          properties: {
            entityBundle: { type: 'string' },
            fieldBenefitHubContacts: {
              type: ['object', 'null'],
              properties: {
                entity: {
                  type: 'object',
                  properties: {
                    fieldHomePageHubLabel: { type: 'string' },
                    fieldSupportServices: {
                      type: ['array', 'null'],
                      items: {
                        entity: {
                          type: 'object',
                          properties: {
                            entityId: { type: 'string' },
                            title: { type: 'string' },
                            fieldLink: {
                              type: ['object', 'null'],
                              properties: {
                                title: { type: 'string' },
                                url: {
                                  type: 'object',
                                  properties: {
                                    path: { type: 'string' },
                                    routed: { type: 'boolean' },
                                  },
                                },
                              },
                            },
                            fieldPhoneNumber: { type: 'string' },
                          },
                        },
                      },
                    },
                    fieldTeaserText: { type: 'string' },
                    path: {
                      type: ['object', 'null'],
                      properties: {
                        alias: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
            fieldContactDefault: {
              type: ['object', 'null'],
              properties: {
                entity: {
                  type: 'object',
                  properties: {
                    entityId: { type: 'string' },
                    title: { type: 'string' },
                    fieldLink: {
                      type: ['object', 'null'],
                      properties: {
                        title: { type: 'string' },
                        url: {
                          type: 'object',
                          properties: {
                            path: { type: 'string' },
                            routed: { type: 'boolean' },
                          },
                        },
                      },
                    },
                    fieldPhoneNumber: { type: 'string' },
                  },
                },
              },
            },
            fieldAdditionalContact: {
              type: ['object', 'null'],
              properties: {
                entity: {
                  type: 'object',
                  properties: {
                    entityBundle: { type: 'string' },
                    fieldEmailAddress: { type: 'string' },
                    fieldEmailLabel: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    fieldIntroTextLimitedHtml: {
      type: ['object', 'null'],
      properties: {
        processed: { type: 'string' },
      },
      required: ['processed'],
    },
    fieldOtherCategories: { type: 'array' },
    fieldPrimaryCategory: {
      type: ['object', 'null'],
      properties: {
        entity: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            entityUrl: {
              type: 'object',
              properties: {
                path: { type: 'string' },
              },
            },
          },
        },
      },
    },
    fieldRelatedBenefitHubs: {
      type: ['array', 'null'],
      items: {
        entity: {
          type: 'object',
          properties: {
            fieldHomePageHubLabel: { type: 'string' },
            fieldSupportServices: {
              type: ['array', 'null'],
              items: {
                entity: {
                  type: 'object',
                  properties: {
                    entityId: { type: 'string' },
                    title: { type: 'string' },
                    fieldLink: {
                      type: ['object', 'null'],
                      properties: {
                        title: { type: 'string' },
                        url: {
                          type: 'object',
                          properties: {
                            path: { type: 'string' },
                            routed: { type: 'boolean' },
                          },
                        },
                      },
                    },
                    fieldPhoneNumber: { type: 'string' },
                  },
                },
              },
            },
            fieldTeaserText: { type: 'string' },
            path: {
              type: ['object', 'null'],
              properties: {
                alias: { type: 'string' },
              },
            },
          },
        },
      },
    },
    fieldRelatedInformation: {
      type: ['object', 'null'],
      properties: {
        entity: {
          type: 'object',
          properties: {
            entityId: { type: 'string' },
            fieldLink: {
              type: ['object', 'null'],
              properties: {
                options: { type: 'array' },
                title: { type: 'string' },
                url: {
                  type: 'object',
                  properties: {
                    path: { type: 'string' },
                  },
                },
              },
            },
            fieldLinkSummary: { type: 'string' },
          },
        },
      },
    },
    fieldSteps: {
      type: ['array', 'null'],
      items: {
        entity: {
          type: 'object',
          properties: {
            fieldSectionHeader: { type: 'string' },
            fieldStep: {
              type: ['array', 'null'],
              properties: {
                entity: {
                  type: 'object',
                  properties: {
                    fieldAlert: {
                      type: ['object', 'null'],
                      properties: {
                        entity: {
                          type: 'object',
                          properties: {
                            entityId: { type: 'string' },
                            fieldAlertSelection: { type: 'string' },
                            // This one isn't being used yet, but will be shortly.
                            fieldAlertNonReusableRef: { type: 'object' },
                            fieldAlertBlockReference: {
                              type: ['object', 'null'],
                              properties: {
                                entity: {
                                  type: 'object',
                                  properties: {
                                    entityId: { type: 'string' },
                                    fieldAlertContent: {
                                      type: ['object', 'null'],
                                      properties: {
                                        entity: {
                                          type: 'object',
                                          properties: {
                                            entityId: { type: 'string' },
                                            entityBundle: { type: 'string' },
                                            fieldWysiwyg: {
                                              type: ['object', 'null'],
                                              properties: {
                                                processed: { type: 'string' },
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                    fieldAlertTitle: { type: 'string' },
                                    fieldAlertType: { type: 'string' },
                                    fieldReusability: { type: 'string' },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    fieldMedia: {
                      type: ['object', 'null'],
                      properties: {
                        entity: {
                          type: 'object',
                          properties: {
                            thumbnail: {
                              type: ['object', 'null'],
                              properties: {
                                alt: { type: 'string' },
                                url: { type: 'string' },
                              },
                            },
                          },
                        },
                      },
                    },
                    fieldWysiwyg: {
                      type: ['object', 'null'],
                      properties: {
                        processed: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    fieldTags: {
      type: ['object', 'null'],
      properties: {
        entity: {
          type: 'object',
          properties: {
            fieldAudienceBeneficiares: {
              type: ['object', 'null'],
              properties: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  entityUrl: {
                    type: ['object', 'null'],
                    properties: {
                      path: { type: 'string' },
                    },
                  },
                },
              },
            },
            fieldTopics: {
              type: ['object', 'null'],
              properties: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  entityUrl: {
                    type: ['object', 'null'],
                    properties: {
                      path: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    // Needed for filtering reverse fields in other transformers
    status: { $ref: 'GenericNestedBoolean' },
  },
  required: [
    'changed',
    'fieldAlertSingle',
    'fieldButtons',
    'fieldButtonsRepeat',
    'fieldContactInformation',
    'fieldIntroTextLimitedHtml',
    'fieldOtherCategories',
    'fieldPrimaryCategory',
    'fieldRelatedBenefitHubs',
    'fieldRelatedInformation',
    'fieldSteps',
    'fieldTags',
    'metatag',
    'path',
    'status',
    'title',
    'uid',
  ],
};

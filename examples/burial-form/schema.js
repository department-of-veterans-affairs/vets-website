const schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "APPLICATION FOR BURIAL BENEFITS",
    "type": "object",
    "additionalProperties": false,
    "definitions": {
        "dateRange": {
            "type": "object",
            "properties": {
                "from": {
                    "$ref": "#/definitions/date"
                },
                "to": {
                    "$ref": "#/definitions/date"
                }
            }
        },
        "privacyAgreementAccepted": {
            "type": "boolean",
            "enum": [
                true
            ]
        },
        "centralMailAddress": {
            "type": "object",
            "oneOf": [
                {
                    "properties": {
                        "country": {
                            "type": "string",
                            "enum": [
                                "CAN"
                            ]
                        },
                        "state": {
                            "type": "string",
                            "enum": [
                                "AB",
                                "BC",
                                "MB",
                                "NB",
                                "NF",
                                "NT",
                                "NV",
                                "NU",
                                "ON",
                                "PE",
                                "QC",
                                "SK",
                                "YT"
                            ]
                        },
                        "postalCode": {
                            "type": "string",
                            "maxLength": 10
                        }
                    }
                },
                {
                    "properties": {
                        "country": {
                            "type": "string",
                            "enum": [
                                "MEX"
                            ]
                        },
                        "state": {
                            "type": "string",
                            "enum": [
                                "aguascalientes",
                                "baja-california-norte",
                                "baja-california-sur",
                                "campeche",
                                "chiapas",
                                "chihuahua",
                                "coahuila",
                                "colima",
                                "distrito-federal",
                                "durango",
                                "guanajuato",
                                "guerrero",
                                "hidalgo",
                                "jalisco",
                                "mexico",
                                "michoacan",
                                "morelos",
                                "nayarit",
                                "nuevo-leon",
                                "oaxaca",
                                "puebla",
                                "queretaro",
                                "quintana-roo",
                                "san-luis-potosi",
                                "sinaloa",
                                "sonora",
                                "tabasco",
                                "tamaulipas",
                                "tlaxcala",
                                "veracruz",
                                "yucatan",
                                "zacatecas"
                            ]
                        },
                        "postalCode": {
                            "type": "string",
                            "maxLength": 10
                        }
                    }
                },
                {
                    "properties": {
                        "country": {
                            "type": "string",
                            "enum": [
                                "USA"
                            ]
                        },
                        "state": {
                            "type": "string",
                            "enum": [
                                "AL",
                                "AK",
                                "AS",
                                "AZ",
                                "AR",
                                "AA",
                                "AE",
                                "AP",
                                "CA",
                                "CO",
                                "CT",
                                "DE",
                                "DC",
                                "FM",
                                "FL",
                                "GA",
                                "GU",
                                "HI",
                                "ID",
                                "IL",
                                "IN",
                                "IA",
                                "KS",
                                "KY",
                                "LA",
                                "ME",
                                "MH",
                                "MD",
                                "MA",
                                "MI",
                                "MN",
                                "MS",
                                "MO",
                                "MT",
                                "NE",
                                "NV",
                                "NH",
                                "NJ",
                                "NM",
                                "NY",
                                "NC",
                                "ND",
                                "MP",
                                "OH",
                                "OK",
                                "OR",
                                "PW",
                                "PA",
                                "PR",
                                "RI",
                                "SC",
                                "SD",
                                "TN",
                                "TX",
                                "UT",
                                "VT",
                                "VI",
                                "VA",
                                "WA",
                                "WV",
                                "WI",
                                "WY"
                            ]
                        },
                        "postalCode": {
                            "type": "string",
                            "pattern": "^(\\d{5})(?:[-](\\d{4}))?$"
                        }
                    }
                },
                {
                    "properties": {
                        "country": {
                            "not": {
                                "type": "string",
                                "enum": [
                                    "CAN",
                                    "MEX",
                                    "USA"
                                ]
                            }
                        },
                        "state": {
                            "type": "string",
                            "maxLength": 51
                        },
                        "postalCode": {
                            "type": "string",
                            "maxLength": 51
                        }
                    }
                }
            ],
            "properties": {
                "street": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 50
                },
                "street2": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 50
                },
                "city": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 51
                }
            },
            "required": [
                "postalCode"
            ]
        },
        "usaPhone": {
            "type": "string",
            "pattern": "^\\d{10}$"
        },
        "fullName": {
            "type": "object",
            "properties": {
                "first": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 30
                },
                "middle": {
                    "type": "string"
                },
                "last": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 30
                },
                "suffix": {
                    "type": "string",
                    "enum": [
                        "Jr.",
                        "Sr.",
                        "II",
                        "III",
                        "IV"
                    ]
                }
            },
            "required": [
                "first",
                "last"
            ]
        },
        "ssn": {
            "type": "string",
            "pattern": "^[0-9]{9}$"
        },
        "centralMailVaFile": {
            "type": "string",
            "pattern": "^\\d{8,9}$"
        },
        "date": {
            "pattern": "^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$",
            "type": "string"
        },
        "files": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "size": {
                        "type": "integer"
                    },
                    "confirmationCode": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "anyOf": [
        {
            "required": [
                "vaFileNumber"
            ]
        },
        {
            "required": [
                "veteranSocialSecurityNumber"
            ]
        }
    ],
    "properties": {
        "relationship": {
            "type": "object",
            "required": [
                "type"
            ],
            "properties": {
                "type": {
                    "type": "string",
                    "enum": [
                        "spouse",
                        "child",
                        "parent",
                        "executor",
                        "other"
                    ]
                },
                "other": {
                    "type": "string"
                },
                "isEntity": {
                    "type": "boolean"
                }
            }
        },
        "locationOfDeath": {
            "type": "object",
            "required": [
                "location"
            ],
            "properties": {
                "location": {
                    "type": "string",
                    "enum": [
                        "vaMedicalCenter",
                        "stateVeteransHome",
                        "nursingHome",
                        "other"
                    ]
                },
                "other": {
                    "type": "string"
                }
            }
        },
        "toursOfDuty": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "dateRange": {
                        "$ref": "#/definitions/dateRange"
                    },
                    "serviceBranch": {
                        "type": "string"
                    },
                    "rank": {
                        "type": "string"
                    },
                    "serviceNumber": {
                        "type": "string"
                    },
                    "placeOfEntry": {
                        "type": "string"
                    },
                    "placeOfSeparation": {
                        "type": "string"
                    }
                }
            }
        },
        "veteranServedUnderAnotherName": {
            "type": "boolean"
        },
        "previousNames": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/fullName"
            }
        },
        "claimantEmail": {
            "type": "string",
            "format": "email"
        },
        "benefitsSelection": {
            "type": "object",
            "properties": {
                "burialAllowance": {
                    "type": "boolean"
                },
                "plotAllowance": {
                    "type": "boolean"
                },
                "transportation": {
                    "type": "boolean"
                }
            }
        },
        "burialAllowance": {
            "type": "boolean"
        },
        "plotAllowance": {
            "type": "boolean"
        },
        "transportation": {
            "type": "boolean"
        },
        "amountIncurred": {
            "type": "number"
        },
        "burialAllowanceRequested": {
            "type": "string",
            "enum": [
                "service",
                "nonService",
                "vaMC"
            ]
        },
        "burialCost": {
            "type": "number"
        },
        "previouslyReceivedAllowance": {
            "type": "boolean"
        },
        "benefitsUnclaimedRemains": {
            "type": "boolean"
        },
        "placeOfRemains": {
            "type": "string"
        },
        "federalCemetery": {
            "type": "boolean"
        },
        "stateCemetery": {
            "type": "boolean"
        },
        "govtContributions": {
            "type": "boolean"
        },
        "amountGovtContribution": {
            "type": "number"
        },
        "placeOfBirth": {
            "type": "string"
        },
        "officialPosition": {
            "type": "string"
        },
        "firmName": {
            "type": "string"
        },
        "privacyAgreementAccepted": {
            "$ref": "#/definitions/privacyAgreementAccepted"
        },
        "claimantAddress": {
            "$ref": "#/definitions/centralMailAddress"
        },
        "claimantPhone": {
            "$ref": "#/definitions/usaPhone"
        },
        "claimantFullName": {
            "$ref": "#/definitions/fullName"
        },
        "veteranFullName": {
            "$ref": "#/definitions/fullName"
        },
        "veteranSocialSecurityNumber": {
            "$ref": "#/definitions/ssn"
        },
        "vaFileNumber": {
            "$ref": "#/definitions/centralMailVaFile"
        },
        "burialDate": {
            "$ref": "#/definitions/date"
        },
        "deathDate": {
            "$ref": "#/definitions/date"
        },
        "veteranDateOfBirth": {
            "$ref": "#/definitions/date"
        },
        "deathCertificate": {
            "$ref": "#/definitions/files"
        },
        "transportationReceipts": {
            "$ref": "#/definitions/files"
        }
    },
    "required": [
        "privacyAgreementAccepted",
        "claimantAddress",
        "veteranFullName"
    ]
}

export default schema;
    {
      // Javascript settings.
      "presets": [
        [
          "@babel/env",
          {
            "forceAllTransforms": true,
            "targets": {
              /* This is the full list of browsers we support, but we are not using it because we want babel-polyfill
             * to include only polyfills for more modern browsers.
             * Older browser polyfills are in preESModulesPolyfills.js
             */
              /* "browsers": ["Chrome 60", "Firefox 57", "iOS 9", "Edge 14", "ChromeAndroid 64", "Safari 10", "ie 11"] */
              /*
             * This is the list of browers we support that all also have support for the nomodule script
             * attribute, meaning we can make them ignore a file that includes polyfills for older browsers
             */
              "browsers": [
                "Chrome 61",
                "Firefox 60",
                "iOS 11",
                "Edge 16",
                "ChromeAndroid 67",
                "Safari 11"
              ]
            },
            "useBuiltIns": "entry",
            "corejs": "3.8.1",
            "modules": false,
            "debug": false
          }
        ],
        "@babel/react"
      ],
      "ignore": [
        /* Ignore the file containing core-js polyfill imports for older browsers. If Babel processes the file,
         * it will remove all the imports because they are not needed for the newer browsers in the list above.
         */
        "./src/platform/polyfills/preESModulesPolyfills.js"
      ],
      "plugins": [
        "lodash",
        // Stage 2
        "@babel/plugin-proposal-function-sent",
        "@babel/plugin-proposal-export-namespace-from",
        "@babel/plugin-proposal-numeric-separator",
        "@babel/plugin-proposal-throw-expressions",
        // Stage 3
        "@babel/plugin-proposal-nullish-coalescing-operator",
        "@babel/plugin-proposal-optional-chaining",
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-syntax-import-meta",
        ["@babel/plugin-proposal-class-properties", { "loose": false }],
        "@babel/plugin-proposal-json-strings",
        [
          "module-resolver",
          {
            "root": "./src",
            "alias": {
              "~": "./src",
              "@@vap-svc": "./src/platform/user/profile/vap-svc",
              "@@profile": "./src/applications/personalization/profile",
              "@department-of-veterans-affairs/component-library/ProgressButton": "@department-of-veterans-affairs/react-components/ProgressButton",
              "@department-of-veterans-affairs/component-library/RadioButtons": "@department-of-veterans-affairs/react-components/RadioButtons",
              "@department-of-veterans-affairs/component-library/Breadcrumbs": "@department-of-veterans-affairs/react-components/Breadcrumbs",
              "@department-of-veterans-affairs/component-library/Modal": "@department-of-veterans-affairs/react-components/Modal",
              "@department-of-veterans-affairs/component-library/FileInput": "@department-of-veterans-affairs/react-components/FileInput",
              "@department-of-veterans-affairs/component-library/SystemDownView": "@department-of-veterans-affairs/react-components/SystemDownView",
              "@department-of-veterans-affairs/component-library/DropDownPanel": "@department-of-veterans-affairs/react-components/DropDownPanel",
            }
          }
        ]
      ],
      // Share polyfills between files.
      "env": {
        "test": {
          "presets": ["@babel/env", "@babel/preset-react"],
          "plugins": [
            "istanbul",
            "transform-class-properties",
            "dynamic-import-node",
            "transform-react-remove-prop-types",
            // Stage 2
            "@babel/plugin-proposal-function-sent",
            "@babel/plugin-proposal-export-namespace-from",
            "@babel/plugin-proposal-numeric-separator",
            "@babel/plugin-proposal-throw-expressions",
            // Stage 3
            "@babel/plugin-syntax-dynamic-import",
            "@babel/plugin-syntax-import-meta",
            ["@babel/plugin-proposal-class-properties", { "loose": false }],
            "@babel/plugin-proposal-json-strings"
          ]
        },
        "production": {
          "plugins": [
            [
              "transform-react-remove-prop-types",
              {
                "removeImport": true
              }
            ]
          ]
        }
      }
    }

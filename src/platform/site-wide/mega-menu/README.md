# Mega menu configuration

This document describes how the MegaMenu is configured in vets-website. There are a lot of moving pieces in how the MegaMenu is setup on vets-website. It is not initially apparent how everything works by just looking at the code. This document will walk you through how the MegaMenu is configured.

## MegaMenu react component

### Intent

The MegaMenu is the initial design for navigation between va.gov and vets.gov. The MegaMenu is dynamically generated through data. The intent is to have va.gov people be able to modify labels and links on the page without ever touching the codebase. We will be getting data from the original TeamSite system that runs va.gov.

### Data Props

This is the data that is used to generate the MegaMenu. The data is made up of an Array of Objects. There are 2 variations of how the MegaMenu can be rendered. It is important to format your data prop to properly generate the MegaMenu. Below is examples of the data structure.

#### Dropdown with Side Navigation

This layout will generate a dropdown with a left column that comprises of multiple sections.

```
{
  title: 'Nav Title 1',
  menuSections: [
    {
      title: 'Section Title 1',
      links: {
        columnOne: {
          title: 'Menu Item 1',
          links: [
            {
              text: 'First link',
              href: '#'
            }
          ]
        },
        columnTwo: {
          title: 'Column 2 title',
          links: [
            {
              text: 'First link',
              href: '#'
            }
          ]
        },
        columnThree: {
          img: {
            src: 'http://via.placeholder.com/228x128',
            alt: 'Place Holder Image'
          },
          link: {
            text: 'Text for link',
            href: '#'
          },
          description: 'Add a description of the marketing content'
        },
        seeAllLink: {
          text: 'Link to menu page',
          href: '#'
        }
      }
    },
    {
      title: 'Section Title 2',
      links: {
        columnOne: {
          title: 'Menu Item 1',
          links: [
            {
              text: 'First link',
              href: '#'
            }
          ]
        },
        columnTwo: {
          title: 'Column 2 title',
          links: [
            {
              text: 'First link',
              href: '#'
            }
          ]
        },
        columnThree: {
          img: {
            src: 'http://via.placeholder.com/228x128',
            alt: 'Place Holder Image'
          },
          link: {
            text: 'Text for Marketing Link',
            href: '#'
          },
          description: 'Add a description of the marketing content'
        },
        seeAllLink: {
          text: 'Link to menu page',
          href: '#'
        }
      }
    }
  ]
},
```

** This is what it will generate. **

![alt nav style 1](../../../../documentation/src/images/mega-menu/nav-version-1.png)

#### Dropdown with Only links

This will generate a dropdown with only links.

```
{
  title: 'Nav Title 2',
  menuSections: {
    mainColumn: {
      title: 'Main Dropdown Section Title',
      links: [
        {
          text: 'First Link',
          href: '#'
        },
      ]
    },
    columnOne: {
      title: 'Column 1 Title',
      links: [
        {
          text: 'Link 1',
          href: '#'
        }
      ]
    },
    columnTwo: {
      title: 'Column 2 Title',
      links: [
        {
          text: 'Link 1',
          href: '#'
        },
      ]
    },
    columnThree: {
      img: {
        src: 'http://via.placeholder.com/228x128',
        alt: 'Place Holder Image'
      },
      link: {
        text: 'Text for Marketing Link',
        href: '#'
      },
      description: 'Add a description of the marketing content'
    },
  }
},
```

**This will generate this view.**

![alt nav style 1](../../../../documentation/src/images/mega-menu/nav-version-2.png)

#### Just a link

This will just generate a link in the nav-bar

```
{
  title: 'Nav Title 3 link only',
  href: '#'
}
```

### Code:

#### Example Data

```
[{
  "title": "Nav Title 1",
  "menuSections": [{
    "title": "Section Title 1",
    "links": {
      "columnOne": {
        "title": "Section 1 Column 1 Title",
        "links": [{
          "text": "First link",
          "href": "#"
        }, {
          "text": "Second link",
          "href": "#"
        }, {
          "text": "Third link",
          "href": "#"
        }, {
          "text": "Fourth link",
          "href": "#"
        }, {
          "text": "Fifth link",
          "href": "#"
        }]
      },
      "columnTwo": {
        "title": "Section 1 Column 2 title",
        "links": [{
          "text": "First link",
          "href": "#"
        }, {
          "text": "Second link",
          "href": "#"
        }, {
          "text": "Third link",
          "href": "#"
        }, {
          "text": "Fourth link",
          "href": "#"
        }, {
          "text": "Fifth link",
          "href": "#"
        }]
      },
      "columnThree": {
        "img": {
          "src": "http://via.placeholder.com/228x128",
          "alt": "Place Holder Image"
        },
        "link": {
          "text": "Text for link",
          "href": "#"
        },
        "description": "Add a description of the marketing content"
      },
      "seeAllLink": {
        "text": "Link to Section 1 Page",
        "href": "#"
      }
    }
  }, {
    "title": "Section Title 2",
    "links": {
      "columnOne": {
        "title": "Section 2 Column 1 Title",
        "links": [{
          "text": "First link",
          "href": "#"
        }]
      },
      "columnTwo": {
        "title": "Section 2 Column 2 title",
        "links": [{
          "text": "First link",
          "href": "#"
        }]
      },
      "columnThree": {
        "img": {
          "src": "http://via.placeholder.com/228x128",
          "alt": "Place Holder Image"
        },
        "link": {
          "text": "Text for Marketing Link",
          "href": "#"
        },
        "description": "Add a description of the marketing content"
      },
      "seeAllLink": {
        "text": "Link to Section 2 Page",
        "href": "#"
      }
    }
  }]
}, {
  "title": "Nav Title 2",
  "menuSections": {
    "mainColumn": {
      "title": "Main Dropdown Section Title",
      "links": [{
        "text": "First link",
        "href": "#"
      }, {
        "text": "Second link",
        "href": "#"
      }, {
        "text": "Third link",
        "href": "#"
      }, {
        "text": "Fourth link",
        "href": "#"
      }, {
        "text": "Fifth link",
        "href": "#"
      }]
    },
    "columnOne": {
      "title": "Column 1 Title",
      "links": [{
        "text": "First link",
        "href": "#"
      }, {
        "text": "Second link",
        "href": "#"
      }, {
        "text": "Third link",
        "href": "#"
      }, {
        "text": "Fourth link",
        "href": "#"
      }, {
        "text": "Fifth link",
        "href": "#"
      }]
    },
    "columnTwo": {
      "title": "Column 2 Title",
      "links": [{
        "text": "First link",
        "href": "#"
      }, {
        "text": "Second link",
        "href": "#"
      }, {
        "text": "Third link",
        "href": "#"
      }, {
        "text": "Fourth link",
        "href": "#"
      }, {
        "text": "Fifth link",
        "href": "#"
      }]
    },
    "columnThree": {
      "img": {
        "src": "http://via.placeholder.com/228x128",
        "alt": "Place Holder Image"
      },
      "link": {
        "text": "Text for Marketing Link",
        "href": "#"
      },
      "description": "Add a description of the marketing content"
    }
  }
}, {
  "title": "Nav Title 3 link only",
  "href": "#"
}]
```

#### Code Sample

```javascript
export class RenderedComponent extends React.Component {
  constructor() {
    super();
    this.state = { display: {} };
  }
  toggleDisplayHidden(hidden) {
    if (document.body.clientWidth > 768) {
      this.setState({
        display: {},
      });
    } else if (hidden) {
      this.setState({
        display: { hidden: true },
      });
    } else if (!this.state.display.hasOwnProperty('hidden')) {
      this.setState({
        display: { hidden: true },
      });
    } else {
      this.setState({
        display: {},
      });
    }
  }
  toggleDropDown(title) {
    this.setState({
      currentDropdown: title,
    });
  }
  updateCurrentSection(title) {
    this.setState({
      currentSection: title,
    });
  }
  render() {
    return (
      <div className="site-c-reactcomp__rendered">
        <header className="header">
          <div className="usa-grid usa-grid-full">
            <div id="mega-menu">
              <div
                onClick={() => this.toggleDisplayHidden()}
                style={{
                  display: 'inline-block',
                  margin: '20px',
                  padding: '8px 15px',
                  border: '1px solid',
                  borderRadius: '15px',
                }}
              >
                Mobile Menu Toggle Button
              </div>
              <MegaMenu
                {...this.state}
                data={data}
                toggleDisplayHidden={show => this.toggleDisplayHidden(show)}
                toggleDropDown={title => this.toggleDropDown(title)}
                updateCurrentSection={title => this.updateCurrentSection(title)}
              />
            </div>
          </div>
        </header>
      </div>
    );
  }
}
```

## Entry point

The way React components work in vets-website is that they are injected into web pages in vets-website. The HTML element that the MegaMenu is attaching to can be found at _/src/site/includes/top-nav.html_. The entry point where the MegaMenu is injected into the site is at _/src/platform/site-wide/index.js_. Here you will see.

```
startMegaMenuWidget(window.VetsGov.headerFooter.megaMenuData, commonStore);
```

As you can see we pass in a data argument located at `window.VetsGov.headerFooter.megaMenuData`. There is a MetalSmith plugin that we created to add this to the global window. This is done in the build process. You can find the plugin code at _/src/site/stages/build/plugins/create-header-footer.js_

## Redux

The MegaMenu uses Redux to store it's state. You can find the container component at */src/platform/site-wide/mega-menu/containers/Main.jsx. This is where all logic for the component lives. You will also find all of the common Redux files (actions, reducers) in the *mega-menu\* folder.

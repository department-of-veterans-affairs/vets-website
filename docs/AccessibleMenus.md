## DOM structure
The idea behind `src/js/common/utils/accessible-menus.js` is to be able to pass the DOM tree for a menu to the helper function `addMenuListeners` to make the menu keyboard navigable.

The DOM structure needed on the menu for the helper function to work properly is as follows.

```html
<!--
  The role of the root element can be either "menu" or "menubar"
-->
<ul role="[menu|menubar]">
  <li>
    <menu/> <!-- See below -->
  </li>
  <!-- Or -->
  <li>
    <a> <!-- Any menu item -->
  </li>
</ul>
```

Where `<menu/>` has the following structure:
```html
<!--
  When the menu is expanded, the button gets aria-expanded="true"
  When it's collapsed, the attribute is removed
-->
<!--
  Menu button can either be a button or have role="button"
  Menu button's aria-controls points to either the menu's id or its parent's id
-->
<button
  role="button"
  aria-haspopup="true"
  aria-controls="foo"/>
<!-- Optional div nesting -->
<div id="foo" hidden>
  <!--
    The ul has id="foo" and hidden only if its parent doesn't have id="foo"
  -->
  <ul id="foo" role="menu" hidden>
    <li>
      <menu/> <!-- Nested menus possible -->
    </li>
    <!-- Or -->
    <li>
      <a> <!-- Any menu item -->
    </li>
  </ul>
</div>
```


## Functionality
A user should be able to use the keyboard to do the following things:

*Menubar*
1. Navigate between visible menubar items
  - Left / right arrow keys
  - With wraparound
2. Open sub menus
  - Down arrow / space / enter
  - Focus should go to the first visible menu item in the sub-menu
3. Activate menubar menu items
  - Follow links with space / enter

*Menus*
The helper function is pretty naive right now, but it can be modified to be smarter. Currently, it assumes menus are vertical and sub-menus are opened to the right.
1. Activate menu items
  - Follow links with space / enter
2. Open sub-menus
  - Right arrow key
  - Focus should go to the first visible menu item in the sub-menu
3. Navigate through visible menu items
  - Up / down arrow keys
  - With wraparound
4. Navigate back up to the opening menu button
  - Up arrow from the top menu item
  - Should this also be down arrow from the bottom menu item?
5. Close all open menus
  - Escape
  - Focus should return to the top-level menu button

*Sub-menus*
Menus inside of menus behave a little differently than top-level menus. Except where noted below, they act like the menus above.
1. Go to opening menu button
  - Left arrow
2. Should _not_ go to the opening menu button by pressing the up arrow key on the top visible menu item


## Screen readers
To get screen readers to read out menus as expected, there are a few things we have to do to the DOM elements.

*Menu bars*
- role="menubar"
  - This is understood by screen reader users as being horizontal, so they'll navigate with left / right arrow keys rather than up / down

*Menu buttons*
These are the buttons that open menus.
- role="button"
  - Optional if it _is_ a `<button>`
- aria-haspopup="true"
  - Indicates that it'll open a thing (menu) when you activate it
- aria-controls="menu-element-id"
  - I think only JAWS actually reads anything off differently because of this, but it's used in the code to indicate which menu to open

*Menus*
- Should be a `<ul>`
- role="menu"
  - Indicates that it's not just a list, but a menu
- hidden
  - Not just so sighted users don't see it; it'll also hide it from screen readers


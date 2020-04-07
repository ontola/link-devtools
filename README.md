# link-devtools

## Installation
### Get the React devtools
First install the react devtools if you haven't got them already.

[Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en-US)

[Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### Installation and Usage

`yarn add @ontola/link-devtools` V `npm i @ontola/link-devtools`

Add the following to the place where your LinkedRenderStore is initialized;

```javascript
import { createStore } from 'link-redux';
import enableDevtools from '@ontola/link-devtools'

// Wherever
const lrs = createStore();
enableDevtools(lrs);
```

The `dev` object should now be present when loading your app.

```javascript
dev.help // Will output the available commands
```

If `dev` is undefined, please check that the react devtools are in fact installed and enabled in
your current browser session.

Note: These methods are convenience methods, please do not use or depend on them in your code!

#### dev.help
Try calling `dev.help` to see all available commands.

#### dev.obj(iri: string | number | NamedNode)
The `dev.obj()` function can take an URL as a string or NamedNode and will show the data currently in the store.

#### dev.data
Select a `LinkedResourceContainer` in the React devtools and call `dev.data` in the browser console.

#### dev.reload
When selecting a `LinkedResourceContainer`, call `dev.reload` to force link to reload the resource from the server.

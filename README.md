# link-devtools

## Installation
### Get the React devtools
First install the react devtools if you haven't got them already.

[Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en-US)

[Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### Enable the Link devtools

Add the following to the place where your LinkedRenderStore is initialized;

```javascript
import lrs from '../helpers/lrs';

if (typeof window !== 'undefined') {
  window.LRS = lrs;
  if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined') {
    window.dev = new LinkDevTools();
  }
}
```

CAUTION: `lrs` should be an **instance** (i.e. the return value from `new LinkedRenderStore()`), not the class.

## Usage

The `dev` object should now be present when loading your app.

#### dev.help
Try calling `dev.help` to see all available commands.

#### dev.obj(iri: string | NamedNode)
The `dev.obj()` function can take an URL as a string or NamedNode and will show the data currently in the store.

#### dev.data
Select a `LinkedResourceContainer` in the React devtools and call `dev.data` in the browser console.

#### dev.reload
When selecting a `LinkedResourceContainer`, call `dev.reload` to force link to reload the resource from the server.

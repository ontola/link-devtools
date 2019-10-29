console.log("Content js -------------------------------------------------", window.LRS)

const port = browser.runtime.connect({name: "link-devtools-background"});

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window) {
    return;
  }

  console.log(event);

  if (event.data.extension && (event.data.extension == "link-devtools")) {
    console.log("Content script received: ", event.data);
    port.postMessage(event.data);
  }
}, false);

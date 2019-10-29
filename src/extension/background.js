console.log("Background.js loaded")

let content;
let panel;
const deltas = []
let data = [];

const updateSubscribers = () => {
  console.log('update subscribers')
  if (panel) {
    console.log('update subscriber', panel)
    panel.postMessage({
      extension: "link-devtools",
      type: "delta",
      data: deltas,
    })
    panel.postMessage({
      extension: "link-devtools",
      type: "data",
      data: data,
    })
  }
}

const listener = (port) => {
  if (port.name === "link-devtools-background") {
    console.log('Background port opened')
    content = port;
    port.onMessage.addListener(function(msg) {
      console.log(msg)
      if (msg.type === "delta") {
        deltas.push({
          time: new Date(),
          delta: msg.data,
        })
        updateSubscribers();
      } else if (msg.type === "data") {
        console.log("Received new data from window");
        data = msg.data
        updateSubscribers();
      }
    });
  } else if (port.name === "link-devtools-panel") {
    console.log("Panel port opened")
    panel = port;
    updateSubscribers();
    port.onMessage.addListener(function(msg) {
      if (msg.type === "data") {
        console.log('Panel requesting data');
        content.postMessage("update-data")
      }
    })
  } else {
    console.error("Unknown port", port.name)
  }
}

browser.runtime.onConnect.addListener(listener)

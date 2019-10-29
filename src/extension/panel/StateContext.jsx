import React from "react";

const defaultContext = {
  data: [],
  deltas: [],
  port: undefined,
  updateData: (port) => port.postMessage({
    extension: "link-devtools",
    type: "request-data",
  }),
};

export const StateContext = React.createContext(defaultContext)

function useWhatever() {
  const [ port, setPort ] = React.useState()
  const [ context, setContext ] = React.useState(defaultContext)

  console.log('whatever', port, context);
  if (port && !context.port) {
    setContext({
      ...context,
      port,
    })
  }

  React.useEffect(() => {
    setPort(browser.runtime.connect({ name: "link-devtools-panel" }));
    console.log('set port')
  }, [])


  React.useEffect(() => {
    const listener = (msg) => {
      console.log('panel received message')
      console.log(msg)

      switch(msg.type) {
        case "delta": {
          const nextContext = {
            ...context,
            deltas: msg.data,
          };
          console.log('new-old', context, nextContext);
          setContext(nextContext);
          break;
        }
        case "data": {
          setContext({
            ...context,
            data: msg.data,
          });
          break;
        }
        default: {
          console.log(`unknown message ${msg.type}`);
        }
      }
    }

    if (port) {
      console.log('Subscribe')
      port.onMessage.addListener(listener);
      return () => {
        console.log('unsubscribe')
        port.onMessage.removeListener(listener)
      }
    }
  }, [context]);

  return [ context ];
}

export const StateContextProvider = ({ children }) => {
  const [ context ] = useWhatever();

  console.log('Provider rerender', context);

  return (
    <StateContext.Provider value={context}>
      {children}
    </StateContext.Provider>
  );
}

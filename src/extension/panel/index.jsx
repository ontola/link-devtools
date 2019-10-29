import { CssBaseline, makeStyles } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import React from "react";

import { DataPanel } from './DataPanel';
import { DeltaPanel } from './DeltaPanel';
import { StateContextProvider } from './StateContext';
import { TabPanel } from './TabPanel';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const Panel = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <StateContextProvider>
        <AppBar position="static">
          <Tabs value={value} onChange={handleChange}>
            <Tab id={`main-tabpanel-${0}`} label="Deltas" />
            <Tab id={`main-tabpanel-${0}`} label="Data" />
            <Tab id={`main-tabpanel-${0}`} label="Views" />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <DeltaPanel />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <DataPanel />
        </TabPanel>
      </StateContextProvider>
    </div>
  );
}

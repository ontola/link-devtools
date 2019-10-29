import { makeStyles } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import React from "react";
import { DisplayDelta } from './DisplayDelta'

import { StateContext } from './StateContext';

const useStyles = makeStyles(theme => ({
  container: {
    position: "relative",
  },
  children: {
    position: "absolute",
  },

  item: {
    flexGrow: 1,
  },
  selector: {
    overflowY: "auto",
  },
}));

export const DeltaPanel = () => {
  const classes = useStyles();
  const state = React.useContext(StateContext);
  const [ selected, setSelected ] = React.useState(-1);

  return (
    <Box heigth="100%">
      <Grid container component={Paper} spacing={1}>
        <Grid item className={classes.item} xs={3}>
          <List className={classes.selector}>
            {state.deltas.map((delta, index) => (
              <ListItem button key={`${delta.time}-${index}`} onClick={() => setSelected(index)}>
                <ListItemText
                  primary={new Date(delta.time).toISOString().split('T').pop()}
                  secondary={`${delta.delta.length} rows`}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item className={classes.item} xs={9}>
          {selected >= 0 && <DisplayDelta delta={state.deltas[selected]} />}
        </Grid>
      </Grid>
    </Box>
  );
};

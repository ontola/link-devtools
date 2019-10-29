import { makeStyles } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { PlainFactory } from '@ontologies/core'
import React from "react";
import ReactJson from 'react-json-view';

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

const toObject = (factory, arr, denormalize = false, serializeObjects = true) => {
  if (!Array.isArray(arr)) {
    return console.error('Pass an array of statements to process');
  }
  if (arr.length === 0) {
    console.debug('No statements passed');

    return {};
  }

  const objToNQ = (obj) => {
    if (["NamedNode", "BlankNode", "Literal"].includes(obj.termType)) {
      return factory.toNQ(obj);
    }

    return obj;
  }

  const obj = {};
  for (let i = 0; i < arr.length; i++) {
    const cur = arr[i];
    const subj = factory.toNQ(cur.subject);
    const pred = factory.toNQ(cur.predicate);
    if (typeof obj[subj] === 'undefined') {
      obj[subj] = {};
    }
    const object = serializeObjects ? objToNQ(cur.object) : cur.object;
    if (typeof obj[subj][pred] === 'undefined') {
      obj[subj][pred] = object;
    } else if (Array.isArray(obj[subj][pred])) {
      obj[subj][pred].push(object);
    } else {
      obj[subj][pred] = [
        obj[subj][pred],
        object,
      ];
    }
  }
  const allKeys = Object.keys(obj);
  if (denormalize && allKeys.length === 1) {
    console.debug('Returning single subject;', allKeys[0]);

    return obj[allKeys[0]];
  }

  return obj;
}

export const DataPanel = () => {
  const classes = useStyles();
  const state = React.useContext(StateContext);
  const [ selected, setSelected ] = React.useState(undefined);

  console.log(state.data);
  const subjects = state
    .data
    .reduce((arr, next) => arr.includes(next.subject.value)
      ? arr
      : arr.concat([next.subject.value]),
      []
    )

  const toShow = selected && toObject(
    new PlainFactory(),
    state.data.filter((s) => s.subject.value === selected || s.graph.value === selected),
  );
  console.log(toShow);

  return (
    <Box heigth="100%">
      <Grid container component={Paper} spacing={1}>
        <Grid item className={classes.item} xs={3}>
          <Button onClick={() => state.updateData(state.port)}>Reload</Button>
          <List className={classes.selector}>
            {subjects.map((subject, index) => (
              <ListItem button key={`${subject}-${index}`} onClick={() => setSelected(subject)}>
                <ListItemText primary={subject} />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item className={classes.item} xs={9}>
          {selected && (
            <ReactJson
              src={toShow}
              name={null}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

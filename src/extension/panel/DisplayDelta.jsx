import { PlainFactory } from "@ontologies/core"
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import React from "react";

const factory = new PlainFactory();

export const DisplayDelta = ({ delta }) => (
  <div>
    <p>{delta.time.toString()}</p>
    <Table>
      <TableHead>
        <th>Subject</th>
        <th>Predicate</th>
        <th>Object</th>
        <th>Graph</th>
      </TableHead>
      <TableBody>
        {delta.delta.map((quadruple) => (
          <TableRow>
            <TableCell>{factory.toNQ(quadruple[0])}</TableCell>
            <TableCell>{factory.toNQ(quadruple[1])}</TableCell>
            <TableCell>{factory.toNQ(quadruple[2])}</TableCell>
            <TableCell>{factory.toNQ(quadruple[3])}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

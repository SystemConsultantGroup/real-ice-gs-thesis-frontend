import React, { ReactNode } from "react";
import { Table } from "@mantine/core";
import classes from "./TableRow.module.css";

interface Props {
  children: ReactNode;
  onClick?: () => void;
}

function TableRow({ children, onClick }: Props) {
  return (
    <Table.Tr onClick={onClick} className={classes.container}>
      {children}
    </Table.Tr>
  );
}

export default TableRow;

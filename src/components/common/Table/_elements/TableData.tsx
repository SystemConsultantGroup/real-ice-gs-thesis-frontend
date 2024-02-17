import { TableTd } from "@mantine/core";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function TableData({ children }: Props) {
  return (
    <TableTd
      fz={16}
      style={{
        whiteSpace: "nowrap",
        maxWidth: "500px",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {children}
    </TableTd>
  );
}

export default TableData;

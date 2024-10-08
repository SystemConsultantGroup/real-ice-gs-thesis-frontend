import Link from "next/link";
import { Badge, Button, Stack } from "@mantine/core";
import {
  ApiFileRow,
  BasicRow,
  ButtonRow,
  LongContentRow,
  RowGroup,
  TitleRow,
} from "@/components/common/rows";
import { Status } from "@/api/_types/common";
import type { ProfessorFinalProps } from "./ProfessorFinalForm";

function textForStatus(status: Status) {
  switch (status) {
    case "PASS":
      return "합격";
    case "FAIL":
      return "불합격";
    case "PENDING":
      return "보류";
    default:
      return "???";
  }
}

export function ProfessorFinalResult({ previous }: Pick<ProfessorFinalProps, "previous">) {
  return (
    <Stack gap={0}>
      <TitleRow title="내 심사 내역" badge={<Badge>최종저장 완료</Badge>} />
      <RowGroup>
        <BasicRow field="합격 여부">
          <BasicRow.Text>
            <b>{textForStatus(previous.status)}</b>
          </BasicRow.Text>
        </BasicRow>
      </RowGroup>
      <LongContentRow field="심사 의견" content={previous.comment!} />
      <RowGroup>
        <ApiFileRow field="심사 의견 파일" file={previous.reviewFile} />
      </RowGroup>
      <RowGroup withBorderBottom={false}>
        <ButtonRow
          buttons={[
            <Button key="back" variant="outline" component={Link} href="../review">
              목록으로
            </Button>,
          ]}
        />
      </RowGroup>
    </Stack>
  );
}

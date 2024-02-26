"use client";

import { useMemo, useState } from "react";
import { isNotEmpty, useForm } from "@mantine/form";
import { ClientAxios } from "@/api/ClientAxios";
import { Status } from "@/api/_types/common";
import { File as ApiFile } from "@/api/_types/file";
import { UpdateReviewRequestBody } from "@/api/_types/reviews";
import { API_ROUTES } from "@/api/apiRoute";
import { showNotificationSuccess } from "@/components/common/Notifications";
import { FinalReview } from "@/components/pages/review/Review";
import { ReviewConfirmModal } from "@/components/pages/review/ReviewConfirmModal";
import { ThesisInfoData } from "@/components/pages/review/ThesisInfo/ThesisInfo";
import { PreviousFile, stubFile } from "@/components/common/rows/FileUploadRow/FileUploadRow";
import { useRouter } from "next/navigation";
import { transactionTask } from "@/api/_utils/task";
import { uploadFile } from "@/api/_utils/uploadFile";

export interface ProfessorFinalProps {
  reviewId: string;
  thesisInfo: ThesisInfoData;
  previous: {
    status: Status;
    comment: string | null;
    reviewFile: ApiFile | null;
  };
}

interface FormInput {
  status: Status;
  comment: string;
  commentFile: File | PreviousFile | null;
}

export function ProfessorFinalForm({ reviewId, thesisInfo, previous }: ProfessorFinalProps) {
  const router = useRouter();
  const form = useForm<FormInput>({
    initialValues: {
      status: previous.status,
      comment: previous.comment ?? "",
      commentFile: useMemo(
        () => (previous.reviewFile ? stubFile(previous.reviewFile) : null),
        [previous.reviewFile]
      ),
    },
    validate: {
      status: (value) =>
        value && value !== "UNEXAMINED" ? null : "합격, 불합격, 보류 중 하나를 선택해주세요.",
      commentFile: isNotEmpty("심사 의견 파일을 첨부해주세요."),
    },
  });
  const { values } = form;
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [currentState, setCurrentState] = useState<null | "pending" | "submitted">(null);

  const handleSubmit = transactionTask(async (task, input: FormInput) => {
    setCurrentState("pending");
    task.onComplete(() => setCurrentState("submitted"));

    const isPending = input.status === "PENDING";
    let fileUUID;
    if ("previousUuid" in input.commentFile!) {
      fileUUID = input.commentFile.previousUuid satisfies string;
    } else {
      fileUUID = (await uploadFile(input.commentFile!)).uuid;
    }

    await ClientAxios.put(API_ROUTES.review.final.put(reviewId), {
      contentStatus: input.status,
      comment: input.comment,
      fileUUID,
    } satisfies UpdateReviewRequestBody);

    showNotificationSuccess({
      message: `${thesisInfo.studentInfo.name} 학생의 논문 심사결과를 ${
        isPending ? "임시저장" : "저장"
      }했습니다.`,
    });

    router.push("../final");
  });

  return (
    <form
      onSubmit={form.onSubmit((input) => {
        if (input.status === "PENDING") {
          handleSubmit(input);
        } else {
          setShowConfirmDialog(true);
        }
      })}
    >
      <FinalReview form={form} currentState={currentState} />
      <ReviewConfirmModal
        thesis={thesisInfo}
        review={{
          thesis: values.status,
          presentation: null,
          comment: values.comment,
          commentFile: values.commentFile?.name ?? null,
        }}
        opened={showConfirmDialog}
        onConfirm={() => handleSubmit(values)}
        onClose={() => {
          setShowConfirmDialog(false);
        }}
      />
    </form>
  );
}

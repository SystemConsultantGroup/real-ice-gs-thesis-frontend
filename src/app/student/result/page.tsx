import PageHeader from "@/components/common/PageHeader";
import { ThesisInfo } from "@/components/pages/review/ThesisInfo";
import { ReviewList, StudentReviewResult } from "@/components/pages/review/Review";
import { ReviewCard } from "@/components/pages/review/Review/ReviewCard";
import { AuthSSR } from "@/api/AuthSSR";
import { fetcher } from "@/api/fetcher";
import { API_ROUTES } from "@/api/apiRoute";
import { MyReviewResponse } from "@/api/_types/reviews";
import { ThesisInfoData } from "@/components/pages/review/ThesisInfo/ThesisInfo";
import { UserResponse } from "@/api/_types/user";

export default async function StudentResultPage() {
  const { token } = await AuthSSR({ userType: "STUDENT" });
  const user = (await fetcher({ url: API_ROUTES.user.get(), token })) as UserResponse;

  const response = (await fetcher({ url: API_ROUTES.review.getMe(), token })) as {
    [key: string]: MyReviewResponse;
  };

  let main: MyReviewResponse;
  let pre: MyReviewResponse;

  for (let i = 0; i < 3; i += 1) {
    if (response[i.toString()]?.stage === "MAIN") {
      main = response[i.toString()];
    } else if (response[i.toString()]?.stage === "PRELIMINARY") {
      pre = response[i.toString()];
    }
  }

  const thesisRes: MyReviewResponse = user.currentPhase === "PRELIMINARY" ? pre! : main!;

  const thesisInfo: ThesisInfoData = {
    title: thesisRes.title,
    stage: thesisRes.stage,
    studentInfo: {
      name: thesisRes.student,
      department: { name: thesisRes.department },
    },
    abstract: thesisRes.abstract,
    thesisFile: thesisRes.thesisFiles.find((file) => file.type === "THESIS")?.file,
    presentationFile: thesisRes.thesisFiles.find((file) => file.type === "PRESENTATION")?.file,
  };

  return (
    <>
      <PageHeader title="심사 결과" />
      <ReviewCard>
        <ThesisInfo thesis={thesisInfo} />
        <StudentReviewResult
          stage={thesisRes.stage}
          review={thesisRes.reviews.find((review) => review.isFinal)}
        />
        <ReviewList
          title="심사 의견"
          stage={thesisRes.stage}
          reviews={thesisRes.reviews.filter((review) => !review.isFinal)}
        />
      </ReviewCard>
    </>
  );
}

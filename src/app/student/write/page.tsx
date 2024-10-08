import { AuthSSR } from "@/api/AuthSSR";
import { UserResponse } from "@/api/_types/user";
import { checkPhase } from "@/api/_utils/checkPhase";
import { API_ROUTES } from "@/api/apiRoute";
import { fetcher } from "@/api/fetcher";
import { formatTime } from "@/components/common/Clock/date/format";
import PageHeader from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";
import PhaseReady from "@/components/pages/PhaseReady/PhaseReady";
import PaperSubmissionForm from "@/components/pages/write/PaperSubmissionForm/PaperSubmissionForm";

export default async function StudentWritePage() {
  const { token } = await AuthSSR({ userType: "STUDENT" });
  const user = (await fetcher({ url: API_ROUTES.user.get(), token })) as UserResponse;

  const { within, start, end } = await checkPhase({
    title:
      user.currentPhase === "MAIN" || user.currentPhase === "REVISION"
        ? "본심 논문 제출"
        : "예심 논문 제출",
    token,
  });

  return within ? (
    <>
      <PageHeader title="논문 투고" />
      <Section>
        <PaperSubmissionForm />
      </Section>
    </>
  ) : (
    <PhaseReady title="논문 투고" start={formatTime(start)} end={formatTime(end)} />
  );
}

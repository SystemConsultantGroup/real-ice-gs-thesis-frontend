import { CommonApiResponse, PagedApiResponse, PagedQueryRequest, Thesis } from "./common";
import { File } from "./file";
import { Phase } from "./phase";
import { User } from "./user";

export interface StudentQueryBrief {
  studentNumber: string;
  name: string;
  email: string;
  phone: number;
  departmentId: number;
  phaseId: number;
  isLock: boolean;
}

export type PagedStudentsRequestQuery = PagedQueryRequest & Partial<StudentQueryBrief>;
export type StudentsExcelRequestQuery = Partial<Omit<StudentQueryBrief, "phaseId" | "isLock">>;

export interface StudentResponse extends User, CommonApiResponse {}

export interface PagedStudentsResponse extends PagedApiResponse<User> {}

export interface CreateStudentRequestBody extends Omit<User, "id" | "department"> {
  password: string;
  deptId: number;
  isLock: boolean;
  headReviewerId: number;
  phaseId: number;
  reviewerIds: number[];
  thesisTitle?: string;
}

export interface StudentPhaseResponse extends CommonApiResponse {
  phase: Phase;
  isLock: boolean;
}

export interface DetailedThesis extends Thesis {
  studentInfo: User;
  thesisFile: File;
  presentationFile: File;
}

export interface StudentThesisResponse extends DetailedThesis, CommonApiResponse {}

export interface StudentReviewersResponse extends CommonApiResponse {
  headReviewer: User;
  reviewers: User[];
}

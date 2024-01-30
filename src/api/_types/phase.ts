import { CommonApiResponse } from "./common";

export interface Phase {
  id: number;
  title: string;
  start: string;
  end: string;
}

export interface PhasesResponse extends CommonApiResponse {
  phases: Phase[];
}

export interface UpdatePhaseRequestBody {
  start: string;
  end: string;
}

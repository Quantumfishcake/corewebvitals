export type ClientDataType = {
  id: number;
  name: string;
  psiscores: PSIScoreType[];
  scores: ScoreType[];
  smartpages: string[];
  categorypage: string;
};

export type PSIScoreType = {
  scoreId: String;
  date: any;
  score_type: number;
  field_fcp: number;
  field_fid: number;
  field_cls: number;
  field_lcp: number;
  field_inp: number;
  field_ttfb: number;
  lighthouse_score: number;
  lighthouse_fcp: number;
  lighthouse_si: number;
  lighthouse_tti: number;
  lighthouse_tbt: number;
  lighthouse_cls: number;
  lighthouse_lcp: number;
};

export type ScoreType = {
  scoreId: String;
  date: any;
  score_type: number;
  score: number;
}

export type ClientInfoType = {
  id: number;
  name: string;
  smartpages: string[];
  categorypage: string;
};
  

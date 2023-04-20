export type ClientDataType = {
  id: number;
  name: string;
  psiscores?: PSIScoreType[];
  smartpages: string[];
  categorypage: string;
  status: number;
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


export type PsiDataAPIResponseType = {
  loadingExperience: {
    id: string;
    metrics: {
      FIRST_CONTENTFUL_PAINT_MS: {
        percentile: number;
      };
      FIRST_INPUT_DELAY_MS: {
        percentile: number;
      };
      CUMULATIVE_LAYOUT_SHIFT_SCORE: {
        percentile: number;
      };
      LARGEST_CONTENTFUL_PAINT_MS: {
        percentile: number;
      };
      EXPERIMENTAL_INTERACTION_TO_NEXT_PAINT: {
        percentile: number;
      };
      EXPERIMENTAL_TIME_TO_FIRST_BYTE: {
        percentile: number;
      };
    };
  };
  lighthouseResult: {
    audits: {
      'first-contentful-paint': {
        numericValue: number;
      };
      'speed-index': {
        numericValue: number;
      };
      interactive: {
        numericValue: number;
      };
      'total-blocking-time': {
        numericValue: number;
      };
      'max-potential-fid': {
        numericValue: number;
      };
      'cumulative-layout-shift': {
        numericValue: number;
      };
      'largest-contentful-paint': {
        numericValue: number;
      };
    },
    categories: {
      performance: {
        score: number;
      };
    };
  }
};

export type ScoreInfoType = {
  score: number;
  url: string;
}

  

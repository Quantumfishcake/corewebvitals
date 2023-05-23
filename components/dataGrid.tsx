import "react-data-grid/lib/styles.css";
// import DataGrid from "react-data-grid";
import { PSIScoreType } from "../types";
import { metricRanges } from "../constants";
import { InView } from 'react-intersection-observer';

import {
  GridColDef,
  DataGrid,
  GridRowModel,
  GridValueFormatterParams,
  GridCellParams
} from '@mui/x-data-grid';

const colSpanClassnameLow = 'text-green-600'
const colSpanClassnameMed = 'text-yellow-600'
const colSpanClassnameHigh = 'text-red-600'

const columnsInitial = [
  // { field: "scoreId", headerName: "ID", sortable: true, minWidth: 150, flex: 0.5, headerClassName: 'super-app-theme--header' },
  { field: "date", headerName: "Date", sortable: true ,type: "any"},
  { field: "lighthouse_score", headerName: "Score",type: "number" },
  { field: "lighthouse_fcp", headerName: "FCP" ,type: "number"},
  { field: "lighthouse_lcp", headerName: "LCP",type: "number" },
  { field: "lighthouse_si", headerName: "SI",type: "number" },
  { field: "lighthouse_tti", headerName: "TTI",type: "number" },
  { field: "lighthouse_tbt", headerName: "TBT",type: "number" },
  {
    field: "lighthouse_cls", headerName: "CLS",type: "number"
  },
  { field: "field_fcp", headerName: "Field FCP" ,type: "number"},
  { field: "field_lcp", headerName: "Field LCP" ,type: "number"},
  { field: "field_cls", headerName: "Field CLS" ,type: "number"},
  { field: "field_fid", headerName: "Field FID",type: "number" },
  { field: "field_inp", headerName: "Field INP",type: "number" },
  { field: "field_ttfb", headerName: "Field TTFB",type: "number" }
];

function isPSIScoreValue(value: string = ""): value is keyof PSIScoreType {
  switch (value) {
    case "scoreId":
    case "date":
    case "score_type":
    case "field_fcp":
    case "field_fid":
    case "field_cls":
    case "field_lcp":
    case "field_inp":
    case "field_ttfb":
    case "lighthouse_score":
    case "lighthouse_fcp":
    case "lighthouse_si":
    case "lighthouse_tti":
    case "lighthouse_tbt":
    case "lighthouse_cls":
    case "lighthouse_lcp":
      return true;
    default:
      return false;
  }
}

// @ts-ignore
const columns : GridColDef[] = columnsInitial.map((c) => ({
  ...c,
  cellClassName: (params: GridCellParams<any, number>) => {
    if (!metricRanges[c.field]) return ""
    if (c.field === 'lighthouse_score') {
      if (params.row[c.field] <= metricRanges[c.field][0]) return colSpanClassnameHigh;
      if (params.row[c.field] > metricRanges[c.field][0] && params.row[c.field] < metricRanges[c.field][1]) return colSpanClassnameMed;
      if (params.row[c.field] >= metricRanges[c.field][1]) return colSpanClassnameLow;
    }
    if (isPSIScoreValue(c.field)) {
      if (params.row[c.field] < metricRanges[c.field][0]) return colSpanClassnameLow;
      if (params.row[c.field] > metricRanges[c.field][0] && params.row[c.field] < metricRanges[c.field][1]) return colSpanClassnameMed;
      if (params.row[c.field] > metricRanges[c.field][1]) return colSpanClassnameHigh;
    }
    return ""
  },
  renderCell: (params: GridValueFormatterParams<number>) => {
    if (c.field === 'date') return new Date(params.value).toLocaleDateString()
    if (c.field === 'lighthouse_score') return params.value
    if (c.field === 'field_cls') return (params.value)
    if (c.field === 'lighthouse_cls') return (params.value.toFixed(3))
    if (isPSIScoreValue(c.field)) {
      return formatDataToSecondsAndMilliseconds(params.value)
    }
  }
}));

const DataGridContainer = ({ psiscores }: { psiscores: Array<PSIScoreType> }) => {
  
  const getLuxScoresOnly = (): PSIScoreType[] => {
    const luxScores = psiscores?.filter((score: PSIScoreType) => score.score_type === 1);
    // order by date
    const luxScoresWithId = luxScores?.map((score: PSIScoreType, index: number) => ({ ...score, id: index }));
    return luxScoresWithId?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  };
  const getClientScoresOnly = (): PSIScoreType[] => {
    const clientScores = psiscores?.filter((score: PSIScoreType) => score.score_type === 0);
    const clientScoresWithId = clientScores?.map((score: PSIScoreType, index: number) => ({ ...score, id: index }));
    // order by date
    return clientScoresWithId?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // only load the grid when inview (opened)
  return (
    <InView as="div" triggerOnce={true}>
      {({ inView, ref, entry }) => (
        <div ref={ref}>
          {inView ? <div id="data_grid_container" className="max-h-96 h-96 flex w-full">
            <DataGrid columns={columns} rows={getLuxScoresOnly()} sx={{
              boxShadow: 2,
              background: 'rgb(51 65 85)',
              border: 1,
              width: "100%",
              color: 'rgb(226 232 240)',
              borderColor: 'rgb(71 85 105)',
              '& .super-app-theme--header': {
                backgroundColor: 'rgb(15 23 42)',
              },
            }} />
            {/* <DataGrid columns={columns} rows={getClientScoresOnly()} /> */}
          </div> : null}
        </div>
      )}
    </InView>
  );
};

const formatDataToSecondsAndMilliseconds = (millis: number) => {
  if (!millis) return
  if (millis < 1000) return millis + 'ms'
  return (millis / 1000).toFixed(1) + 's'
};

export default DataGridContainer;


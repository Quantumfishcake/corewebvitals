import "react-data-grid/lib/styles.css";
import DataGrid from "react-data-grid";
import { PSIScoreType } from "../types";
import { metricRanges } from "../constants";

const colSpanClassnameLow = 'text-green-600'
const colSpanClassnameMed = 'text-yellow-600'
const colSpanClassnameHigh = 'text-red-600'

const columnsInitial = [
  { key: "date", name: "Date", sortable: true },
  { key: "lighthouse_score", name: "Score" },
  { key: "lighthouse_fcp", name: "FCP" },
  { key: "lighthouse_lcp", name: "LCP" },
  { key: "lighthouse_si", name: "SI" },
  { key: "lighthouse_tti", name: "TTI" },
  { key: "lighthouse_tbt", name: "TBT" },
  { key: "lighthouse_cls", name: "CLS" },
  { key: "field_fcp", name: "Field FCP" },
  { key: "field_lcp", name: "Field LCP" },
  { key: "field_cls", name: "Field CLS" },
  { key: "field_fid", name: "Field FID" },
  { key: "field_inp", name: "Field INP" },
  { key: "field_ttfb", name: "Field TTFB" }
];

function isPSIScoreValue(value: string = ""):value is keyof PSIScoreType {
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

const columns = columnsInitial.map((c) => ({
  ...c, cellClass(row: PSIScoreType) {
    if (!metricRanges[c.key]) return
    if (c.key === 'lighthouse_score') {
      if (row[c.key] <= metricRanges[c.key][0]) return colSpanClassnameHigh;
      if (row[c.key] > metricRanges[c.key][0] && row[c.key] < metricRanges[c.key][1]) return colSpanClassnameMed;
      if (row[c.key] >= metricRanges[c.key][1]) return colSpanClassnameLow;
    }
    if (isPSIScoreValue(c.key)) {
      if (row[c.key] < metricRanges[c.key][0]) return colSpanClassnameLow;
      if (row[c.key] > metricRanges[c.key][0] && row[c.key] < metricRanges[c.key][1]) return colSpanClassnameMed;
      if (row[c.key] > metricRanges[c.key][1]) return colSpanClassnameHigh;
    }
    return
  },
  formatter({ row }: { row: PSIScoreType }) {
    if (c.key === 'date') return new Date(row[c.key]).toLocaleDateString()
    if (c.key === 'lighthouse_score') return row[c.key]
    if (c.key === 'field_cls') return (row[c.key])
    if (c.key === 'lighthouse_cls') return (row[c.key].toFixed(3))
    if(isPSIScoreValue(c.key)){
      return formatDataToSecondsAndMilliseconds(row[c.key])
    }
  }
}));

const DataGridContainer = ({ psiscores, lux_url, client_url }: { psiscores: Array<PSIScoreType>, lux_url: string[], client_url: string }) => {

  const getLuxScoresOnly = () => {
    const luxScores = psiscores?.filter((score: PSIScoreType) => score.score_type === 1);
    // order by date
    return luxScores?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  };
  const getClientScoresOnly = () => {
    const clientScores = psiscores?.filter((score: PSIScoreType) => score.score_type === 0);
    // order by date
    return clientScores?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return (
    <div>
      <div className="p-2"><span>Lux page: </span><a href={lux_url[0]} target="_blank" rel="noreferrer" className="text-blue-400">{lux_url}</a></div>
      <DataGrid columns={columns} rows={getLuxScoresOnly()} />
      <div className="p-2"><span>Client page: </span><a href={client_url} target="_blank" rel="noreferrer" className="text-blue-400">{client_url}</a></div>
      <DataGrid columns={columns} rows={getClientScoresOnly()} />
    </div>
  );
};

const formatDataToSecondsAndMilliseconds = (millis: number) => {
  if (!millis) return
  if (millis < 1000) return millis + 'ms'
  return (millis / 1000).toFixed(1) + 's'
};

export default DataGridContainer;

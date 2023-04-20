import Collapse from "./collapse";
import DataGridContainer from "../components/dataGrid";

import { ClientDataType } from "../types";
import Chart from "./chart";


const ClientDataContainer: React.FC<{ client: ClientDataType }> = ({
  client,
}) => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <Collapse
        title={titleContainer(client)}
        content={datagridContentContainer(client)}
      />
    </div>
  );
};

const datagridContentContainer = (client: ClientDataType) => {
  if (!client.psiscores) return (<div>Loading...</div>)
  return (
    <div className="">
      <div className="w-full">LUX URL: {client.smartpages}</div>

      <div className="flex-1  h-80 w-full">
        <Chart psiscores={client.psiscores} />
      </div>
      <div className="flex-1 ">
        <DataGridContainer psiscores={client.psiscores} />
      </div>
    </div>
  );
};


// get the trend line from an array of numbers
const TrendingScore = (data: number[]) : number => {
  if (data.length === 0) return 0;
  const x = data.map((_, i) => i);
  const y = data;
  const xSum = x.reduce((a, b) => a + b);
  const ySum = y.reduce((a, b) => a + b);
  const xSquaredSum = x.map((n) => n * n).reduce((a, b) => a + b);
  const xySum = x.map((n, i) => n * y[i]).reduce((a, b) => a + b);
  const m = (data.length * xySum - xSum * ySum) / (data.length * xSquaredSum - xSum * xSum);
  const b = (ySum - m * xSum) / data.length;
  const z = x.map((n) => m * n + b);
  // round to whole number and return
  return Math.round(((z[z.length - 1] - z[0]) / z[0]) * 100);
};


const mostRecentLuxScore = (client: ClientDataType) : number => {
  if (!client.psiscores) return 0;
  const luxScores = client.psiscores?.filter((score) => score.score_type === 1);
  return luxScores[luxScores.length - 1]?.lighthouse_score;
}

const mostRecentCategoryScore = (client: ClientDataType) : number=> {
  if (!client.psiscores) return 0;
  const categoryScores = client.psiscores.filter((score) => score.score_type === 0);
  return categoryScores[categoryScores.length - 1]?.lighthouse_score;
}

const calcLuxPsiScores = (client: ClientDataType) : number[] => {
  if (!client.psiscores) return [];
  const luxScores = client.psiscores?.filter((score) => score.score_type === 1);
  return luxScores.map((score) => score.lighthouse_score);
}

const titleContainer = (client: ClientDataType) => {
  const luxPsiScores = calcLuxPsiScores(client)
  const color = mostRecentLuxScore(client) > mostRecentCategoryScore(client) ? "text-green-200" : "text-red-200";
  const color2 = mostRecentCategoryScore(client) > mostRecentLuxScore(client) ? "text-green-200" : "text-red-200";
  // set trendingcolor to green if over 100 yellow if between 50 and 100 and red if less than 50
  const trendingColor = TrendingScore(luxPsiScores) > 100 ? "text-green-200" : TrendingScore(luxPsiScores) > 30 ? "text-yellow-200" : "text-red-200";
  return (
    <div className="flex gap-5 text-slate-400">
      <h3
        className="text-2xl font-bold capitalize p-1 flex-1 text-slate-300 flex items-center"
      >
        {client.name}
      </h3>
      {client.psiscores && (
        <div className="flex-1 flex justify-center items-center">
          <div className="flex-1  flex justify-center items-center">
            <span className="text-base">LUX score</span>
            <span className={"text-3xl p-2 " + color} >
              {mostRecentLuxScore(client)}
            </span>
          </div>

          <div className="flex-1  flex flex-row-reverse justify-center items-center">
            <span className="text-base">Trending</span>
            <span className={"text-3xl p-2 " + trendingColor} >
              {TrendingScore(luxPsiScores)}%
            </span>
          </div>

          <div className="flex-1  flex flex-row-reverse justify-center items-center">
            <span className="text-base">Client category page Score </span>
            <span className={"text-3xl p-2 " + color2} >
              {mostRecentCategoryScore(client)}
            </span>
          </div>
        </div>

      )}
      {!client.psiscores && <div>Loading...</div>}

    </div>
  );
};

export default ClientDataContainer;

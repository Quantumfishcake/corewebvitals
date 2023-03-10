import Collapse from "./collapse";
import DataGridContainer from "../components/dataGrid";
import ClientChart from "./clientChart";

import { ClientDataType } from "../types";



const ClientDataContainer: React.FC<{ client: ClientDataType }> = ({
  client,
}) => {
  console.log('client', client)
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
  return (
    <div className="flex">
      <div className="flex-1 w-0">
        <DataGridContainer psiscores={client.psiscores} lux_url={client.smartpages} client_url={client.categorypage} />
        {/* <ClientChart scores={client.scores} /> */}
      </div>
    </div>
  );
};


const mostRecentLuxScore = (client:ClientDataType) => {
  const luxScores = client.psiscores.filter((score) => score.score_type === 1);
  return luxScores[luxScores.length - 1]?.lighthouse_score;
}

const mostRecentCategoryScore = (client:ClientDataType) => {
  const categoryScores = client.psiscores.filter((score) => score.score_type === 0);
  return categoryScores[categoryScores.length - 1]?.lighthouse_score;
}

// const averageLuxScore = (client:ClientDataType) => {
//   const luxScores = client.scores.filter((score) => score.score_type === 1).map(x => x.score).reduce( ( p, c ) => +p + +c, 0 );
//   return parseInt(luxScores / client.scores.filter((score) => score.score_type === 1).length);
// }

const titleContainer = (client: ClientDataType) => {
  if (!client) return <div>empty</div>;
  const color = mostRecentLuxScore(client) > mostRecentCategoryScore(client) ? "green" : "red";
  const color2 = mostRecentCategoryScore(client) > mostRecentLuxScore(client) ? "green" : "red";
  return (
    <div className="flex gap-5">
      <h3
        className="text-2xl font-bold capitalize p-1 flex-1"
        style={{ color }}
      >
        {client.name}
      </h3>
      <div className="flex-1 flex justify-center items-center">
        <span className="text-base">LUX latest score</span>
        <span className="text-3xl p-2" style={{ color }}>
          {mostRecentLuxScore(client)}
        </span>
        {/* <span className="text-base">LUX average score</span>
        <span className="text-3xl p-2" style={{ color }}>
          {averageLuxScore(client)}
        </span> */}
      </div>
      <div className="flex-1  flex flex-row-reverse justify-center items-center">
        <span className="text-base">Client category page Score </span>
        <span className="text-3xl p-2" style={{ color: color2 }}>
          {mostRecentCategoryScore(client)}
        </span>
      </div>
    </div>
  );
};

export default ClientDataContainer;

import Head from "next/head";
import styles from "@/styles/Home.module.css";
import ClientDataContainer from "@/components/clientDataContainer";
import PageSpeedInsightsComponent from "@/components/pageSpeedInsights";
import Modal from "@/components/modal";

import { PrismaClient, Prisma } from "@prisma/client";

export type ClientDataType = {
  id: number;
  name: string;
  psiscores: PSIScoreType[];
  scores: ScoreType[];
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

export type ScoreType = {
  scoreId: String;
  date: any;
  score_type: number;
  score: number;
}

export type ClientInfoType = {
  id: number;
  name: string;
  smartpages: string;
  categorypage: string;
  status: number;
};


export async function getServerSideProps() {
  let prisma;
  //check if we are running in production mode
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
  } else {
    if (!(global as any).prisma) {
      (global as any).prisma = new PrismaClient();
    }
    prisma = (global as any).prisma;
  }


  const clientData = await prisma.Client.findMany({
    // get all scores for each client where score type is 1
    // include: {
    //   scores:{
    //     where:{
    //       score_type: 1
    //     }
    //   }
    // },
    include: {
      scores: {
        orderBy: {
          date: 'asc',
        },
      },
      psiscores: {
        orderBy: {
          date: 'asc',
        },
      }
    },
  });
  const clientList = clientData.map((client: ClientInfoType) => {
    return {
      id: client.id,
      name: client.name,
      smartpages: client.smartpages,
      categorypage: client.categorypage
    };
  });
  // format dates to ISO string
  clientData.map((client: ClientDataType) => {
    client.scores.map((score: ScoreType) => {
      return (score.date = score.date.toISOString().split("T")[0]);
    });
    client.psiscores.map((psiscore:PSIScoreType) => {
      return (psiscore.date = psiscore.date.toISOString().split("T")[0]);
    });
  });
  // remove duplicate date scores 
  clientData.map((client: ClientDataType) => {
    client.psiscores = client.psiscores.filter((score:PSIScoreType, index: number, self: PSIScoreType[]) => {
      return index === self.findIndex((t: PSIScoreType) => (
        t.date === score.date && t.score_type === score.score_type
      ));
    });
  })
  // remove inactive clients 
  clientData.map((client: ClientDataType) => {
    if (client.status === 0) {
      clientData.splice(clientData.indexOf(client), 1);
    }
  });
  

  const clientDataSortedAlphabetically = clientData.sort((a: ClientDataType, b: ClientDataType) => a.name.localeCompare(b.name));
  return {
    props: {
      clientDataSortedAlphabetically,
      clientList,
    },
  };
}

const Home: React.FC<{ clientDataSortedAlphabetically: Array<ClientDataType>, clientList: Array<ClientInfoType> }> = ({ clientDataSortedAlphabetically, clientList }) => {

  return (
    <>
      <Head>
        <title>CWV</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div id="runPSI">
          <Modal title={'CWV Metrics Info'} body={'yp'} buttonText={'CWV Metrics Info'} />
          <PageSpeedInsightsComponent clientList={clientList} />
        </div>
        {clientDataSortedAlphabetically.map((client: ClientDataType) => {
          return (
            <ClientDataContainer key={client.id} client={client} />
          );
        })
        }
      </main>
    </>
  );
}

export default Home;
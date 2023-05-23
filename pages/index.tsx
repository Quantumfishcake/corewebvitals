import Head from "next/head";
import styles from "@/styles/Home.module.css";
import ClientDataContainer from "@/components/clientDataContainer";
import PageSpeedInsightsComponent from "@/components/pageSpeedInsights";
import ClientListContainer from "@/components/clientListContainer";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Nav from "@/components/nav";
import { PrismaClient } from "@prisma/client";
import { ToastContainer } from "react-toastify";
import { ClientDataType, PSIScoreType } from "@/types";
import SortDropdown from "@/components/sortDropdown";

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

  const clientData = await prisma.Client.findMany({});

  // remove inactive clients 
  // const clientList = clientData.filter((client: ClientDataType) => { return client.status === 1 });

  // sort alphabetically
  const clientListSortedAlphabetically = clientData.sort((a: ClientDataType, b: ClientDataType) => a.name.localeCompare(b.name));

  return {
    props: {
      clientListSortedAlphabetically,
    }
  };
}

const getClientData = async () => {
  const res = await fetch('/api/getClientData');
  const data = await res.json();
  return data;
}

const formatClientData = (clientData: Array<ClientDataType>) : Array<ClientDataType> => {


  // format dates
  clientData.map((client: ClientDataType) => {
    if(!client.psiscores) return;
    client.psiscores.map((psiscore: PSIScoreType) => {
      return (psiscore.date = psiscore.date.split("T")[0]);
    });
  });


  // return the highest score per day for each client 
  clientData.map((client: ClientDataType) => {
    if(!client.psiscores) return;
    client.psiscores = client.psiscores.filter((score: PSIScoreType, index: number, self: PSIScoreType[]) => {
      return index === self.findIndex((t: PSIScoreType) => (
        t.date === score.date && t.score_type === score.score_type
      ));
    });
  })

  // remove inactive clients 
  clientData = clientData.filter((client: ClientDataType) => { return client.status === 1 });

  // sort alphabetically
  return clientData.sort((a: ClientDataType, b: ClientDataType) => a.name.localeCompare(b.name));

}


const Home: React.FC<{ clientListSortedAlphabetically: ClientDataType[] }> = ({ clientListSortedAlphabetically }) => {

  // console.log('clients123',clientListSortedAlphabetically)

  const { isLoaded: userLoaded, isSignedIn } = useUser();
  const [clientData, setClientData] = useState<ClientDataType[] | []>(clientListSortedAlphabetically);
  const [sortStatus, setSortStatus] = useState<number>(1);

  const getData = async () => {
    const clientData = await getClientData();
    if(clientData.length === 0) return;
    const clientDataSortedAlphabetically = formatClientData(clientData);
    console.log('clientDataSortedAlphabetically',clientDataSortedAlphabetically)
    const test = clientDataSortedAlphabetically.map((client: ClientDataType) => {
      if(!client.psiscores) return;
      return {
        ...client, 
        psiscores: client.psiscores.map((psiscore: PSIScoreType) => {
        return {date: psiscore.date, score: psiscore.lighthouse_score, score_type: psiscore.score_type}
        })
    }
    })

    console.log('clientDataSortedAlphabetically',test)
    setClientData(clientDataSortedAlphabetically);
  }

  // setdata on load 
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    sortData();
  }, [sortStatus]);

  const sortData = () => {
    if(sortStatus == 1) {
      setClientData([...clientData].sort((a: ClientDataType, b: ClientDataType) => a.name.localeCompare(b.name)));
    } 
    if(sortStatus == 2) {
      setClientData([...clientData].sort((a: ClientDataType, b: ClientDataType) => {
        if(!a.psiscores || !b.psiscores) return 0;
        let aScore = a.psiscores.filter((score: PSIScoreType) => score.score_type === 1);
        let bScore = b.psiscores.filter((score: PSIScoreType) => score.score_type === 1);
        return bScore[bScore.length - 1 ].lighthouse_score - aScore[aScore.length - 1].lighthouse_score;
      }));
    }
    if(sortStatus == 3){
      // sort by client status = 1 vs client status = 2
      setClientData([...clientData].sort((a: ClientDataType, b: ClientDataType) => {
        if(!a.psiscores || !b.psiscores) return 0;
        let luxScoresA = a.psiscores.filter((score: PSIScoreType) => score.score_type === 1);
        let maxLuxScoreA = luxScoresA[luxScoresA.length - 1].lighthouse_score;
        let clientScoresA = a.psiscores.filter((score: PSIScoreType) => score.score_type === 0);
        let maxClientScoreA = clientScoresA[clientScoresA.length - 1].lighthouse_score ? clientScoresA[clientScoresA.length - 1].lighthouse_score : 0;
        let differenceA = (maxClientScoreA - maxLuxScoreA) / maxLuxScoreA;
        let luxScoresB = b.psiscores.filter((score: PSIScoreType) => score.score_type === 1);
        let maxLuxScoreB = luxScoresB[luxScoresB.length - 1].lighthouse_score;
        let clientScoresB = b.psiscores.filter((score: PSIScoreType) => score.score_type === 0);
        let maxClientScoreB = clientScoresB[clientScoresB.length - 1].lighthouse_score ? clientScoresB[clientScoresB.length - 1].lighthouse_score : 0;
        let differenceB = (maxClientScoreB - maxLuxScoreB) / maxLuxScoreB;
        return differenceA - differenceB
      }));
    }
  }

  const updateSortStatus = (newSortStatusValue: number) => {
    setSortStatus(() => newSortStatusValue);
  }

  if (!userLoaded) return <div />;

  return (
    <>
      <Head>
        <title>CWV</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <main className="bg-slate-900 p-10">
        {isSignedIn &&
          <div id="runPSI">
            <PageSpeedInsightsComponent clientList={clientListSortedAlphabetically} />
            <ClientListContainer clientList={clientListSortedAlphabetically} updateData={getData} />
          </div>}
        <SortDropdown updateSortStatus={updateSortStatus} />
        {clientData.map((client: ClientDataType ) => {
          return (
            <ClientDataContainer key={client.id} client={client} />
          );
        })
        }
        <ToastContainer />
      </main>
    </>
  );
}

export default Home;
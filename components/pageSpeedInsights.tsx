import axios from 'axios';
import {chunk} from 'lodash';
import { useState } from "react";
import Progressbar from './progressbar';


export type ClientInfoType = {
  id: number;
  name: string;
  smartpages: string;
  categorypage: string;
  status: number;
};

const PageSpeedInsightsComponent: React.FC<{ clientList: Array<ClientInfoType> }> = ({ clientList }) => {

  const [totalUrls, settotalUrls] = useState(0);
  const [totalFailed, setTotalFailed] = useState<string[]>([]);
  const [totalSuccessUrls, setTotalSuccessUrls] = useState<string[]>([]);

  // function runPSIForSiingleClient(client: ClientInfoType) {
  //   axios.get(setUpQuery(client.categorypage)).then(function (values) {
  //     formatAndPushData(values, client.id, 0)
  //   });
  //   axios.get(setUpQuery(client.smartpages)).then(function (values) {
  //     formatAndPushData(values, client.id, 1)
  //   });
  // }

  const updateProgress = (url:string, success_state:boolean) => {
    if(success_state){
      setTotalSuccessUrls(totalSuccessUrls => [...totalSuccessUrls, url])
    }else {
      setTotalFailed(totalFailed => [...totalFailed, url])
    }
  }
  
  async function runPSIForAllClients(clients: Array<ClientInfoType>) {
  
    type apiWaitListType = {
      url: string;
      client_id: number;
      score_type: number;
      unformattedUrl: string;
    };
  
    let apiWaitList: apiWaitListType[] = [];

    // remove inactive clients 
    clients.map((client: ClientInfoType) => {
      if (client.status === 0) {
        clients.splice(clients.indexOf(client), 1);
      }
    });
  
    clients.forEach(client => {
      const luxPage = client.smartpages
      const categoryPage = client.categorypage
      apiWaitList.push({ url: setUpQuery(luxPage), client_id: client.id, score_type: 1, unformattedUrl: luxPage })
      apiWaitList.push({ url: setUpQuery(categoryPage), client_id: client.id, score_type: 0, unformattedUrl: categoryPage })
    });
  
    settotalUrls(apiWaitList.length)
  
    const batchCalls = chunk(apiWaitList, 5);
  
    for (const batchCall of batchCalls) {
  
      await Promise.allSettled(batchCall.map((batch: apiWaitListType) => {
        return axios.get(batch.url).then(function (res) {
          updateProgress(batch.unformattedUrl, true)
          formatAndPushData(res.data, batch.client_id, batch.score_type)
  
        }).catch(err => {
          console.log(err)
          updateProgress(batch.unformattedUrl, false)
        });
      }))
    }
  }

  return (
    <div id="page_speed_insights_container">
      <Progressbar totalUrls={totalUrls} failedUrls={totalFailed} successfulUrls={totalSuccessUrls}/>
      <button onClick={() => runPSIForAllClients(clientList)}>RUN ALL </button>
    </div>
  )
}

type psiDataAPIResponseType = {
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

const formatAndPushData = (data:psiDataAPIResponseType, client_id: Number, score_type: Number) => {
  console.log('res',data)
  const cruxMetrics = {
    field_fcp: data.loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.percentile,
    field_fid: data.loadingExperience.metrics.FIRST_INPUT_DELAY_MS.percentile,
    field_cls: data.loadingExperience.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile,
    field_lcp: data.loadingExperience.metrics.LARGEST_CONTENTFUL_PAINT_MS.percentile,
    field_inp: data.loadingExperience.metrics.EXPERIMENTAL_INTERACTION_TO_NEXT_PAINT.percentile,
    field_ttfb: data.loadingExperience.metrics.EXPERIMENTAL_TIME_TO_FIRST_BYTE.percentile,
  };
  const lighthouse = data.lighthouseResult;
  const lighthouseMetrics = {
    lighthouse_fcp: Math.floor(lighthouse.audits['first-contentful-paint'].numericValue),
    lighthouse_si: Math.floor(lighthouse.audits['speed-index'].numericValue),
    lighthouse_tti: Math.floor(lighthouse.audits['interactive'].numericValue),
    lighthouse_tbt: Math.floor(lighthouse.audits['total-blocking-time'].numericValue),
    lighthouse_cls: lighthouse.audits['cumulative-layout-shift'].numericValue,
    lighthouse_lcp: Math.floor(lighthouse.audits['largest-contentful-paint'].numericValue),
    lighthouse_score: Math.floor(lighthouse.categories.performance.score * 100),
  };
  const psiMetrics = {
    client_id,
    score_type,
    ...cruxMetrics,
    ...lighthouseMetrics,
  };
  axios.post('/api/newPsiScore', psiMetrics)
}

function setUpQuery(url: string) {
  // if url is array use random value from array
  if (Array.isArray(url)) {
    url = url[Math.floor(Math.random() * url.length)];
  }

  const API_KEY = 'AIzaSyB5_4lGG6y46YQArKaO95JkYFr-UjRPI88';
  const query = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?key=${API_KEY}&strategy=mobile&url=${url}`;

  return query;
}

export default PageSpeedInsightsComponent;

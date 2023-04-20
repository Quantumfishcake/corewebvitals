import axios from 'axios';
import { chunk } from 'lodash';
import { useState } from "react";
import Progressbar from './progressbar';
import { toast } from 'react-toastify';
import { ClientDataType, ScoreInfoType, PsiDataAPIResponseType } from '@/types';

const PageSpeedInsightsComponent: React.FC<{ clientList: Array<ClientDataType> }> = ({ clientList }) => {

  const [totalUrls, settotalUrls] = useState(0);
  const [totalFailed, setTotalFailed] = useState<string[]>([]);
  const [totalSuccessUrls, setTotalSuccessUrls] = useState<ScoreInfoType[]>([]);
  const [cwvRunInProgress, setcwvRunInProgress] = useState(false);

  const updateProgress = (url: string, success_state: boolean, score?: number) => {
    if (success_state && score) {
      setTotalSuccessUrls(totalSuccessUrls => [...totalSuccessUrls, { url, score }])
    } else {
      setTotalFailed(totalFailed => [...totalFailed, url])
    }
  }

  async function runPSIForAllClients(clients: Array<ClientDataType>) {

    //open modal 
    const modalInput = document.getElementById('my-modal-3') as HTMLInputElement;
    if (modalInput != null) {
      modalInput.checked = true;
    }

    type apiWaitListType = {
      url: string;
      client_id: number;
      score_type: number;
      unformattedUrl: string;
    };

    let apiWaitList: apiWaitListType[] = [];
    setTotalSuccessUrls([]);
    setTotalFailed([]);
    settotalUrls(0);
    setcwvRunInProgress(true)

    clients.forEach(client => {
      if (client.status === 0) return;
      const luxPage = client.smartpages
      const categoryPage = client.categorypage
      apiWaitList.push({ url: setUpQuery(luxPage), client_id: client.id, score_type: 1, unformattedUrl: luxPage[0] })
      apiWaitList.push({ url: setUpQuery(categoryPage), client_id: client.id, score_type: 0, unformattedUrl: categoryPage })
    });

    settotalUrls(apiWaitList.length)

    const batchCalls = chunk(apiWaitList, 5);

    for (const batchCall of batchCalls) {

      await Promise.allSettled(batchCall.map((batch: apiWaitListType) => {
        return axios.get(batch.url).then(function (res) {
          updateProgress(batch.unformattedUrl, true, res.data?.lighthouseResult?.categories?.performance?.score)
          formatAndPushData(res.data, batch.client_id, batch.score_type)

        }).catch(err => {
          console.log(err)
          updateProgress(batch.unformattedUrl, false)
        });
      }))
    }
  }

  return (
    <div id="page_speed_insights_container" className="my-4 flex justify-end">

      {!cwvRunInProgress && <button className="btn btn-accent" onClick={() => runPSIForAllClients(clientList)}>Start CWV </button>}
      <label htmlFor="my-modal-3" className={"btn btn-accent " + (!cwvRunInProgress ? "hidden" : "")}>open CWV</label>
      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          <h3 className="text-lg font-bold mb-3">Runing CWV&apos;s</h3>
          <div>
            <Progressbar totalUrls={totalUrls} failedUrls={totalFailed} successfulUrls={totalSuccessUrls} />
          </div>

        </div>
      </div>
    </div>
  )
}

const formatAndPushData = (data: PsiDataAPIResponseType, client_id: Number, score_type: Number) => {
  const cruxMetrics = {
    field_fcp: data.loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS?.percentile,
    field_fid: data.loadingExperience.metrics.FIRST_INPUT_DELAY_MS?.percentile,
    field_cls: data.loadingExperience.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile,
    field_lcp: data.loadingExperience.metrics.LARGEST_CONTENTFUL_PAINT_MS?.percentile,
    field_inp: data.loadingExperience.metrics.EXPERIMENTAL_INTERACTION_TO_NEXT_PAINT?.percentile,
    field_ttfb: data.loadingExperience.metrics.EXPERIMENTAL_TIME_TO_FIRST_BYTE?.percentile,
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

  toast.promise(
    axios.post('/api/newPsiScore', psiMetrics),
    {
      pending: 'Sending new PSI score to API',
      success: {
        render({data}){
          return `Successfully updated client: ${data?.data?.client_id}`
        },
        icon: "🟢",
      },
      error: {
        render({data}){
          return `Failed to post ${data}`
        }
      }
    }
  )
}

function setUpQuery(url: string | string[]): string {
  // if url is array use random value from array
  if (Array.isArray(url)) {
    url = url[Math.floor(Math.random() * url.length)];
  }

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
  const query = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?key=${API_KEY}&strategy=mobile&url=${url}`;

  return query;
}

export default PageSpeedInsightsComponent;

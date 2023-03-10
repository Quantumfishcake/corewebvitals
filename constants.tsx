export type metricRangesType = {
    [key: string]: number[];
  }
  
  const metricRanges:metricRangesType = {
    field_ttfb: [800, 1800],
    field_inp: [200, 500], 
    field_lcp: [2500, 4000],
    field_cls: [10, 25],
    field_fid: [100, 300],
    field_fcp: [1800, 3000],
    lighthouse_lcp: [2500, 4000],
    lighthouse_cls: [0.10, 0.25],
    lighthouse_tbt: [200, 600],
    lighthouse_tti: [3800, 7350],
    lighthouse_si: [3400, 5800],
    lighthouse_fcp: [1800, 3000],
    lighthouse_score:[49, 89]
  }

  const cwvMetricInfo = [
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
    {key: "field_ttfb", name: "Field TTFB"},

  //   <div>
  //     <span>LCP</span>
  //     <span>Largest Contentful Paint</span>
  //     <span>LCP measures when the largest content element in the viewport is rendered to the screen. This approximates when the main content of the page is visible to users. [Learn more](https://web.dev/lighthouse-largest-contentful-paint/)</span>
  //     <span>numericUnit: "millisecond"</span>
  //     <span> 0-2.5	Green (fast)</span>
  //     <span> 2.5-4	Orange (moderate)</span>
  //     <span> Over 4	Red (slow)</span>
  //   </div>
  //    <div>
  //    <span>FCP</span>
  //    <span>First Contentful Paint</span>
  //    <span>FCP measures how long it takes the browser to render the first piece of DOM content after a user navigates to your page. Images, non-white <canvas> elements, and SVGs on your page are considered DOM content; anything inside an iframe isn't included.</span>
  //    <span>numericUnit: "millisecond"</span>
  //    <span> 0–1.8	Green (fast))</span>
  //    <span> 1.8–3	Orange (moderate)</span>
  //    <span> Over 3	Red (slow)</span>
  //  </div>
  ];

  









export { metricRanges }
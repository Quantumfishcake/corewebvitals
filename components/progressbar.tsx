import Collapse from "./collapse";

import { ScoreInfoType } from "@/types";

const Progressbar: React.FC<{ successfulUrls: ScoreInfoType[], failedUrls: String[], totalUrls: number }> = ({ successfulUrls, failedUrls, totalUrls }) => {
    if (totalUrls === 0) {
        return null
    }
    if (successfulUrls.length + failedUrls.length === totalUrls) {
        return <span>Finished</span>
    }
    const successTitle = () => {
        return (
            <div className="flex flex-wrap">
                <span>Successful Urls</span>
                <span className="ml-auto">{successfulUrls.length}</span>
            </div>
        )
    }
    const failedTitle = () => {
        return (
            <div className="flex flex-wrap">
                <span>Failed Urls</span>
                <span className="ml-auto">{failedUrls.length}</span>
            </div>
        )
    }
    return (
        <div className="flex flex-wrap bg-slate-800 p-5 rounded-box border-slate-700 border">
            <div className="flex justify-between w-full items-center">
                <progress className="progress progress-primary w-4/5 border-slate-700 border" value={successfulUrls.length + failedUrls.length} max={totalUrls}></progress>
                <div>Total: {successfulUrls.length + failedUrls.length} <span>/</span> {totalUrls}</div>
            </div>
            <div className="w-full mt-3">
                {successfulUrls.length ? <Collapse title={successTitle()} content={successfulUrls?.map((url, index) => <div key={index} className="flex justify-between hover:bg-slate-900"><div>{url.url}</div><div>{Math.round(url.score * 100)}</div></div>)} /> : null}
                {failedUrls.length ? <Collapse title={failedTitle()} content={failedUrls?.map((url, index) => <div key={index}>{url}</div>)} /> : null}
            </div>
        </div>
    )

}


export default Progressbar;
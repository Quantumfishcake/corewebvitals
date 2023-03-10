import Collapse from "./collapse";


const Progressbar: React.FC<{ successfulUrls: String[], failedUrls: String[], totalUrls: number }> = ({ successfulUrls, failedUrls, totalUrls }) => {
    if(totalUrls === 0){
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
        <div className="flex flex-wrap">
            <progress className="progress progress-primary w-72" value={successfulUrls.length + failedUrls.length} max={totalUrls}></progress>
            <span>Total: {successfulUrls.length + failedUrls.length} <span>/</span> {totalUrls}</span>

            <div className="w-full">
                {successfulUrls.length ? <Collapse title={successTitle()} content={successfulUrls?.map((url, index) => <div key={index}>{url}</div>)} /> : null}
                {failedUrls.length ? <Collapse title={failedTitle()} content={failedUrls?.map((url, index) => <div key={index}>{url}</div>)} /> : null}
            </div>
        </div>
    )

}


export default Progressbar;
import { useState } from "react";

const Collapse: React.FC<{title:React.ReactNode, content:React.ReactNode}> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      data-value="title"
      className={
        "flex-1 collapse border collapse-arrow border-slate-700  rounded-box bg-slate-800 " +
        (isOpen ? " collapse-open" : "collapse-close")
      }
    >
      <div
        className="collapse-title text-xl font-medium p-1 pr-10 pl-5 min-h-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </div>
      <div className="collapse-content bg-slate-800 text-slate-400 ">{content}</div>
    </div>
  );
}

export default Collapse;
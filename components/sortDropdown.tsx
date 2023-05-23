import { useState } from 'react';

const SortDropdown: React.FC<{ updateSortStatus: Function }> = ({ updateSortStatus }) => {

  const [sortLabel, setSortLabel] = useState<string>("Alphabetically");
  const [value, setValue] = useState<number>(1);

  const handleChange = (event: { target: { value: any; }; }) => {
    let value = event.target.value;
    setValue(value);
    updateSortStatus(value)
    switch (value) {
      case 1:
        setSortLabel("Alphabetically");
        break;
      case 2:
        setSortLabel("LUX Score");
        break;
      case 3:
        setSortLabel("Client comparison");
        break;
      case 4:
        setSortLabel("Trending");
        break;
      default:
        setSortLabel("Alphabetically");
        break;
    }
  };

  return (
    <select className="select select-primary w-full max-w-xs select-sm mb-3" value={value} onChange={handleChange}>
      {/* <option disabled selected>What is the best TV show?</option> */}
      <option value={1}>Alphabetically</option>
      <option value={2}>LUX Score</option>
      <option value={3}>Client Comparison</option>
      <option value={4}>Trending</option>
    </select>
  )
}

export default SortDropdown;  
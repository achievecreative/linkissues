import { useStats } from 'react-instantsearch';

const SearchResultTotals = (): JSX.Element => {
  const { nbHits } = useStats();
  return <span className="flex min-w-0">{nbHits} item(s)</span>;
};
export default SearchResultTotals;

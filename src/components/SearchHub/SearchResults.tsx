import { useInfiniteHits } from 'react-instantsearch';
import { AlgoliaRecord, HitProps, SearchResultsProps } from './SearchHub.types';
import { Hit } from 'instantsearch.js';
import SearchHubHitView from './SearchHubHitView';

const SearchResults = ({ layout }: SearchResultsProps): JSX.Element => {
  const { hits, results, isLastPage, showMore } = useInfiniteHits();

  function loadMore(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    showMore();
  }

  function getPageUrl() {
    if (results) {
      return `?page=${results.page + 1}`;
    }
    return '#';
  }

  const layoutCssClass =
    layout == '4 Columns' ? 'md:grid-cols-3 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3';

  return (
    <div>
      <ul className={`grid grid-cols-3 gap-6 sm:grid-cols-1 ${layoutCssClass}`}>
        {hits.map((item) => {
          const hit: HitProps = { hit: item as Hit<AlgoliaRecord> };
          return (
            <li key={item.objectID} className="col-span-1 flex flex-col bg-white">
              <SearchHubHitView {...hit} />
            </li>
          );
        })}
      </ul>
      {!isLastPage && (
        <div className="flex justify-center p-3 my-3 flex-col flex-grow-0">
          <p className="self-center">
            {hits.length} out of {results?.nbHits} items
          </p>
          <a
            href={getPageUrl()}
            className="btn border rounded-3xl border-solid border-gray-500 px-20 py-2 flex flex-row self-center"
            onClick={loadMore}
          >
            Load more
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 self-center stroke-blue-400"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
};

export default SearchResults;

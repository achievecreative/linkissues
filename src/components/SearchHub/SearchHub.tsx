import algoliasearch, { SearchClient } from 'algoliasearch';
import {
  Configure,
  CurrentRefinements,
  InstantSearch,
  InstantSearchSSRProvider,
  InstantSearchServerState,
  RefinementList,
  SearchBox,
  SortBy,
  getServerState,
} from 'react-instantsearch';
import styles from './SearchHub.module.css';
import SearchResults from './SearchResults';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchHubProps } from './SearchHub.types';
import { SortByItem } from 'instantsearch.js/es/connectors/sort-by/connectSortBy';
import { GetStaticComponentProps } from '@sitecore-jss/sitecore-jss-nextjs';
import Image from 'next/image';
import SearchResultTotals from './SearchResutsTotal';
import { renderToString } from 'react-dom/server';

const SearchHub = (props: SearchHubProps): JSX.Element => {
  const { fields } = props;
  const serverState: InstantSearchServerState = props;

  //default page size
  const hitPerPage = fields?.pageSize > 0 ? fields.pageSize : 16;

  //initial page index
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();

  //algolia search client
  const searchClient: SearchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APPID as string,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY as string
  );

  //sorting methods
  const sortbys: SortByItem[] = [];
  fields?.sortings?.map((item) => {
    sortbys.push({ label: item.fields?.title?.value, value: item.fields?.value?.value });
  });

  //default index
  const defaultIndexName = sortbys?.length > 0 ? sortbys[0].value : '';

  const initialUiState: Record<string, { page: number }> = {};
  initialUiState[defaultIndexName] = { page: page };

  //predefine filters
  let filters = '';
  if (fields?.excludedTemplates?.length > 0) {
    const contentTypes: Array<string> = [];
    fields.excludedTemplates.map((item) => {
      contentTypes.push(`NOT contentType: '${item.fields?.value?.value}'`);
    });
    filters = contentTypes.join(' AND ');
  } else if (fields?.includedTemplates?.length > 0) {
    const contentTypes: Array<string> = [];
    fields.includedTemplates.map((item) => {
      contentTypes.push(`contentType: '${item.fields?.value?.value}'`);
    });
    filters = contentTypes.join(' AND ');
  }

  //get page index from URL
  useEffect(() => {
    const pageString = searchParams.get('page');
    if (pageString) {
      setPage(+pageString);
    }
  }, []);

  function showInstanceSearch() {
    return (
      <InstantSearchSSRProvider {...serverState}>
        <InstantSearch
          searchClient={searchClient}
          indexName={defaultIndexName}
          initialUiState={initialUiState}
        >
          <Configure filters={filters} hitsPerPage={hitPerPage} />
          <div className="flex flex-col md:flex-row">
            <div className="flex-1">
              <div className="grid grid-cols-[1fr,auto] items-center mb-3">
                <div className="ml-6 flex items-center">
                  <label className="self-center">Sort by</label>
                </div>
              </div>
              <SearchResults layout={fields.layout?.fields?.value?.value} />
            </div>
          </div>
        </InstantSearch>
      </InstantSearchSSRProvider>
    );
  }

  return <div>{showInstanceSearch()}</div>;
};

export const getStaticProps: GetStaticComponentProps = async (rendering) => {
  const props = rendering as unknown as SearchHubProps;
  const serverState = await getServerState(<SearchHub {...props} />, {
    renderToString,
  });
  console.log('🚀', serverState);
  return serverState;
};
export default SearchHub;

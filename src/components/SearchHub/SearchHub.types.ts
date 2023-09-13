import { Field, ImageField, Item, RichTextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { Hit } from 'instantsearch.js';
import { ComponentProps } from 'lib/component-props';
import { InstantSearchServerState } from 'react-instantsearch';

export type AlgoliaRecord = {
  listingTitle: string;
  listingSummary: string;
  listingThumbnail?: string;
  url: string;
  contentType: string;
  categories: Array<string>;

  //products
  roundelTag?: string;
  skus?: AlgoliaSKURecord[];

  //articles
  author: string;
  articleDate: string;
  timeToRead: string;
};

export type AlgoliaSKURecord = {
  title: string;
  code: string;
  quantity: string;
  retailPrice: string;
  salePrice: string;
};

export type HitProps = {
  hit: Hit<AlgoliaRecord>;
};

export type SearchHubProps = ComponentProps &
  InstantSearchServerState & {
    fields: {
      filters: EnumItem[];
      sortings: EnumItem[];
      includedTemplates: EnumItem[];
      excludedTemplates: EnumItem[];
      enableSearchBox: Field<string>;
      description: RichTextField;
      pageSize: number;
      layout?: EnumItem;
      displayTotalNumber?: Field<string>;

      searchboxTitle?: Field<string>;
      searchboxSubTitle: Field<string>;
      searchboxBackgroundImage: ImageField;
    };
    serverUrl?: string;
  };

export type EnumItem = Item & {
  fields: {
    title: Field<string>;
    value: Field<string>;
  };
};

export type SearchResultsProps = {
  layout?: string;
};

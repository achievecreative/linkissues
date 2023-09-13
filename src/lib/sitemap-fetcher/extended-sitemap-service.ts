import {
  GraphQLSitemapService,
  GraphQLSitemapServiceConfig,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { RouteListQueryResult } from '@sitecore-jss/sitecore-jss-nextjs/types/services/base-graphql-sitemap-service';
import { SearchQueryService } from '@sitecore-jss/sitecore-jss/graphql';

export interface ExtendedSitemapServiceConfig extends GraphQLSitemapServiceConfig {
  /**
   * excludeItemId - Item with sub-paths to exclude
   * excludeTemplateId - Items with template to exlcude
   **/
  excludeItemId?: string;
  excludeTemplateId?: string;
}

export type PageListQueryResult = { url: { path: string } };

const emptyId = '{00000000-0000-0000-0000-000000000000}';

export class ExtendedSitemapService extends GraphQLSitemapService {
  private searchService: SearchQueryService<PageListQueryResult>;

  protected get query(): string {
    return /* GraphQL */ `
      query SitemapQuery(
        $rootItemId: String!
        $language: String!
        $pageSize: Int = 100
        $hasLayout: String = "true"
        $after: String
        $excludeItemId: String = "${this.options.excludeItemId ?? emptyId}"
        $excludeTemplateId: String = "${this.options.excludeTemplateId ?? emptyId}"
      ) {
        search(
          where: {
            AND: [
              { name: "_path", value: $rootItemId, operator: CONTAINS }
              { name: "_path", value: $excludeItemId, operator: NCONTAINS }
              { name: "_templates", value: $excludeTemplateId, operator: NCONTAINS}
              { name: "_language", value: $language }
              { name: "_hasLayout", value: $hasLayout }
            ]
          }
          first: $pageSize
          after: $after
        ) {
          total
          pageInfo {
            endCursor
            hasNext
          }
          results {
            url {
              path
            }
          }
        }
      }
    `;
  }
  constructor(public options: ExtendGraphQLSitemapServiceConfig) {
    super(options);

    this.searchService = new SearchQueryService<PageListQueryResult>(this.graphQLClient);
  }

  protected async fetchLanguageSitePaths(
    _language: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _siteName: string
  ): Promise<RouteListQueryResult[]> {
    const formatPath = (path: string[]) => ({
      path: path.join('/'),
    });

    const languages = [_language];

    const paths = await Promise.all(
      languages.map((language) => {
        return this.searchService
          .fetch(this.query, {
            rootItemId: this.options.rootItemId,
            language,
            pageSize: this.options.pageSize,
          })
          .then((results) => {
            return results.map((item) =>
              formatPath(item.url.path.replace(/^\/|\/$/g, '').split('/'))
            );
          });
      })
    );

    const array: RouteListQueryResult[] = [];
    paths.forEach((p) => {
      p.forEach((x) => array.push(x));
    });

    return array;
  }
}

export interface ExtendGraphQLSitemapServiceConfig extends GraphQLSitemapServiceConfig {
  rootItemId?: string;
  excludeItemId?: string;
  excludeTemplateId?: string;
}

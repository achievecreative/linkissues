import { HitProps } from './SearchHub.types';
import { ProductTile, ProductTileProps } from './Tiles';

const SearchHubHitView = ({ hit }: HitProps): JSX.Element => {
  const prices: string[] = [];
  hit.skus?.map((item) => {
    if (item.retailPrice) {
      prices.push(item.retailPrice);
    }
  });

  const productTileProps: ProductTileProps = {
    title: hit.listingTitle,
    summary: hit.listingSummary,
    imageSrc: hit.listingThumbnail as string,
    url: hit.url,
    roundelLabel: hit.roundelTag,
    price: prices.length > 0 ? prices.sort()[0] : '',
  };

  return <ProductTile {...productTileProps} />;
};

export default SearchHubHitView;

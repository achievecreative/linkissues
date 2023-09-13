import Link from 'next/link';

export type ProductTileProps = {
  title: string;
  summary: string;
  price?: string;
  roundelLabel?: string;
  imageSrc: string;
  imageAlt?: string;
  url: string;
};

export const ProductTile = (props: ProductTileProps): JSX.Element => {
  return (
    <div>
      <div>
        <Link href={props.url}>
          <img
            src={props.imageSrc}
            style={{ width: 100, height: 100 }}
            alt={props.imageAlt || props.title}
          />
        </Link>
      </div>
      <h2>
        <Link href={props.url}>{props.title}</Link>
      </h2>
    </div>
  );
};

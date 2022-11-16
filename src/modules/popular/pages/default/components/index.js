import useStyles from '@core_modules/popular/pages/default/components/style';
import GridList from '@common_gridlist';
import ProductItem from '@core_modules/catalog/plugins/ProductItem';
import Typography from '@common_typography';

const PopularPage = (props) => {
    const { products, t } = props;
    const styles = useStyles();
    return (
        <div>
            <Typography variant="h2">
                {t('popular:titlePage')}
            </Typography>
            <GridList
                data={products}
                ItemComponent={ProductItem}
                className="grid"
                itemProps={{
                    isGrid: true,
                    catalogList: true,
                    className: 'grid-item',
                }}
                gridItemProps={{
                    xs: 6, sm: 4, md: 3,
                }}
            />
        </div>
    )
}

export default PopularPage
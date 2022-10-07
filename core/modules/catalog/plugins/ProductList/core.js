/* eslint-disable no-empty */
/* eslint-disable array-callback-return */
/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import Router, { useRouter } from 'next/router';
import getQueryFromPath from '@helper_generatequery';
import TagManager from 'react-gtm-module';
import { getProduct, getProductAgragations } from '@core_modules/catalog/services/graphql';
import * as Schema from '@core_modules/catalog/services/graphql/productSchema';
import getCategoryFromAgregations from '@core_modules/catalog/helpers/getCategory';
import generateConfig from '@core_modules/catalog/helpers/generateConfig';
import Content from '@plugin_productlist/components';

const Product = (props) => {
    const {
        catId = 0,
        catalog_search_engine,
        customFilter,
        url_path,
        defaultSort,
        t,
        categoryPath,
        ErrorMessage,
        storeConfig,
        query,
        path,
        availableFilter,
        token,
        isLogin,
        ...other
    } = props;
    const router = useRouter();
    const [products, setProducts] = React.useState({
        total_count: 0,
        items: [],
    });

    const [loadmore, setLoadmore] = React.useState(false);
    const [filterSaved, setFilterSaved] = React.useState(false);
    const elastic = catalog_search_engine === 'elasticsuite';
    let config = {
        customFilter: false,
        search: '',
        pageSize: 8,
        currentPage: 1,
        filter: [],
        ...storeConfig.pwa,
    };

    // set default sort when there is no sort in query
    if (defaultSort && !query.sort) {
        query.sort = JSON.stringify(defaultSort);
    }

    const setFiltervalue = (v) => {
        setFilterSaved(true);
        let queryParams = '';
        // eslint-disable-next-line array-callback-return
        Object.keys(v).map((key) => {
            if (key === 'selectedFilter') {
                // eslint-disable-next-line no-restricted-syntax
                for (const idx in v.selectedFilter) {
                    if (v.selectedFilter[idx] !== '' && !v[idx]) {
                        queryParams += `${queryParams !== '' ? '&' : ''}${idx}=${v.selectedFilter[idx]}`;
                    }
                }
            } else if (v[key] !== 0 && v[key] !== '') {
                queryParams += `${queryParams !== '' ? '&' : ''}${key}=${v[key]}`;
            }
        });
        Router.push(`/${url_path || '[...slug]'}`, encodeURI(`${path}${queryParams ? `?${queryParams}` : ''}`));
    };
    if (catId !== 0) {
        config.filter.push({
            type: 'category_id',
            value: catId,
        });
    }

    config = generateConfig(query, config, elastic, availableFilter);
    let context = (isLogin && isLogin === 1) || (config.sort && config.sort.key === 'random') ? { request: 'internal' } : {};
    if (token && token !== '') {
        context = {
            ...context,
            headers: {
                authorization: token,
            },
        };
    }

    const { loading, data, fetchMore } = getProduct(
        config,
        {
            variables: {
                pageSize: parseInt(storeConfig?.pwa?.page_size, 0) || 10,
                currentPage: 1,
            },
            context,
            fetchPolicy: config.sort && config.sort.key === 'random' && filterSaved ? 'cache-and-network' : 'cache-first',
        },
        router,
    );
    // generate filter if donthave custom filter
    const aggregations = [];
    if (!customFilter && !loading && products.aggregations) {
        // eslint-disable-next-line no-plusplus
        for (let index = 0; index < products.aggregations.length; index++) {
            aggregations.push({
                field: products.aggregations[index].attribute_code,
                label: products.aggregations[index].label,
                value: products.aggregations[index].options,
            });
        }
    }
    const category = getCategoryFromAgregations(aggregations);

    // eslint-disable-next-line no-shadow
    const renderEmptyMessage = (count, loading) => {
        if (count || loading) {
            return null;
        }
        return <ErrorMessage variant="warning" text={t('catalog:emptyProductSearchResult')} open />;
    };

    const handleLoadMore = async () => {
        setFilterSaved(false);
        const pageSize = storeConfig.pwa ? parseInt(storeConfig?.pwa?.page_size, 0) : 10;
        const pageTemp = (data.products.items.length / (parseInt(storeConfig?.pwa?.page_size, 0) || 10) + 1);
        try {
            if (fetchMore && typeof fetchMore !== 'undefined') {
                setLoadmore(true);
                fetchMore({
                    query: Schema.getProduct({ ...config, currentPage: pageTemp }, router),
                    variables: {
                        pageSize,
                        currentPage: pageTemp,
                    },
                    context,
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        setLoadmore(false);
                        return {
                            products: {
                                ...fetchMoreResult.products,
                                items: [...previousResult.products.items, ...fetchMoreResult.products.items],
                            },
                        };
                    },
                });
            }
        } catch (error) {
            setLoadmore(false);
        }
    };

    React.useEffect(() => {
        if (data && data.products) {
            setProducts(data.products);
            const tagManagerArgs = {
                dataLayer: {
                    event: 'impression',
                    eventCategory: 'Ecommerce',
                    eventAction: 'Impression',
                    eventLabel: categoryPath ? `category ${categoryPath}` : '',
                    ecommerce: {
                        currencyCode: storeConfig && storeConfig.base_currency_code ? storeConfig.base_currency_code : 'IDR',
                        impressions: data.products.items.map((product, index) => {
                            let categoryProduct = '';
                            // eslint-disable-next-line no-unused-expressions
                            product.categories.length > 0
                                && product.categories.map(({ name }, indx) => {
                                    if (indx > 0) categoryProduct += `/${name}`;
                                    else categoryProduct += name;
                                });
                            return {
                                name: product.name,
                                id: product.sku,
                                category: categoryProduct,
                                price: product.price_range.minimum_price.regular_price.value,
                                list: categoryProduct,
                                position: index,
                            };
                        }),
                    },
                },
            };
            TagManager.dataLayer(tagManagerArgs);
        }
    }, [data]);

    React.useEffect(() => {
        const handleRouteChange = () => {
            if (router.pathname === '/catalogsearch/result') {
                window.history.scrollRestoration = 'manual';
                const sessionStorageItems = ['lastCatalogSearchOffset', 'lastProductSearchVisited', 'lastCatalogSearchVisited', 'restoreCatalogSearchPosition'];
                const lastCatalogOffset = parseFloat(sessionStorage.getItem('lastCatalogSearchOffset'));
                const prevUrl = sessionStorage.getItem('prevUrl');
                const lastProductVisited = sessionStorage.getItem('lastProductSearchVisited');
                const restoreCatalogSearchPosition = sessionStorage.getItem('restoreCatalogSearchPosition');
                if (prevUrl === lastProductVisited && restoreCatalogSearchPosition && lastCatalogOffset !== 0) {
                    window.scrollTo({
                        top: lastCatalogOffset,
                    });
                    sessionStorageItems.forEach((item) => {
                        sessionStorage.removeItem(item);
                    });
                }
            }
        };
        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);

    React.useEffect(() => {
        if (router.pathname !== '/catalogsearch/result') {
            const sessionStorageItems = ['lastCatalogOffset', 'lastProductVisited', 'lastCatalogVisited', 'restoreCatalogPosition'];
            window.history.scrollRestoration = 'manual';
            const lastCatalogOffset = parseFloat(sessionStorage.getItem('lastCatalogOffset'));
            const prevUrl = sessionStorage.getItem('prevUrl');
            const lastProductVisited = sessionStorage.getItem('lastProductVisited');
            const restoreCatalogPosition = sessionStorage.getItem('restoreCatalogPosition');
            if (prevUrl === lastProductVisited && restoreCatalogPosition && lastCatalogOffset !== 0) {
                window.scrollTo({
                    top: lastCatalogOffset,
                });
                sessionStorageItems.forEach((item) => {
                    sessionStorage.removeItem(item);
                });
            }
        }
    }, [storeConfig]);

    const contentProps = {
        loadmore,
        loading,
        t,
        query,
        customFilter,
        elastic,
        aggregations,
        setFiltervalue,
        category,
        defaultSort,
        config,
        products,
        categoryPath,
        handleLoadMore,
        renderEmptyMessage,
        storeConfig,
    };

    return <Content {...contentProps} {...other} />;
};

Product.propTypes = {
    // eslint-disable-next-line react/require-default-props
    catId: PropTypes.number,
    // eslint-disable-next-line react/require-default-props
    catalog_search_engine: PropTypes.string,
};

const ProductWrapper = (props) => {
    const router = useRouter();
    const { path, query } = getQueryFromPath(router);

    let availableFilter = [];
    let loadingAgg;
    if (Object.keys(query).length > 0) {
        const { data: agg, loading } = getProductAgragations();
        loadingAgg = loading;
        availableFilter = agg && agg.products ? agg.products.aggregations : [];
    }
    if (loadingAgg) {
        return <span />;
    }
    return <Product {...props} availableFilter={availableFilter} path={path} query={query} />;
};

export default ProductWrapper;

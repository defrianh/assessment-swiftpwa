//lakukan query graphql disini
//gabung hasil query dan views juga disini

import Layout from '@layout';
import { getPopularProduct } from '@core_modules/popular/services/graphql';

const Popular = (props) => {
    const {
        Content,
        t,
        pageConfig,
    } = props;

    const { data, loading } = getPopularProduct();

    const Config = {
        title: 'Popular Page',
        headerTitle: 'Popular Page',
        header: 'relative', // available values: "absolute", "relative", false (default)
        bottomNav: false,
    };

    if (loading) {
        return (
            <Layout {...props} pageConfig={pageConfig || Config}>
                <h1>Loading....</h1>
            </Layout>
        );
    }

    const products = data.products.items

    return (
        <Layout {...props} pageConfig={pageConfig || Config}>
            <Content products={products} t={t}/>
        </Layout>
    );
}

export default Popular;
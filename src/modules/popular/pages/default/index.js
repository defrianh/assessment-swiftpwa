//gabungin core sama view
import { withTranslation } from '@i18n';
import { withApollo } from '@lib_apollo';
import Content from '@core_modules/popular/pages/default/components';
import Core from '@core_modules/popular/pages/default/core';

const Page = (props) => (
    <Core {...props} Content={Content} />
);

export default withApollo({ ssr: true })(withTranslation()(Page));
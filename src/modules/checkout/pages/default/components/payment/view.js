/* eslint-disable no-plusplus */
/* eslint-disable no-shadow */
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/Accordion';
import MuiExpansionPanelSummary from '@material-ui/core/AccordionSummary';
import MuiExpansionPanelDetails from '@material-ui/core/AccordionDetails';
import Grid from '@material-ui/core/Grid';

import Typography from '@common_typography';
import Button from '@common_button';
import Arrow from '@material-ui/icons/ArrowDropDown';
import Radio from '@common_forms/Radio';
import Skeleton from '@material-ui/lab/Skeleton';
import commonConfig from '@config';
import FieldPoint from '@core_modules/checkout/components/fieldcode';
import RadioItem from '@core_modules/checkout/components/radioitem';
import ModalHowtoPay from '@core_modules/checkout/pages/default/components/ModalHowtoPay';
import useStyles from '@core_modules/checkout/pages/default/components/style';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import TravelokaPayForm from '@core_modules/checkout/pages/default/components/payment/components/TravelokaPayForm';
import { ExpanDetailStyle, ExpanPanelStyle, ExpanSummaryStyle } from './style';

const ExpansionPanel = withStyles(ExpanPanelStyle)(MuiExpansionPanel);
const ExpansionPanelSummary = withStyles(ExpanSummaryStyle)(MuiExpansionPanelSummary);
const ExpansionPanelDetails = withStyles(ExpanDetailStyle)(MuiExpansionPanelDetails);
const PO = 'purchaseorder';
const PaypalCode = 'paypal_express';
const travelokapay = 'travelokapay';

/**
 * Loader
 * @returns {COMPONENT}
 */
const Loader = () => (
    <>
        <Skeleton variant="rect" width="100%" height={20} animation="wave" style={{ marginBottom: 10 }} />
        <Skeleton variant="rect" width="100%" height={20} animation="wave" style={{ marginBottom: 10 }} />
        <Skeleton variant="rect" width="100%" height={20} animation="wave" style={{ marginBottom: 10 }} />
    </>
);

const PaymentGroupIcon = (props) => {
    const { baseMediaUrl, src } = props;
    const fallbacks = [`${baseMediaUrl}checkout/payment/paymenticons-${src.replace('pg-', '')}.svg`, null];
    const styles = useStyles();

    // check if image exist on the backoffice, otherwise use fallback image from PWA
    const [imageSrc, setImageSrc] = React.useState(`./assets/img/paymenticons-${src.replace('pg-', '')}.svg`);
    const [fallbackImageIndex, setFallbackImageIndex] = React.useState(0);

    // set image fallback url
    const getFallbackImageSrc = () => {
        if (fallbackImageIndex > fallbacks.length) {
            return;
        }
        setImageSrc(fallbacks[fallbackImageIndex]);
        setFallbackImageIndex(fallbackImageIndex + 1);
    };

    return (
        <>
            {(imageSrc && (
                <img
                    className={styles.paymentGroupStyleIcon}
                    src={imageSrc}
                    alt={src.replace('pg-', '')}
                    onError={() => getFallbackImageSrc()}
                />
            ))
                || ''}
        </>
    );
};

/**
 * [VIEW] Payment
 * @param {object} props
 * @returns
 */
const PaymentView = (props) => {
    const styles = useStyles();
    const {
        loading,
        data,
        checkout,
        t,
        paymentMethodList,
        handlePayment,
        handlePurchaseOrder,
        handlePurchaseOrderSubmit,
        selected,
        paypalTokenData,
        paypalHandlingProps,
        initialOptionPaypal,
        travelokaPayRef,
        storeConfig,
        displayHowToPay,
        setDisplayHowToPay,
    } = props;
    const { payment_travelokapay_bin_whitelist, payment_travelokapay_public_key, payment_travelokapay_user_id } = storeConfig;
    const { modules } = commonConfig;
    const [expanded, setExpanded] = React.useState(null);
    const [expandedActive, setExpandedActive] = React.useState(true);
    const [openModal, setModal] = React.useState(false);

    let content;

    /**
     * [METHOD] handle change
     * @param {*} panel
     * @returns
     */
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
        setExpandedActive(false);
    };

    /**
     * [METHOD] handle modal
     * @param {*} state
     */
    const handleModal = (state = false) => {
        setModal(state);
    };

    /**
     * [MAIN] return of view
     */
    if (loading.payment || loading.all) {
        content = <Loader />;
    } else if (data.cart.prices.grand_total.value === 0) {
        content = <Typography variant="p">{t('checkout:noNeedPayment')}</Typography>;
    } else if (data.paymentMethod.length !== 0 && paymentMethodList && paymentMethodList.storeConfig) {
        let paymentConfig = JSON.parse(`${paymentMethodList.storeConfig.payments_configuration}`);
        const groups = paymentConfig ? Object.keys(paymentConfig) : [];
        // create grouping by config
        paymentConfig = groups.map((key) => {
            const groupData = [];
            let config = paymentConfig[key];
            config = config.split(',');
            for (let idx = 0; idx < data.paymentMethod.length; idx++) {
                const element = data.paymentMethod[idx];
                for (let idc = 0; idc < config.length; idc++) {
                    if (config[idc] === element.code) {
                        groupData.push(element);
                    }
                }
            }
            let active = false;
            if (groupData.length > 0) {
                // ad active key if on group data selected payment method
                if (selected.payment) {
                    for (let idx = 0; idx < groupData.length; idx += 1) {
                        const element = groupData[idx];
                        if (element.code === selected.payment) {
                            active = true;
                        }
                    }
                }
            }
            return {
                group: key,
                data: groupData,
                active,
            };
        });

        // check if have active on group data by default selected if
        let itemActive = false;
        if (paymentConfig) {
            for (let idx = 0; idx < paymentConfig.length; idx += 1) {
                const element = paymentConfig[idx];
                if (element.active) {
                    itemActive = true;
                }
            }
        }
        // console.log('storeConfig', payment_travelokapay_bin_whitelist, payment_travelokapay_public_key, payment_travelokapay_user_id);
        content = (
            <div>
                <Typography variant="p">{t('checkout:paymentSubtitle')}</Typography>
                {paymentConfig && (
                    <div className={styles.paymentExpansionContainer}>
                        {paymentConfig.map((item, index) => {
                            if (item.data.length !== 0) {
                                return (
                                    <ExpansionPanel
                                        expanded={
                                            expanded === index // if key index same with expanded active
                                            || (item.active && expandedActive) // expand if item active and not change expand
                                            || (!itemActive && expandedActive && index === 0)
                                        } // if dont have item active, set index 0 to active
                                        onChange={handleChange(index)}
                                        key={index}
                                    >
                                        <ExpansionPanelSummary
                                            aria-controls="panel1d-content"
                                            className={styles.accourdionNavy}
                                            id={`panel-${item.group}`}
                                            expandIcon={<Arrow className={styles.icon} />}
                                            IconButtonProps={{
                                                className: 'checkout-paymentGroupping-expand',
                                            }}
                                        >
                                            <div className={styles.labelSummary}>
                                                <PaymentGroupIcon src={item.group} baseMediaUrl={storeConfig.base_media_url} />
                                                <Typography style={{color:'white'}} letter="uppercase" variant="span" type="bold">
                                                    {t(`checkout:paymentGrouping:${item.group.replace('pg-', '')}`)
                                                    === `paymentGrouping.${item.group.replace('pg-', '')}`
                                                        ? item.group.replace('pg-', '')
                                                        : t(`checkout:paymentGrouping:${item.group.replace('pg-', '')}`)}
                                                </Typography>
                                            </div>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>
                                            <Grid container>
                                                {item.data.length !== 0 ? (
                                                    <Grid item xs={12}>
                                                        <Radio
                                                            value={selected.payment}
                                                            onChange={handlePayment}
                                                            valueData={item.data}
                                                            CustomItem={RadioItem}
                                                            ComponentOptional={(item) => {
                                                                // prettier-ignore
                                                                const isPurchaseOrder = item.code === PO && selected.payment === PO;
                                                                const isPaypal = item.code === PaypalCode && selected.payment === PaypalCode;
                                                                const isTravelokaPay = item.code === travelokapay
                                                                    && selected.payment === travelokapay;

                                                                if (isPurchaseOrder) {
                                                                    return (
                                                                        <Grid item xs={12}>
                                                                            <FieldPoint
                                                                                id="purchase-order"
                                                                                name="purchase-order"
                                                                                placeholder={t('checkout:purchaseOrderNumber')}
                                                                                action={handlePurchaseOrderSubmit}
                                                                                onChange={handlePurchaseOrder}
                                                                                value={checkout.selected.purchaseOrderNumber || ''}
                                                                                disabled={checkout.loading.purchaseOrderNumber}
                                                                                loading={checkout.loading.purchaseOrderNumber}
                                                                                styleFrame={{ marginTop: 0, marginBottom: 0 }}
                                                                                styleFrameText={{ marginTop: 0, marginBottom: 0 }}
                                                                                styleTextField={{ marginTop: 0, marginBottom: 0 }}
                                                                            />
                                                                        </Grid>
                                                                    );
                                                                }
                                                                if (
                                                                    isPaypal
                                                                    && !paypalTokenData.loading
                                                                    && initialOptionPaypal['data-order-id'] !== ''
                                                                ) {
                                                                    return (
                                                                        <Grid item xs={12} lg="3" md="4">
                                                                            <PayPalScriptProvider defer options={initialOptionPaypal}>
                                                                                <PayPalButtons
                                                                                    style={{ layout: 'horizontal' }}
                                                                                    {...paypalHandlingProps}
                                                                                />
                                                                            </PayPalScriptProvider>
                                                                        </Grid>
                                                                    );
                                                                }
                                                                if (isTravelokaPay) {
                                                                    return (
                                                                        <TravelokaPayForm
                                                                            checkout={checkout}
                                                                            payment_travelokapay_bin_whitelist={payment_travelokapay_bin_whitelist}
                                                                            payment_travelokapay_public_key={payment_travelokapay_public_key}
                                                                            payment_travelokapay_user_id={payment_travelokapay_user_id}
                                                                            travelokaPayRef={travelokaPayRef}
                                                                        />
                                                                    );
                                                                }

                                                                return null;
                                                            }}
                                                            propsItem={{
                                                                borderBottom: false,
                                                                RightComponent: true,
                                                            }}
                                                        />
                                                    </Grid>
                                                ) : null}
                                            </Grid>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                );
                            }
                            return null;
                        })}
                    </div>
                )}
            </div>
        );
    } else if (checkout.selected.delivery === 'pickup') {
        content = <Typography variant="p">{t('checkout:noPaymentPickup')}</Typography>;
    } else {
        content = <Typography variant="p">{t('checkout:noPayment')}</Typography>;
    }

    return (
        <div className={styles.block} id="checkoutPayment">
            <ModalHowtoPay
                open={openModal}
                setOpen={() => handleModal(false)}
                setDisplayHowToPay={setDisplayHowToPay}
            />
            <div className={styles.paymentHeader}>
                <Typography variant="title" type="bold" letter="uppercase">
                    {t('checkout:payment')}
                </Typography>
                {(modules.checkout.howtoPay.enabled && displayHowToPay) ? (
                    <div>
                        <Button className={styles.howToPay} onClick={() => handleModal(true)}>
                            {t('checkout:howtoPay')}
                        </Button>
                    </div>
                ) : null}
            </div>
            <div>{content}</div>
        </div>
    );
};

export default PaymentView;

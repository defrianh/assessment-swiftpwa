import { makeStyles } from '@material-ui/core/styles';
import {
    WHITE, BLACK, GRAY_LIGHT, RED,
} from '@theme_color';
import {
    Centering,
} from '@theme_mixins';

const useStyles = makeStyles(() => ({
    container: {
        width: '390px',
        height: '100vh',
        padding: '60px 10px',
        backgroundColor: WHITE,
        position: 'relative',
    },
    mini_top: {
        position: 'absolute',
        top: 0,
        left: 0,
        minHeight: 50,
        width: '100%',
        backgroundColor: BLACK,
        color: WHITE,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0px 10px',
        '& span': {
            cursor: 'pointer',
        },
    },
    mini_bottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        minHeight: 50,
        width: '100%',
        '& .sub-total': {
            backgroundColor: GRAY_LIGHT,
            color: BLACK,
            height: 50,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0px 10px',
            textTransform: 'uppercase',
        },
        '& .edit-cart': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 40,
            cursor: 'pointer',
            textTransform: 'uppercase',
            fontSize: 10,
        },
        '& .checkout': {
            minHeight: 50,
            paddingBottom: 10,
            width: '100%',
            color: WHITE,
            cursor: 'pointer',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        '& .checkout-button': {
            backgroundColor: BLACK,
            width: '90%',
            height: 45,
            cursor: 'pointer',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 10,
        },
    },
    miniCartItems: {
        margin: '0',
        padding: '0',
        listStyle: 'none none',
        textTransform: 'uppercase',
        '& li': {
            padding: '5px 0px',
            position: 'relative',
            borderBottom: '1px solid #ccc',
            '& .product': {
                minHeight: 80,
                display: 'flow-root',
            },
            '& .product-item-photo': {
                float: 'left',
                width: '75px',
                height: '75px',
                position: 'relative',
                '& span': {
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    zIndex: 1,
                    minWidth: 15,
                    minHeight: 10,
                    backgroundColor: RED,
                    color: WHITE,
                    fontWeight: '700',
                    fontSize: 8,
                    padding: 2,
                    borderRadius: 3,
                    ...Centering,
                    marginLeft: 'auto',
                    marginRight: 5,
                    textTransform: 'uppercase',
                },
            },
            '& .product-item-details': {
                paddingLeft: 88,
            },
            '& .product-options': {
                '& .option-wrapper': {
                    fontSize: 10,
                    '& .option-wrapper__item': {
                        paddingLeft: 10,
                    },
                },
            },
            '& .product-item-pricing': {
                paddingLeft: 88,
                fontSize: 10,
                height: 20,
                '& .details-qty': {
                    float: 'left',
                    marginTop: 5,
                    '& .label': {
                        float: 'left',
                        padding: '0 20px 0 0',
                        width: 'auto',
                    },
                    '& .item-minus': {
                        cursor: 'pointer',
                        '&::after': {
                            content: '"<"',
                        },
                    },
                    '& .item-count': {
                        padding: '0px 10px',
                    },
                    '& .item-plus': {
                        cursor: 'pointer',
                        '&::after': {
                            content: '">"',
                        },
                    },
                },
                '& .item-price': {
                    marginTop: 5,
                    float: 'right',
                    fontSize: 12,
                    fontWeight: 'bold',
                },
            },
            '& .delete': {
                position: 'absolute',
                top: 10,
                right: 0,
                fontSize: 10,
                cursor: 'pointer',
                width: 10,
                height: 10,
            },
        },
    },
    emptyCart: {
        marginTop: 40,
        textAlign: 'center',
        fontSize: 10,
        textTransform: 'uppercase',
    },
}));

export default useStyles;

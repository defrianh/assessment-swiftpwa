import makeStyles from '@material-ui/core/styles/makeStyles';

import {
    CreatePadding, FlexColumn, CreateMargin, Centering,
} from '@theme_mixins';
import { PRIMARY } from '@theme_color';

export default makeStyles((theme) => ({
    title: {
        marginBottom: 30,
        marginLeft: 0,
        fontSize: 30,
    },
    productname: {
        fontSize:'15pt',
        textAlign:'center',
        marginBottom:2
    },
    productprice: {
        marginTop:2,
        fontSize:'12pt',
        textAlign:'center'
    }
}));

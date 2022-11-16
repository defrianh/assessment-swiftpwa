/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import TextField from '@common_textfield';
import PasswordField from '@common_password';
import Button from '@common_button';
import Typography from '@common_typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider';
import { breakPointsUp } from '@helper_theme';
import classNames from 'classnames';
import firebase from 'firebase/app';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import ReCAPTCHA from 'react-google-recaptcha';
import OtpBlock from '@plugin_otp';
import OtpView from '@plugin_otp/view';
import useStyles from '@core_modules/login/pages/default/components/style';
import { features } from '@config';

const Login = (props) => {
    const {
        formik,
        otpConfig,
        isOtp,
        setIsOtp,
        t,
        setDisabled,
        disabled,
        loading,
        formikOtp,
        toastMessage,
        socialLoginMethodData,
        socialLoginMethodLoading,
        enableRecaptcha,
        sitekey,
        handleChangeCaptcha,
        recaptchaRef,
        query,
        formikPhoneEmail,
        phonePassword,
        handleChangePhone,
    } = props;
    const styles = useStyles();
    const desktop = breakPointsUp('sm');

    const signInOptions = [];
    
    if (features.firebase.config.apiKey !== '' && firebase && firebase.auth && socialLoginMethodData && socialLoginMethodData.length > 0) {
        for (let idx = 0; idx < socialLoginMethodData.length; idx += 1) {
            const code = socialLoginMethodData[idx];
            if (code.match(/google/i) && firebase.auth.GoogleAuthProvider && firebase.auth.GoogleAuthProvider.PROVIDER_ID) {
                signInOptions.push(firebase.auth.GoogleAuthProvider.PROVIDER_ID);
            }

            if (code.match(/facebook/i) && firebase.auth.FacebookAuthProvider && firebase.auth.FacebookAuthProvider.PROVIDER_ID) {
                signInOptions.push(firebase.auth.FacebookAuthProvider.PROVIDER_ID);
            }

            if (code.match(/twitter/i) && firebase.auth.TwitterAuthProvider && firebase.auth.TwitterAuthProvider.PROVIDER_ID) {
                signInOptions.push(firebase.auth.TwitterAuthProvider.PROVIDER_ID);
            }

            if (code.match(/github/i) && firebase.auth.GithubAuthProvider && firebase.auth.GithubAuthProvider.PROVIDER_ID) {
                signInOptions.push(firebase.auth.GithubAuthProvider.PROVIDER_ID);
            }

            if (code.match(/email/i) && firebase.auth.EmailAuthProvider && firebase.auth.EmailAuthProvider.PROVIDER_ID) {
                signInOptions.push(firebase.auth.EmailAuthProvider.PROVIDER_ID);
            }
        }
    }

    const uiConfig = {
        signInFlow: 'popup',
        signInOptions,
        callbacks: {
            signInSuccessWithAuthResult: () => false,
        },
    };

    const [firebaseLoaded, setFirebaseLoaded] = useState(false);

    useEffect(() => {
        if (features.firebase.config.apiKey === '') {
            setFirebaseLoaded(false);
        } else {
            setFirebaseLoaded(true);
        }
    }, [firebaseLoaded]);

    return (
        <div className={styles.container}>
            {!desktop && otpConfig.data && otpConfig.data.otpConfig.otp_enable[0].enable_otp_login && (
                <FormControlLabel
                    control={<Switch checked={isOtp} onChange={() => setIsOtp(!isOtp)} name="useOtp" color="primary" />}
                    className={classNames(styles.selectLogin, 'hidden-desktop')}
                    label={t('login:switchPhone')}
                />
            )}
            <div className={classNames('row between-sm between-md between-lg', styles.desktopContainer)}>
                <div className="col-sm-2 col-md-6 col-md-offset-3 hidden-mobile">
                    <Typography type="bold" variant="h1" className={styles.title}>
                        {t('login:customerLogin')}
                    </Typography>
                </div>
                <div className="col-sm-2 col-md-6 col-md-offset-3">
                    <div className="row">
                        <div className="col-sm-12 hidden-mobile">
                            <div className={styles.headerSpan}>
                                <Typography variant="span" className="clear-margin-padding" letter="uppercase">
                                    {t('login:registerCustomer')}
                                </Typography>
                            </div>
                        </div>
                        
                        {(!isOtp || desktop) && phonePassword === false && (
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className={classNames(styles.spanLabel, 'hidden-mobile')}>
                                    <Typography type="bold" variant="p" className="clear-margin-padding">
                                        {t('login:loginInformation')}
                                    </Typography>
                                </div>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="row center-xs start-sm">
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <TextField
                                                id="login-email-textfield"
                                                name="username"
                                                label="Email"
                                                placeholder="john.doe@gmail.com"
                                                value={formik.values.username}
                                                onChange={formik.handleChange}
                                                error={!!formik.errors.username}
                                                errorMessage={formik.errors.username || null}
                                            />
                                        </div>
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <PasswordField
                                                id="login-password-passfield"
                                                name="password"
                                                label="Password"
                                                placeholder="********"
                                                value={formik.values.password}
                                                onChange={formik.handleChange}
                                                error={!!formik.errors.password}
                                                errorMessage={formik.errors.password || null}
                                                showVisible
                                            />
                                        </div>
                                        <div className="col-xs-12  col-sm-12">
                                            {enableRecaptcha ? (
                                                <>
                                                    <ReCAPTCHA sitekey={sitekey} onChange={handleChangeCaptcha} ref={recaptchaRef} />
                                                    {formik.errors.captcha && <Typography color="red">{formik.errors.captcha}</Typography>}
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <Button
                                                id="login-signin-button"
                                                className={styles.generalButton}
                                                fullWidth={!desktop}
                                                type="submit"
                                                disabled={desktop ? false : disabled}
                                                align={desktop ? 'left' : 'center'}
                                            >
                                                <Typography variant="span" type="bold" letter="uppercase">
                                                    {loading ? 'Loading' : t('login:pageTitle')}
                                                </Typography>
                                            </Button>
                                        </div>
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            {firebaseLoaded && firebase.app() && !socialLoginMethodLoading && (
                                                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
                                            )}
                                        </div>
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <Button
                                                fullWidth={false}
                                                variant="text"
                                                href="/customer/account/forgotpassword"
                                                align={desktop ? 'left' : 'center'}
                                            >
                                                <Typography variant="span" type="regular" letter="capitalize" decoration="underline">
                                                    {t('login:forgotPassword')}
                                                </Typography>
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}
                        {(!isOtp || desktop) && phonePassword !== false && (
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className={classNames(styles.spanLabel, 'hidden-mobile')}>
                                    <Typography type="bold" variant="p" className="clear-margin-padding">
                                        {t('login:loginPhoneEmailInformation')}
                                    </Typography>
                                </div>
                                <form onSubmit={formikPhoneEmail.handleSubmit}>
                                    <div className="row center-xs start-sm">
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <TextField
                                                id="login-email-textfield"
                                                name="username"
                                                // eslint-disable-next-line max-len
                                                label={
                                                    otpConfig.data && otpConfig.data.otpConfig.otp_enable[0].enable_otp_login
                                                        ? t('login:emailLabel')
                                                        : t('login:phoneEmailLabel')
                                                }
                                                // eslint-disable-next-line max-len
                                                placeholder={
                                                    otpConfig.data && otpConfig.data.otpConfig.otp_enable[0].enable_otp_login
                                                        ? t('login:emailFields')
                                                        : t('login:phoneEmailFields')
                                                }
                                                value={formikPhoneEmail.values.username}
                                                onChange={formikPhoneEmail.handleChange}
                                                error={!!formikPhoneEmail.errors.username}
                                                errorMessage={formikPhoneEmail.errors.username || null}
                                            />
                                        </div>
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <PasswordField
                                                id="login-password-passfield"
                                                name="password"
                                                label="Password"
                                                placeholder="********"
                                                value={formikPhoneEmail.values.password}
                                                onChange={formikPhoneEmail.handleChange}
                                                error={!!formikPhoneEmail.errors.password}
                                                errorMessage={formikPhoneEmail.errors.password || null}
                                                showVisible
                                            />
                                        </div>
                                        <div className="col-xs-12  col-sm-12">
                                            {enableRecaptcha ? (
                                                <>
                                                    <ReCAPTCHA sitekey={sitekey} onChange={handleChangeCaptcha} ref={recaptchaRef} />
                                                    {formikPhoneEmail.errors.captcha && (
                                                        <Typography color="red">{formikPhoneEmail.errors.captcha}</Typography>
                                                    )}
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <Button
                                                id="login-signin-button"
                                                className={styles.generalButton}
                                                fullWidth={!desktop}
                                                type="submit"
                                                disabled={desktop ? false : disabled}
                                                align={desktop ? 'left' : 'center'}
                                            >
                                                <Typography variant="span" type="bold" letter="uppercase">
                                                    {loading ? 'Loading' : t('login:pageTitle')}
                                                </Typography>
                                            </Button>
                                        </div>
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            {firebaseLoaded && firebase.app() && !socialLoginMethodLoading && (
                                                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
                                            )}
                                        </div>
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <Button
                                                fullWidth={false}
                                                variant="text"
                                                href="/customer/account/forgotpassword"
                                                align={desktop ? 'left' : 'center'}
                                            >
                                                <Typography variant="span" type="regular" letter="capitalize" decoration="underline">
                                                    {t('login:forgotPassword')}
                                                </Typography>
                                            </Button>
                                            <Button
                                                fullWidth={false}
                                                variant="text"
                                                href="/customer/account/create"
                                                align={desktop ? 'left' : 'center'}
                                            >
                                                <Typography variant="span" type="regular" letter="capitalize" decoration="underline">
                                                    {t('login:notHaveAccount')}
                                                </Typography>
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 hidden-mobile">
                            <div className={classNames('row middle-sm', styles.spanDivider)}>
                                <div className="col-sm-12">
                                    <Divider />
                                </div>
                            </div>
                        </div>
                        {(isOtp || desktop) && otpConfig.data && otpConfig.data.otpConfig.otp_enable[0].enable_otp_login && (
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className={classNames(styles.spanLabel, 'hidden-mobile')}>
                                    <Typography type="bold" variant="p" className="clear-margin-padding">
                                        {t('login:loginOtpInformation')}
                                    </Typography>
                                </div>
                                <form onSubmit={formikOtp.handleSubmit} className={styles.formOtp}>
                                    <div className="row center-xs start-sm">
                                        <div className="col-xs-12 col-sm-12">
                                            <OtpBlock
                                                setDisabled={setDisabled}
                                                type="login"
                                                OtpView={OtpView}
                                                phoneProps={{
                                                    name: 'username',
                                                    placeholder: '+6281234xxxx',
                                                    value: formikOtp.values.username,
                                                    onChange: handleChangePhone,
                                                    error: !!formikOtp.errors.username,
                                                    errorMessage: formikOtp.errors.username || null,
                                                }}
                                                codeProps={{
                                                    name: 'otp',
                                                    value: formikOtp.values.otp,
                                                    onChange: formikOtp.handleChange,
                                                    error: !!(formikOtp.touched.otp && formikOtp.errors.otp),
                                                    errorMessage: (formikOtp.touched.otp && formikOtp.errors.otp) || null,
                                                }}
                                            />
                                        </div>
                                        <div className="col-xs-12  col-sm-12">
                                            {enableRecaptcha ? (
                                                <>
                                                    <ReCAPTCHA sitekey={sitekey} onChange={handleChangeCaptcha} ref={recaptchaRef} />
                                                    {formik.errors.captcha && <Typography color="red">{formik.errors.captcha}</Typography>}
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="col-xs-12 col-sm-12">
                                            <Button
                                                id="login-signin-button"
                                                className={styles.generalButton}
                                                fullWidth={!desktop}
                                                type="submit"
                                                disabled={disabled}
                                                align={desktop ? 'left' : 'center'}
                                            >
                                                <Typography variant="span" type="bold" letter="uppercase">
                                                    {loading ? 'Loading' : t('common:button:submit')}
                                                </Typography>
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
                {toastMessage}
            </div>
            <style jsx global>
                {`
                    @media screen and (max-width: 768px) {
                        .firebaseui-card-content {
                            width: 100%;
                            padding: 0px !important;
                        }
                        .firebaseui-card-footer {
                            padding: 0px !important;
                        }
                    }

                    .firebaseui-container {
                        display: flex !important;
                        flex-direaction: column !important;
                        justify-content: flex-start !important;
                        max-width: 100% !important;
                    }

                    .firebaseui-card-content {
                        padding: 0px !important;
                    }
                `}
            </style>
        </div>
    );
};

export default Login;

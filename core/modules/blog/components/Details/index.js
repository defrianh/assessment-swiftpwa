/* eslint-disable react/no-danger */
import Typography from '@common_typography';
import { modules } from '@config';
import formatDate from '@helper_date';
import { getHost } from '@helper_config';
import Divider from '@material-ui/core/Divider';
import Button from '@common_button';
import Link from 'next/link';
import useStyles from '@core_modules/blog/components/Details/style';
import ShareIcons from '@core_modules/blog/components/ShareIcon';
import { generateThumborUrl, getImageFallbackUrl } from '@helpers/image';

const Detail = (props) => {
    const {
        title, publish_date, featured_image_url, featured_image_alt, url_key,
        short = true, t, short_content, content, storeConfig,
    } = props;

    const { link, featuredImage } = modules.blog;
    const enable = storeConfig.pwa.thumbor_enable;
    const useHttpsOrHttp = storeConfig.pwa.thumbor_https_http;
    const url = storeConfig.pwa.thumbor_url;
    const imageUrl = generateThumborUrl(featured_image_url, 500, 500, enable, useHttpsOrHttp, url);
    const styles = useStyles();

    return (
        <div className={styles.containerItemBlog}>
            <Typography variant="h1" className={styles.itemTitle} letter="capitalize">
                {title}
            </Typography>
            <div className={styles.dateShare}>
                <Typography variant="p">{formatDate(publish_date || Date.now())}</Typography>
                <Divider orientation="vertical" flexItem />
                <ShareIcons url={`${getHost() + modules.blog.urlPath}/${url_key}`} />
            </div>
            {
                featuredImage
                    ? (

                        <div className={styles.imageBlogContainer}>
                            <source srcSet={imageUrl} type="image/webp" />
                            <source srcSet={getImageFallbackUrl(imageUrl)} type="image/jpeg" />
                            <img
                                src={imageUrl}
                                alt={featured_image_alt}
                                className={styles.imageBlog}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/assets/img/placeholder.png';
                                }}
                            />
                        </div>
                    )
                    : null
            }
            {
                !short
                    ? (
                        <>
                            <div classNames={styles.content} dangerouslySetInnerHTML={{ __html: content }} />
                            <div className={styles.shareBottom}>
                                <Typography>
                                    {t('blog:share')}
                                    {' '}
                                    :
                                </Typography>
                                <ShareIcons url={`${getHost() + modules.blog.urlPath}/${url_key}`} />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.content} dangerouslySetInnerHTML={{ __html: short_content }} />
                            <Link href={link.detail.href} as={link.detail.as + url_key}>
                                <a>
                                    <Button rootClassName={styles.btnRead}>
                                        <Typography color="white" letter="uppercase" varinat="span" type="bold">
                                            {t('blog:readMore')}
                                        </Typography>
                                    </Button>
                                </a>
                            </Link>
                        </>
                    )
            }
        </div>
    );
};

export default Detail;

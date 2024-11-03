import otakudesu from '../src/otakudesu.js';
import resolveUrl from '../src/lib/resolveUrl.js';

const getUrl = async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({
            status: 'Error',
            message: 'Missing required "url" parameter. Please include the PixelDrain URL you want to process.'
        });
    }

    try {

        const resultUrl = await resolveUrl(url);

        return res.status(200).json({
            status: 'Ok',
            data: resultUrl
        });
    } catch (error) {
        console.error('Error resolving PixelDrain URL:', error);
        return res.status(500).json({
            status: 'Error',
            message: error.message
        });
    }
};

const getPdrain = async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({
            status: 'Error',
            message: 'Missing required "url" parameter. Please include the PixelDrain URL you want to process.'
        });
    }

    try {
        const resolvedUrl = await resolveUrl(url); // Call resolveUrl as a library function

        // Extract the ID from the resolved URL
        const idMatch = resolvedUrl.match(/https:\/\/pixeldrain\.com\/u\/([a-zA-Z0-9]+)/);
        if (!idMatch) {
            return res.status(400).json({
                status: 'Error',
                message: 'Invalid PixelDrain URL format. Please provide a valid PixelDrain user URL.'
            });
        }

        const fileId = idMatch[1];
        const apiUrl = `https://pixeldrain.com/api/file/${fileId}`;

        return res.status(200).json({
            status: 'Ok',
            data: apiUrl
        });
    } catch (error) {
        console.error('Error resolving PixelDrain URL:', error);
        return res.status(500).json({
            status: 'Error',
            message: error.message
        });
    }
};

const searchAnimeHandler = async (req, res) => {
    const { keyword } = req.params;
    let data;
    try {
        data = await otakudesu.search(keyword);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ status: 'Error', message: 'Internal server error' });
    }
    return res.status(200).json({ status: 'Ok', data });
};
const homeHandler = async (_, res) => {
    let data;
    try {
        data = await otakudesu.home();
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ status: 'Error', message: 'Internal server error' });
    }
    return res.status(200).json({ status: 'Ok', data });
};
const ongoingAnimeHandler = async (req, res) => {
    const { page } = req.params;
    if (page) {
        if (!parseInt(page))
            return res.status(400).json({ status: 'Error', message: 'The page parameter must be a number!' });
        if (parseInt(page) < 1)
            return res.status(400).json({ status: 'Error', message: 'The page parameter must be greater than 0!' });
    }
    let result;
    try {
        result = page ? await otakudesu.ongoingAnime(parseInt(page)) : await otakudesu.ongoingAnime();
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ status: 'Error', message: 'Internal server error' });
    }
    const { paginationData, ongoingAnimeData } = result;
    if (!paginationData)
        return res.status(404).json({ status: 'Error', message: 'There\'s nothing here ;_;' });
    return res.status(200).json({ status: 'Ok', data: ongoingAnimeData, pagination: paginationData });
};
const completeAnimeHandler = async (req, res) => {
    const { page } = req.params;
    if (page) {
        if (!parseInt(page))
            return res.status(400).json({ status: 'Error', message: 'The page parameter must be a number!' });
        if (parseInt(page) < 1)
            return res.status(400).json({ status: 'Error', message: 'The page parameter must be greater than 0!' });
    }
    let result;
    try {
        result = page ? await otakudesu.completeAnime(parseInt(page)) : await otakudesu.completeAnime();
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ status: 'Error', message: 'Internal server error' });
    }
    const { paginationData, completeAnimeData } = result;
    if (!paginationData)
        return res.status(404).json({ status: 'Error', message: 'There\'s nothing here ;_;' });
    return res.status(200).json({ status: 'Ok', data: completeAnimeData, pagination: paginationData });
};
const singleAnimeHandler = async (req, res) => {
    const { slug } = req.params;
    let data;
    try {
        data = await otakudesu.anime(slug);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ status: 'Error', message: 'Internal server error' });
    }
    if (!data)
        return res.status(404).json({ status: 'Error', message: 'There\'s nothing here ;_;' });
    return res.status(200).json({ status: 'Ok', data });
};
const episodesHandler = async (req, res) => {
    const { slug } = req.params;
    let data;
    try {
        data = await otakudesu.episodes(slug);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ status: 'Error', message: 'Internal server error' });
    }
    if (!data)
        return res.status(404).json({ status: 'Error', message: 'There\'s nothing here ;_;' });
    return res.status(200).json({ status: 'Ok', data });
};
const episodeByEpisodeSlugHandler = async (req, res) => {
    const { slug } = req.params;
    let data;
    try {
        data = await otakudesu.episode({ episodeSlug: slug });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ status: 'Ok', message: 'Internal server error' });
    }
    if (!data)
        return res.status(404).json({ status: 'Error', message: 'There\'s nothing here ;_;' });
    return res.status(200).json({ status: 'Ok', data });
};
const episodeByEpisodeNumberHandler = async (req, res) => {
    const { slug: animeSlug, episode } = req.params;
    if (!parseInt(episode))
        return res.status(400).json({ status: 'Error', message: 'The episode NUMBER parameter must be a NUMBER!' });
    if (parseInt(episode) < 1)
        return res.status(400).json({ status: 'Error', message: 'The episode number parameter must be greater than 0!' });
    let data;
    try {
        data = await otakudesu.episode({ animeSlug, episodeNumber: parseInt(episode) });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ status: 'Error', message: 'Internal server error' });
    }
    if (!data)
        return res.status(404).json({ status: 'Error', message: 'There\'s nothing here ;_;' });
    return res.status(200).json({ status: 'Ok', data });
};
const batchByBatchSlugHandler = async (req, res) => {
    const { slug } = req.params;
    let data;
    try {
        data = await otakudesu.batch({ batchSlug: slug });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ status: 'Error', message: 'Internal server error' });
    }
    return res.status(200).json({ status: 'Ok', data });
};
const batchHandler = async (req, res) => {
    const { slug } = req.params;
    let data;
    try {
        data = await otakudesu.batch({ animeSlug: slug });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ status: 'Error', message: 'Internal server error' });
    }
    return data ? res.status(200).json({ status: 'Ok', data }) : res.status(404).json({
        status: 'Error',
        message: 'This anime doesn\'t have a batch yet ;_;'
    });
};
const genreListsHandler = async (_, res) => {
    let data;
    try {
        data = await otakudesu.genreLists();
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ status: 'Error', message: 'Internal server error' });
    }
    return res.status(200).json({ status: 'Ok', data });
};
const animeByGenreHandler = async (req, res) => {
    const { slug, page } = req.params;
    if (page) {
        if (!parseInt(page))
            return res.status(400).json({ status: 'Error', message: 'The page parameter must be a number!' });
        if (parseInt(page) < 1)
            return res.status(400).json({ status: 'Error', message: 'The page parameter must be greater than 0!' });
    }
    let data;
    try {
        data = await otakudesu.animeByGenre(slug, page);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ status: 'Error', message: 'Internal server error' });
    }
    return res.status(200).json({ status: 'Ok', data });
};
export default {
    resolveUrl,
    searchAnimeHandler,
    homeHandler,
    singleAnimeHandler,
    episodesHandler,
    ongoingAnimeHandler,
    completeAnimeHandler,
    episodeByEpisodeSlugHandler,
    episodeByEpisodeNumberHandler,
    batchByBatchSlugHandler,
    batchHandler,
    genreListsHandler,
    animeByGenreHandler,
    getPdrain,
    getUrl
};

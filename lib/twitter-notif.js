'use strict';
const low = require('lowdb');
const tunnel = require('global-tunnel');


module.exports = function(hexo) {

    // Database initialization
    const dbNotif = low(path.join(hexo.base_dir, 'twitter-notif.json'));
    dbNotif.defaults({ notifs: [] }).value()

    let twitterEngine = {
        config: twitterConfig,
        dbNotif: dbNotif,
        registerPlugin: registerPlugin,
        postsToNotify: [],
        allimagesUrls: [],
        close: closePlugin

    };

    return twitterEngine;
}


/**
 * Close the plugin and free the related resources
 */
function closePlugin() {
    console.log("Closing the Twitter notification plugin.");
}


/**
 * Register the twitter plugin in Hexo.
 * 
 * @param {any} hexo the hexo variable
 */
function registerPlugin(hexo) {

    let allimagesUrls = this.allimagesUrls;

    // Sets 
    hexo.route.on('update', function(path) {
        if (path.endsWith('.png')) {
            // console.error('[Hexo Twitter]: update', path);
            allimagesUrls.push(path);
        }
    });


    hexo.extend.filter.register('after_generate', twitter_filter_after_generate);
    hexo.extend.filter.register('after_post_render', twitter_filter_after_post_render);
}


/**
 * Describes the filter triggered for the event 'after_generate'
 * 
 */
function twitter_filter_after_generate() {

    if (isTwitterEnabled) {
        postsToNotify.forEach(function(element) {
            // console.error('[Hexo Twitter]: Notify for', element.permalink);
            /*
            var TwitterData = {
                username: hexo.config.Twitter.username || hexo.config.url,
                attachments: [{
                        pretext: (hexo.config.Twitter.pretext || "New post on") + " <" + hexo.config.url + ">",
                        title: element.title,
                        title_link: encodeURI(element.permalink),
                        fields: [],
                        // image_url: "https://datadoghq.com/snapshot/path/to/snapshot.png",
                        color: hexo.config.Twitter.color || "#764FA5"
                    }]
                    // text: element.raw,
                    // mrkdwn: true,
            }

            if (element.notifyStatus == 'updated') {
                TwitterData.attachments[0].pretext = (hexo.config.Twitter.pretextUpdated || "Updated post on") + " <" + hexo.config.url + ">";
            } else {
                TwitterData.attachments[0].pretext = (hexo.config.Twitter.pretextNew || "New post on") + " <" + hexo.config.url + ">";
            }

            // console.error('[Hexo Twitter]: Exists', path.join(element.asset_dir, 'poster.png'));
            // console.error('[Hexo Twitter]: Exists', path.join(element.asset_dir, 'illustration.jpg'));

            if (hexo.config.Twitter.icon_emoji)
                TwitterData.icon_emoji = hexo.config.Twitter.icon_emoji;

            //INFO : Gestion de l'iilustration.
            var posterSearch = hexo.config.Twitter.posterSearch || 'illustration.png|illustration.jpg|poster.png|poster.jpg';
            var posterSearchList = posterSearch ? posterSearch.split("|") : [];
            posterSearchList.every(function(searchValue) {
                searchValue = searchValue.trim();

                if (searchValue && fs.existsSync(path.join(element.asset_dir, searchValue))) {
                    TwitterData.attachments[0].image_url = encodeURI(element.permalink + searchValue);
                    return false;
                }
                return true;
            });

            //INFO : Gestion de la catégorie
            if (element.categories && element.categories.data && element.categories.length > 0) {
                TwitterData.attachments[0].fields.push({
                    title: (hexo.config.Twitter.fieldTitle || "Categorie"),
                    value: element.categories.data[0].name,
                    short: true
                });
            }

            // console.log('[Hexo Twitter]: after_post_render TwitterData', TwitterData);

            Twitter.webhook(TwitterData, function(err, response) {
                if (response && response.statusCode != 200) console.error('[Hexo Twitter]: Twitter.webhook err', response);
                if (err) console.error('[Hexo Twitter]: Twitter.webhook err', err);
            });

            // // console.error('[Hexo Twitter]: after_post_render data', element);
            // console.error('[Hexo Twitter]: after_post_render slug', element.slug);
            // console.error('[Hexo Twitter]: after_post_render title', element.title);
            // console.error('[Hexo Twitter]: after_post_render source', element.source);
            // // console.error('[Hexo Twitter]: after_post_render raw', element.raw);
            // // console.error('[Hexo Twitter]: after_post_render content', element.content);
            // // console.error('[Hexo Twitter]: after_post_render more', element.more);
            // console.error('[Hexo Twitter]: after_post_render _id', element._id);
            // console.error('[Hexo Twitter]: after_post_render date', element.date);
            // console.error('[Hexo Twitter]: after_post_render path', element.path);
            // console.error('[Hexo Twitter]: after_post_render permalink', element.permalink);
            // console.error('[Hexo Twitter]: after_post_render updated', element.updated.Number);
            // console.error('[Hexo Twitter]: after_post_render published', element.published);

            // console.error('[Hexo Twitter]: after_post_render asset_dir', element.asset_dir);
            // // console.error('[Hexo Twitter]: after_post_render tags', element.tags);

            // if(element.categories && element.categories.data && element.categories.length > 0)
            //     console.error('[Hexo Twitter]: after_post_render categories:', element.categories.data[0].name);
            */
        });
    }

    allimagesUrls = [];
    postsToNotify = [];


}

/**
 *  * Describes the filter triggered for the event 'after_post_render'
 * 
 * @param {any} data 
 */
function twitter_filter_after_post_render(data) {
    let lNotif = this.dbNotif.get('notifs').find({ slug: data.slug }).value();
    console.log('[Hexo Twitter]: after_post_render find by slug', data.slug, !lNotif);

    if (!lNotif) {
        this.dbNotif.get('notifs').push({ id: data._id, slug: data.slug, date: data.date, updated: data.updated }).value();
        data['notifyStatus'] = 'new';
        this.postsToNotify.push(data);
    } else {

        if (!lNotif.updated || new Date(lNotif.updated) < data.updated.toDate()) {
            //INFO : updated post.
            // console.log('[Hexo Twitter]: notify: updated post > data.updated.toDate', data.updated.toDate());
            // console.log('[Hexo Twitter]: notify: updated post > lNotif.updated', new Date(lNotif.updated));

            this.dbNotif.get('notifs').find({ slug: data.slug }).assign({ updated: data.updated }).value();

            data['notifyStatus'] = 'updated';
            this.postsToNotify.push(data);
        }
    }

}


/**
 * Open an Https tunnel if necessary
 * @returns the tunnel potentialy initialized
 */
function openTunnel() {
    /** Initialize Http proxy */
    if (config.proxy && config.proxy.enabled) {
        tunnel.initialize();
    }
    return tunnel;

}
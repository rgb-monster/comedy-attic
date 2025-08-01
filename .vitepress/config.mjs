import {defineConfig} from "vitepress";
import markdownItContainer from "markdown-it-container";
import svgLoader from "vite-svg-loader"; // 1. Import the plugin

import {useStore} from "../src/stores/shows.js";
import utils from "../src/scripts/utils.js";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Comedy Attic",
    titleTemplate: ":title - Comedy Attic",
    description: "Unusual Comedy Production",
    head: [
        ["link", {rel: "icon", href: "/favicon.png"}],
        ["meta", {property: "og:site_name", content: "Comedy Attic"}],
        ["meta", {property: "og:type", content: "website"}],
        ["link", {href: "https://fonts.googleapis.com/icon?family=Material+Icons", rel: "stylesheet"}],
    ],

    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "/src/theme/mixins.scss";`,
                    api: "modern-compiler",
                },
            },
        },
        plugins: [
            svgLoader(), // 3. Add the plugin to the plugins array
        ],
    },

    //srcDir: "./src/md",
    cleanUrls: true,

    markdown: {
        config: md => {
            md.use(markdownItContainer, "section", {
                render: function (tokens, idx) {
                    var m = tokens[idx].info.trim().match(/^section\s+(.*)$/);

                    if (tokens[idx].nesting === 1) {
                        // opening tag
                        return `<section class="markdown-contents ${
                            m ? md.utils.escapeHtml(m[1]) : ""
                        }"><div class="contents">\n`;
                    } else {
                        // closing tag
                        return "</div></section>\n";
                    }
                },
            });
        },
    },

    async transformHead({pageData}) {
        let store = useStore();
        await store.fetchShows();

        let extra = [];
        if (pageData.frontmatter.page == "show-details") {
            let show = pageData.params;

            let scheduled = store.showTypes.find(rec => rec.show_type == show.show_type);
            let description;
            if (scheduled) {
                let td = extractTimesDates(scheduled?.shows || []);
                description = `${td.topShow.ts.strftime("%H:%M")} ${td.topShow.venue.name}, ${td.dates}`;
            } else {
                description = show.short_description;
            }

            extra.push(["meta", {name: "og:title", content: show.title}]);
            extra.push(["meta", {name: "og:description", content: description}]);

            extra.push(["meta", {name: "og:image", content: show.cover_thumb}]);
            extra.push(["meta", {name: "og:image:type", content: "image/webp"}]);
            extra.push(["meta", {name: "og:image:width", content: "600"}]);
            extra.push(["meta", {name: "og:image:height", content: "300"}]);
        } else {
            extra.push(["meta", {name: "og:title", content: pageData.title}]);
        }

        if (pageData.card) {
            extra.push(["meta", {name: "og:image", content: pageData.card}]);
        }

        // <meta property="og:title" content="Confirmed: book your shows in minutes!" />

        // <meta property="og:url" content="https://confirmed.show" />
        // <meta property="twitter:card" content="summary_large_image" />

        return extra;
    },
});

function extractTimesDates(shows) {
    let topShow = () => {
        let byVenueTime = {};
        shows.forEach(show => {
            utils.setDefault(byVenueTime, `${show.venue.name}-${show.ts.strftime("%H:%M")}`, {
                show: show,
                shows: 0,
            }).shows += 1;
        });

        let topShows = utils.sort(Object.values(byVenueTime), rec => -rec.shows);

        return topShows[0].show;
    };

    let dates = () => {
        let byDate = {};
        shows.forEach(show => {
            byDate[show.ts.strftime("%Y-%m-%d")] = show.ts;
        });

        let dates = utils.sort(Object.values(byDate));
        if (dates.length < 3) {
            return dates.map(ts => utils.humanDate(ts)).join(", ");
        } else {
            let [start, end] = [dates[0], dates[dates.length - 1]];
            return `${utils.humanDate(start)}-${utils.humanDate(end)}`;
        }
    };

    return {
        topShow: topShow(),
        dates: dates(),
    };
}

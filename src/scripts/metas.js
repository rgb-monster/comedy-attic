export const metas = [
    {
        show_type: "absolute-killers",
        slug: "absolute-killers",
        title: 'Absolute Killers',
        tags: ["compilation"],
        cover: "/show-assets/killers/cover.webp",
        cover_thumb: "/show-assets/killers/cover-thumb.png",
        short_description: "Dark comedy (by nice comedians)",
        description: "Dark comedy (by nice comedians)",
        tickets: "https://www.edfringe.com/tickets/whats-on/1-mc-and-3-absolute-killers-of-comedy",
    },
    // {
    //     show_type: "pof---4pm",
    //     slug: "pof",
    //     title: 'Pick of fringe 4pm',
    //     tags: ["compilation"],
    //     cover: "/show-assets/pof/cover.webp",
    //     cover_thumb: "/show-assets/pof/cover-thumb.webp",
    //     short_description: "Dark comedy (by nice comedians)",
    //     description: "Dark comedy (by nice comedians)",
    //     tickets: "https://www.edfringe.com/tickets/",
    // },
    // {
    //     show_type: "pof---9pm",
    //     slug: "pof",
    //     title: 'Pick of fringe 9pm',
    //     tags: ["compilation"],
    //     cover: "/show-assets/pof/cover.webp",
    //     cover_thumb: "/show-assets/pof/cover-thumb.webp",
    //     short_description: "Dark comedy (by nice comedians)",
    //     description: "Dark comedy (by nice comedians)",
    //     tickets: "https://www.edfringe.com/tickets/",
    // },

    {
        show_type: "lock-in",
        slug: "lockin",
        title: 'Comedy Lock-in at the Attic',
        tags: ["compilation"],
        cover: "/show-assets/lock-in/cover.webp",
        cover_thumb: "/show-assets/lock-in/cover-thumb.png",
        short_description: "Catch top-tier stand-up every night at Edinburgh's long-running Fringe favorite",
        description: "One of Edinburgh's longest-running gigs now runs nightly at the Fringe! One of our top resident MCs introduces two headline-level acts doing extended sets in our boutique comedy club above the iconic Beehive Inn. Grab a pint at one of the oldest pubs in Edinburgh, climb the stairs past the original death cell door of Calton Jail and enter our purpose-built boutique comedy club for a perfect way to round off your night at the Fringe. Over 100 five-star reviews and counting on Tripadvisor and Google Reviews. Don't miss out!",
        tickets: "https://www.edfringe.com/tickets/",
    },

];

let byShowType = {};
metas.forEach(showMetas => {
    byShowType[showMetas.show_type] = byShowType[showMetas.show_type] || [];
    byShowType[showMetas.show_type].push(showMetas);
});

export let generic = {};
Object.values(byShowType).forEach(allMetas => {
    let defaults = allMetas.filter(showMetas => showMetas.default)[0];
    if (!defaults) {
        defaults = allMetas.filter(showMetas => !Array.isArray(showMetas.tickets))[0];
    }

    if (!defaults) {
        defaults = allMetas[0];
    }

    let metas = JSON.parse(JSON.stringify(defaults || {}));
    generic[metas.show_type] = metas;
});

export function getShowMetas(show) {
    // based on show's venue and time match it with the right metas
    let allMetas = byShowType[show.show_type] || [];

    let defaults = allMetas.filter(showMetas => showMetas.default)[0];
    if (!defaults) {
        defaults = allMetas.filter(showMetas => !Array.isArray(showMetas.tickets))[0];
    }
    let metas = JSON.parse(JSON.stringify(defaults || {}));

    let venueSpecific = allMetas.filter(showMetas => Array.isArray(showMetas.tickets));

    // see if we can find a more precise match than the default
    for (let showMetas of venueSpecific) {
        for (let ticketInfo of showMetas.tickets) {
            // matches returns true if either the value matches, or we don't have the specific criteria in conditions
            let matches = (field, showVal) => !ticketInfo[field] || (ticketInfo[field] && ticketInfo[field] == showVal);

            let fullMatch = [
                matches("city", show.venue?.city),
                matches("venue", show.venue?.name),
                matches("time", show.ts.strftime("%H:%M")),
            ].every(rec => rec);

            if (fullMatch) {
                metas = {...metas, ...showMetas, tickets: ticketInfo.url};
            }
        }
    }

    let ticketsURL = metas.tickets || "";
    if (ticketsURL && ticketsURL.includes("tickets.edfringe.com")) {
        // fringe has brokeneth the ability to deep-link
        // ticketsURL = `${ticketsURL}?day=${show.date.strftime("%d-%m-%Y")}`;
        // metas.tickets = ticketsURL;
    }

    // console.log("rrrrrrrrrrrrrrrrrrr", show.name, show.venue.city, metas);
    return metas;
}

// list of all slugs that we want pages for
export const slugs = [
    ...new Set(
        Object.values(byShowType)
            .map(sameTypes => sameTypes.map(showMetas => showMetas.slug))
            .flat()
    ),
];

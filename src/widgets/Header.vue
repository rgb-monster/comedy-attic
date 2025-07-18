<script setup>
    import {useData} from "vitepress";
    import Castle from "../assets/castle.svg";
    const {theme, page, frontmatter} = useData();
</script>

<template>
    <header class="site">
        <a href="/" class="logo"><Castle /></a>
        <div class="linkage">
            <a href="/fringe" :class="{current: frontmatter.page == 'fringe'}">
                <span class="extra">Edinburgh</span> Fringe
            </a>
            <a href="/about" :class="{current: frontmatter.page == 'fringe'}">
                About <span class="extra">Comedy</span> Attic
            </a>
            <a href="/groups">Stags, Hens & Groups</a>
        </div>
    </header>
</template>

<style lang="scss">
    header.site {
        display: grid;
        background: var(--gold);
        color: var(--purple);
        padding-top: 20px;
        justify-items: center;
        width: 100%;
        max-width: var(--page-width);
        margin: 0 auto;

        .logo {
            fill: var(--purple);
            width: 100%;

            svg {
                max-width: 100%;

            }
        }

        .linkage {
            display: flex;
            background: var(--gold);
            color: var(--purple);
            width: 100%;
            justify-content: space-between;
            font-size: 1.4em;
            padding: 0 20px;
            padding-top: 0.25em;

            margin-top: -2px;
            text-align: center;

            a {
                font-family: var(--header-font);
                text-decoration: none;
                font-weight: 400;
                padding: 5px;

                &.current {
                    color: var(--accent-yellow);
                }
            }
        }

        @media (max-width: 560px) {
            .extra {
                display: none;
            }
        }
    }
</style>

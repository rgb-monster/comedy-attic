<script>
    import MailingListBox from "/src/widgets/MailingListBox.vue";

    export default {
        name: "Frontpage",
        props: {
            // these are optional props for if your button has a linkable state
            slug: String,
        },
        components: {
            MailingListBox,
        },
        data() {
            return {};
        },
    };
</script>

<template>
    <div class="frontpage">
        <h2>What's on?</h2>
    </div>
</template>

<style lang="scss">
    main.markdown .frontpage {
    }
</style>

<script setup lang="ts">
import { generateUniqueKey } from '~/lib/generateRandomKey'

const getPostByPath = async () =>
    await queryContent()
        .where({ _path: { $eq: useRoute().path } })
        .findOne()

const { data: post } = await useAsyncData(generateUniqueKey(), getPostByPath)
</script>

<template>
    <main v-if="post">
        <ContentDoc :path="post._stem">
            <ContentRenderer :value="post" />
        </ContentDoc>
    </main>
</template>

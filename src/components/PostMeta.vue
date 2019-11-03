<template>
   <div class="post-meta">
      Posted {{ post.date }}
      <template v-if="post.read_time">
        <strong>{{ post.read_time }} min read.</strong>
      </template>
    </div>
</template>

<script>
export default {
  props: ['post']
}
</script>

<style lang="scss">
.post-meta {
  font-size: .8em;
  opacity: .8;
}
</style>
<script>
export default {
  props: ['editionId' , 'selected-edition'],
  data() {
    return {
      homePageContents: {},
    }
  },
  beforeMount() {
    this.axios.get(`http://localhost:8080/home-page-image/home-page-contents/${this.editionId}`).then((response) => {
      this.homePageContents = response.data;
    });
  },
}
</script>

<template>
    <div v-html="homePageContents"></div>
</template>
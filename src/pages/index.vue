<script lang="ts">
import { Component, toNative, Vue } from 'vue-facing-decorator';
import DjanazahPage from './djanazah/index.vue';

@Component({
  components: {
    DjanazahPage
  }
})
class HomePage extends Vue {
}

export default toNative(HomePage)
</script>

<template>
    <DjanazahPage></DjanazahPage>
</template>
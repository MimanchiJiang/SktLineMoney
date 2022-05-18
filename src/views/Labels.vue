<template>
  <Layout>
    <h1 class="title3">青云记账</h1>
    <div class="tags">
      <router-link
        class="tag"
        v-for="tag in tags"
        :key="tag.id"
        :to="`/labels/edit/${tag.id}`"
        ><div>
          <Icon name="clouds" />
          <span>{{ tag.name }}</span>
        </div>
        <Icon name="right" />
      </router-link>
    </div>
    <div class="createTag-wrapper">
      <Button class="createTag" @click="createTag"> 新建标签 </Button>
    </div>
    <Levitation />
  </Layout>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Button from "@/components/Button.vue";
import { mixins } from "vue-class-component";
import TagHelper from "@/mixins/TagHelper";

@Component({
  components: { Button },
})
export default class Labels extends mixins(TagHelper) {
  get tags() {
    return this.$store.state.tagList;
  }

  beforeCreate() {
    this.$store.commit("fetchTags");
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/style/helper.scss";
.title3 {
  color: black;
  background-color: black;
  text-shadow: rgba(255, 255, 255, 0.5) 0 5px 6px,
    rgba(255, 255, 255, 0.2) 1px 3px 3px;
  -webkit-background-clip: text;
  text-align: center;
  background: rgb(189, 211, 215);
}
.tags {
  background: white;
  font-size: 16px;
  padding-left: 16px;
  > .tag {
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e6e6e6;
    border-radius: 10px;
    svg {
      width: 18px;
      height: 18px;
      color: #666;
      margin-right: 16px;
    }
  }
}
.createTag {
  background: $color-lightBlue;
  color: white;
  border-radius: 4px;
  border: none;
  height: 40px;
  padding: 0 16px;
  &-wrapper {
    text-align: center;
    padding: 16px;
    margin-top: 44-16px;
  }
}
</style>


<template>
  <nav>
    <router-link to="/statistics" class="item" active-class="selected">
      <Icon name="statistics" />
      统计
    </router-link>
    <router-link to="/viewChart" class="item" active-class="selected">
      <Icon name="money" />
      图表
    </router-link>
    <router-link to="/labels" class="item" active-class="selected">
      <Icon name="label" />
      标签
    </router-link>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component
export default class Nav extends Vue {}
</script>

<style lang="scss" scoped>
@import "~@/assets/style/helper.scss";
nav {
  @extend %outerShadow;
  display: flex;
  flex-direction: row;
  font-size: 12px;
  > .item {
    padding: 2px 0;
    width: 33.33333%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .icon {
      width: 25px;
      height: 25px;
    }
  }
  > .item.selected {
    color: $color-highlight;
  }
}
</style>

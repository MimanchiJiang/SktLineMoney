<template>
  <div>
    <router-link to="/money">
      <button
        @click="onClick"
        @mousedown="down"
        @touchstart="down"
        @mousemove="move"
        @touchmove="move"
        @mouseup="end"
        @touchend="end"
        ref="fu"
        class="float"
      >
        <Icon name="money" />
      </button>
    </router-link>
  </div>
</template>
<script>
import Icon from "./Icon.vue";
export default {
  components: { Icon },
  name: "",
  data() {
    return {
      flags: false, //控制使用
      position: {
        x: 0,
        y: 0,
      },
      nx: "",
      ny: "",
      dx: "",
      dy: "",
      xPum: "",
      yPum: "",
    };
  },
  methods: {
    down() {
      this.flags = true;
      var touch;
      if (event.touches) {
        touch = event.touches[0];
      } else {
        touch = event;
      }
      this.position.x = touch.clientX;
      this.position.y = touch.clientY;
      this.dx = this.$refs.fu.offsetLeft;
      this.dy = this.$refs.fu.offsetTop;
    },
    move() {
      if (this.flags) {
        var touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        this.nx = touch.clientX - this.position.x;
        this.ny = touch.clientY - this.position.y;
        this.xPum = this.dx + this.nx;
        this.yPum = this.dy + this.ny;
        let width = window.innerWidth - this.$refs.fu.offsetWidth; //屏幕宽度减去自身控件宽度
        let height = window.innerHeight - this.$refs.fu.offsetHeight; //屏幕高度减去自身控件高度
        this.xPum < 0 && (this.xPum = 0);
        this.yPum < 0 && (this.yPum = 0);
        this.xPum > width && (this.xPum = width);
        this.yPum > height && (this.yPum = height);
        // if (this.xPum >= 0 && this.yPum >= 0 && this.xPum<= width &&this.yPum<= height) {
        this.$refs.fu.style.left = this.xPum + "px";
        this.$refs.fu.style.top = this.yPum + "px";
        // }
        //阻止页面的滑动默认事件
        document.addEventListener(
          "touchmove",
          function () {
            event.preventDefault();
          },
          false
        );
      }
    },
    //鼠标释放时候的函数
    end() {
      this.flags = false;
    },
    onClick() {
      //在这里我是作为子组件来使用的
      this.$emit("click");
    },
  },
};
</script>
<style  scoped>
.float {
  position: absolute;
  right: 0;
  top: 0;
  touch-action: none;
  text-align: center;
  width: 60px;
  height: 48px;
  border-radius: 24px;
  line-height: 48px;
  background: red;
  color: white;
}
</style>

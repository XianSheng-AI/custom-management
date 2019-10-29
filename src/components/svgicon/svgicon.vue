
<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>
 
<script>
export default {
  name: 'svg-icon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String
    }
  },
  computed: {
    iconName() {
      return `#${this.iconClass}` // 注意：因为此处绑定的svgClass名已经包含#icon，所以复制symbol名字事不需要名字的前缀了
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon icon ' +  this.iconClass
      }
    }
  }
}
</script>
 
<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  font-size: 16px
}
</style>
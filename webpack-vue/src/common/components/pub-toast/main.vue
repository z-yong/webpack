<template>
  <transition name="pub-fade">
    <div class="pub-toast" v-show="show" :style="style">
      <div class="pub-toast-message">
        {{content}}
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  data() {  
    return {
      show: false,
      content: '',
      duration: 3000,
      style: {}
    }
  }
}
</script>
<style>
.pub-toast {
  position: fixed;
  z-index: 9999;
  line-height: 0.34rem;
  left: 50%;
  transform: translate(-50%, 0);
  top: 100px;
}

.pub-toast-message {
  font-size: 0.28rem;
  padding: 0.24rem 0.32rem;
  text-align: center;
  color: #fff;
  border-radius: 0.12rem;
  background: #323232;
  opacity: 0.9;
}

.pub-fade-enter,
.pub-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -120px);
}

.pub-fade-enter-active,
.pub-fade-leave-active {
  transition: transform .25s, opacity .25s;
}
</style>
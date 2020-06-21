<template>
    <div>
        <h3 class='text main-text-color'>你好 朋友</h3>
        <img src="/static/img/3.jpeg" alt="">
        <div v-html="data">{{data}}</div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            pageSize: 10,
            data: ''
        }
    },
    async mounted(){
        // const data = await this.$http.postJson('/getHomeResource',{
        const data = await this.$http.postJson('/mock/index/getHomeResource',{
            pageSize: this.pageSize,
        })
        if (data.fail) return
        console.log('data', data);
        this.data = data
    }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
    .text{
        background-image: url('~@img/3.jpeg');
        @include boxShadow();
    }
</style>
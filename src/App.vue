<template>
    <nav class="gif-nav">
        <ul>
            <li v-for="item in gifNavList">
                <router-link :to="item.value">{{ item.label }}</router-link>
            </li>
        </ul>
    </nav>
    <router-view />
</template>

<script lang="ts">
import { reactive, defineComponent } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const gifNavList: Array<{
            value: string,
            label: string
        }> = reactive([
            {
                value: '/',
                label: 'Home'
            },
            {
                value: 'gif-parser',
                label: 'gif-parser'
            },
            {
                value: 'gif-player',
                label: 'gif-player'
            },
            {
                value: 'gif-player-vue-next',
                label: 'gif-player-vue-next'
            }
        ]);

        return {
            gifNavList
        };
    }
})

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #eee;
  min-height: 100vh;
  width: 100vw;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

ul,
ol,
li {
    list-style: none;
}

.gif-nav {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    height: 48px;
    line-height: 48px;
}
.gif-nav ul{
    flex: 1;
    display: flex;
}
.gif-nav li {
    margin: 0 20px;
}
.gif-nav li a {
    color: #777;
    text-decoration: none;
}
.gif-nav li a:hover {
    color: #0287c9;
}
.gif-nav li a.router-link-active {
    font-weight: 700;
    color: #0287c9;
}
</style>

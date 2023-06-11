import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import './assets/main.scss'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faArrowDown,
    faPlus,
    faMinus,
    faInfo,
    faCopy,
    faCheck
} from '@fortawesome/free-solid-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'
library.add(faArrowDown, faClock, faPlus, faMinus, faInfo, faCopy, faCheck)


import 'highlight.js/styles/stackoverflow-light.css'
import hljs from 'highlight.js/lib/core';
import cpp from 'highlight.js/lib/languages/cpp';
import hljsVuePlugin from "@highlightjs/vue-plugin";
hljs.registerLanguage('cpp', cpp);


import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(hljsVuePlugin)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')

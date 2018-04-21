//组件
Vue.component('editable-span', {
    props: ['value', 'disabled'],
    template: `
        <span class="editableSpan">
            <span v-show="!editing">{{value}}</span>
            <textarea cols="5" v-show="editing" type="text" v-bind:value="value" v-on:input="triggerEdit" style="resize: none; width: 100%"></textarea>
            <button v-if="!disabled" v-on:click="editing = !editing">edit</button>
        </span>
    `,
    data(){
        return{
            editing: false
        }
    },
    methods: {
        triggerEdit(e){
            this.$emit('edit', e.target.value)
        }
    }
})
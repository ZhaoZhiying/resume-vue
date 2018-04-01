var app = new Vue({
    el: '#app',
    data: {
        resume: {
            name: '姓名',
            birthday: '1991年02月',
            gender: '女',
            email: '13718396548@163.com'
        }
    },
    methods: {
        onEdit(key,value){
            this.resume[key] = value
        }
    }
})
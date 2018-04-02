let app = new Vue({
    el: '#app',
    data: {
        loginVisible: false,
        signUpVisible: false,
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
        },
        onClickSave(){
            var currentUser = AV.User.current()
            if (currentUser) {
                this.saveResume()
            }
            else {
                this.loginVisible = true;
            }
        },
        saveResume(){

        },
    }
})
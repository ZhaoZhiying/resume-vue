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
        },
        login: {
            email: '',
            password: ''
        },
        signUp: {
            email: '',
            password: ''
        },
    },
    methods: {
        onEdit(key,value){
            this.resume[key] = value
        },
        onLogin(e){
            AV.User.logIn(this.login.email, this.login.password).then(function (user) {
                console.log(user)
              }, function (error) {
                 }
              )
        },
        onLogout(e){
            AV.User.logOut()
            alert('注销成功')
            window.location.reload()
        },
        onSignUp(e){
            // 新建 AVUser 对象实例
            let user = new AV.User()
            // 设置用户名
            user.setUsername(this.signUp.email)
            // 设置密码
            user.setPassword(this.signUp.password)
            // 设置邮箱
            user.setEmail(this.signUp.email)
            user.signUp().then(function (user) {
                console.log(user)
            }, function (error) {
               }
            )
        },
        onClickSave(){
            let currentUser = AV.User.current()
                console.log(currentUser)
            if (currentUser) {
                this.saveResume()
            }
            else {
                this.loginVisible = true;
            }
        },
        saveResume(){
            //声明类型
            let {id} = AV.User.current()
            //第一个参数是 className，第二个参数是 objectId
            let user = AV.Object.createWithoutData('User', id)
            //修改属性
            user.set('resume', this.resume)
            //保存在云端
            user.save()
        },
    }
})

let app = new Vue({
    el: '#app',
    data: {
        loginVisible: false,
        signUpVisible: false,
        currentUser: {
            objectId: undefined,
            email: undefined
        },
        resume: {
            name: '姓名',
            birthday: '1991年02月',
            gender: '女',
            email: '13718398888@163.com',
            skills: [
                {name: '项目名称', description: '项目介绍'},
                {name: '项目名称', description: '项目介绍'},
                {name: '项目名称', description: '项目介绍'},
                {name: '项目名称', description: '项目介绍'}
            ],
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
            //正则
            let regex = /\[(\d+)\]/g
            key = key.replace(regex, (match, number)=>`.${number}`)
            //key = skills.0.name
            keys = key.split('.')
            console.log(keys)
            console.log(value)
            let result = this.resume
            for(let i=0; i<keys.length; i++){
                if(i === keys.length - 1){
                    result[keys[i]] = value
                }else{
                    result = result[keys[i]]
                }
                //result = this.resume
                //keys = ['skills', '0', 'name']
                //i=0 result === result['skills'] === this.resume.skills
                //i=1 result === result[0] === this.resume.skills.0
                //i=2 result === result['name'] === this.resume.skills.0.name
                //result === this.resume['skills'][0]['name']
            }
            //this.resume['skills'][0]['name'] = value
        },
        hasLogin(){
            return !!this.currentUser.objectId
        },
        onLogin(e){
            AV.User.logIn(this.login.email, this.login.password).then((user) => {
                user = user.toJSON() 
                this.currentUser.objectId = user.objectId,
                this.currentUser.email = user.email
                this.loginVisible = false
              }, (error) => {
              })
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
            user.signUp().then((user) => {
                alert('注册成功，请登录')
            }, (error) =>{
            })
        },
        onClickSave(){
            let currentUser = AV.User.current()
            if (currentUser) {
                this.saveResume()
            }
            else {
                this.loginVisible = true;
            }
        },
        saveResume(){
            //声明类型
            let {objectId} = AV.User.current().toJSON()
            //第一个参数是 className，第二个参数是 objectId
            let user = AV.Object.createWithoutData('User', objectId)
            //修改属性
            user.set('resume', this.resume)
            //保存在云端
            user.save().then(()=>{
                alert('保存成功')
            }, ()=>{
                alert('保存失败')
            })
        },
        //避免刷新丢失已更改 resume，获取 resume
        getResume(){
            var query = new AV.Query('User')
            query.get(this.currentUser.objectId).then((user) => {
                let resume = user.toJSON().resume
                //this.resume = resume
                Object.assign(this.resume, resume)
            }, (error) => {
            })
        },
    }
})

let currentUser = AV.User.current()
if(currentUser){
    app.currentUser = currentUser.toJSON()
    app.getResume()
}
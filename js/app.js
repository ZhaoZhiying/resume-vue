let app = new Vue({
    el: '#app',
    data: {
        loginVisible: false,
        signUpVisible: false,
        shareVisible: false,
        previewUser: {
            objectId: undefined,
        },
        currentUser: {
            objectId: undefined,
            email: undefined
        },
        //预览用户
        previewResume: {
            name: '姓名',
            birthday: '1991年02月',
            gender: '女',
            email: '13718398888@163.com',
            skills: [
                {name: '技能名称', description: '技能介绍'},
                {name: '技能名称', description: '技能介绍'},
                {name: '技能名称', description: '技能介绍'},
                {name: '技能名称', description: '技能介绍'}
            ],
            projects: [
                {name: '项目名称', link: 'http://...', keywords: '关键词', description: '项目介绍'},
                {name: '项目名称', link: 'http://...', keywords: '关键词', description: '项目介绍'},
                {name: '项目名称', link: 'http://...', keywords: '关键词', description: '项目介绍'},
                {name: '项目名称', link: 'http://...', keywords: '关键词', description: '项目介绍'}
            ],
        },
        resume: {
            name: '姓名',
            birthday: '1991年02月',
            gender: '女',
            email: '13718398888@163.com',
            skills: [
                {name: '技能名称', description: '技能介绍'},
                {name: '技能名称', description: '技能介绍'},
                {name: '技能名称', description: '技能介绍'},
                {name: '技能名称', description: '技能介绍'}
            ],
            projects: [
                {name: '项目名称', link: 'http://...', keywords: '关键词', description: '项目介绍'},
                {name: '项目名称', link: 'http://...', keywords: '关键词', description: '项目介绍'},
                {name: '项目名称', link: 'http://...', keywords: '关键词', description: '项目介绍'},
                {name: '项目名称', link: 'http://...', keywords: '关键词', description: '项目介绍'}
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
        shareLink: {

        },
        mode: 'preview' // 'edit'
    },
    //区分预览和编辑模式
    computed: {
        displayResume(){
            return this.mode === 'preview' ? this.previewResume : this.resume
        }
    },
    // currentUser 有变化就 getResume
    watch: {
        'currentUser.objectId': function(newValue, oldValue){
            if(newValue){
                this.getResume(this.currentUser)
            }
        }
    },
    methods: {
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
        getResume(user){
            var query = new AV.Query('User')
            return query.get(user.objectId).then((user) => {
                let resume = user.toJSON().resume
                return resume //resume 或 previewResume
            }, (error) => {
            })
        },
        onEdit(key,value){
            //正则
            let regex = /\[(\d+)\]/g
            key = key.replace(regex, (match, number)=>`.${number}`)
            //key = skills.0.name
            keys = key.split('.')
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
        },
        addSkill(){
            this.resume.skills.push({name: '项目名称', description: '项目介绍'})
        },
        removeSkill(index){
            this.resume.skills.splice(index, 1)
        },
        addProject(){
            this.resume.projects.push({name: '项目名称', link: 'http://...', keywords: '关键词', description: '项目介绍'})
        },
        removeProject(index){
            this.resume.projects.splice(index, 1)
        },
    }
})

//获取当前用户id
let currentUser = AV.User.current()
if(currentUser){
    app.currentUser = currentUser.toJSON()
    //获取 url
    app.shareLink = location.origin + location.pathname + '?user_id=' + app.currentUser.objectId   
    app.getResume(app.currentUser).then(resume => {
        app.resume = resume
    })
}

//获取预览用户id
let search = location.search
let regex = /user_id=([^&]+)/ 
let matches = search.match(regex)
let userId
if(matches){
    userId = matches[1] 
    console.log('preview id:' + userId)
    //预览模式
    app.mode = 'preview'
    app.getResume({objectId: userId}).then(resume => {
        app.previewResume = resume
    })
}

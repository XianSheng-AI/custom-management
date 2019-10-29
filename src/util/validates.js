/* 
    验证方法类
 */



export default class validates {
    //字段验证 支持非空，手机，邮箱 格式 验证
    static validate (value, type) {

        // 
        if(type==='ip'){
            var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
            
            return reg.test(value);
        }
        if(type==='port'){
            let reg=/^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
            console.log(reg.test(value));
            return reg.test(value);
        }
        // let obj={
        //     text:'',
        //     typed:''
        // }
        // 去除左右空格
        let valu = value.replace(/(^\s*)|(\s*$)/g,"");
        if ('require' === type) {
            return !!valu; //强制转布尔型
        }
        // 验证码
        if('vCode'===type){
            return !!valu;
        }
        //密码大于等于6位
        if('password'===type){
          return valu.length>=6;
        }
        //手机号验证
        if ('phone' === type) {
            return /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/.test(valu);
        }
        //邮箱格式验证
        if ('email' === type) {
            return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(valu);
        }
    }
 }
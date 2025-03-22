import plugin from "eslint-plugin-react";
import pxtorem from "postcss-pxtorem";

export default {
    plugins:[
        pxtorem({
            rootValue:37.5,// 换算基数，默认100  ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
            propList:['*'],// 所有属性都进行转换
            selectorBlackList:['norem'],// 选择黑名单，过滤掉norem-开头的class，不进行rem转换 
        })
    ]
}
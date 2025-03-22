# notebook  React
- npm i react-router-dom -S
    --save 的缩写   - 一直依赖
    --save-dev -D 开发依赖
- 项目阶段
    - 开发阶段  development 
    - 测试阶段  test 没有环境可以用npx
    - 上线阶段  production  项目的部署
    - return (JSX) dom 树的对齐，优雅的展示

- 页面级别组件
#### 编程风格
    - 与Vue不同 在react中，一个页面可以创建一个单独的文件夹，由于页面和样式并不在一个文件中，所以需要创建一个单独的文件夹，文件夹中包含一个组件文件和一个样式文件 
    - jsx 让我们可以在js中书写html，react语法，让react可描述性得到提升，模版中的花括号中的数据绑定，循环等都是由JS来实现的。
    
    - 首页
        Home.jsx
    - 

#### es6 moudel 写法
    - 解构地引入
    - import {Route,Routes,BrowserRouter}from 'react-router-dom'
    - 起别名 
    - as

    - 框架选择
        - zarm 移动端react ui组件库
            - pnpm i zarm@3.1.2  
            

#### vite 按需加载
    - 按需加载 vite-plugin-style-import


#### less stylus css预编译
    - 快 能够不用写花括号
    - 变量、 嵌套、 混合函数
    - module css 模块化css style.module.less 中的 module
    - 在react中，组件和样式是分离的，使用less或其他来使用更高级的css功能，比如嵌套。编写css更加高效
    - 支持css模块化 
        - vite声明 less解析 
        - 引入样式时使用s.module.less

#### 移动端自适应适配
    - lib-flexible 移动端适配方案 rem
    - portcss-pxtorem 将px 自动转化为rem 提高开发效率
    - postCSS  允许开发者通过一系列插件来处理和增强css文件，使其具备更高的可维护性、兼容性、和性能。
     

#### axios 配置
    - baseURL 访问后端接口，一般以api开头
        -axios.defaults.baseURL = '/api'

#### Cookie
    - 依赖于域名存在 一定属于当下域名下的cookie
    - 以字符串形式存储在客户端的一种数据存储方式
    - 只有几kb大小
    - 请求时都会默认携带cookie 太大的话会影响性能
    - 可以设置secure 只在https协议下传输
    - 可以设置httpOnly 防止客户端脚本访问cookie 只会在请求时带上，js没办法获取cookie
    - 设置过期时间 

#### NavBar组件
    - 之于components目录下的公用组件
    - 基于ant-mobile 实现TabBar TabBar.Item
    - activeKey itemKey
    - changge setActiveKey
    - react-router-dom
        useNavigate hook 拿到路由跳转的方法navigate('path')

#### react hooks
    - useState: React的状态管理Hook
        - 用法: const [state, setState] = useState(initialState)
        - 作用: 为函数组件添加状态管理能力
        - 示例: 
            ```js
            const [count, setCount] = useState(0);
            setCount(count + 1); // 更新状态
            ```

    - useEffect: 处理副作用的Hook
        - 用法: useEffect(() => { /* 副作用代码 */ }, [dependencies])
        - 作用: 处理组件的副作用，如数据获取、订阅、手动DOM操作等
        - 生命周期对应:
            - 首次渲染: [] 空依赖数组
            - 更新时: [依赖项] 
            - 组件卸载: return清理函数

    - memo: 高阶组件，用于组件性能优化
        - 用法: const MemoComponent = memo(Component)
        - 作用: 防止组件在props未改变时进行不必要的重渲染
        - 适用: 组件接收简单props且重渲染开销较大时

    - useMemo: 缓存计算结果的Hook
        - 用法: const memoizedValue = useMemo(() => computeValue(a, b), [a, b])
        - 作用: 缓存计算结果，避免在每次渲染时重复进行昂贵的计算
        - 适用: 复杂计算或大数据处理场景

    - useCallback: 缓存函数的Hook
        - 用法: const memoizedCallback = useCallback(() => { doSomething(a, b) }, [a, b])
        - 作用: 缓存函数引用，避免不必要的重渲染
        - 适用: 将回调函数传递给使用memo优化的子组件时
    - useLocation：获取当前路由的位置信息
        - 用法：const location = useLocation();
        - 作用：获取当前路由的位置信息，包括路径、查询参数等
        - 适用：需要根据当前路由进行条件渲染或其他逻辑处理时
    - useNavigate：导航到指定路径
        - 用法：const navigate = useNavigate();
        - 作用：用于导航到指定的路径，可以是相对路径或绝对路径
        - 适用：需要在组件内部进行页面跳转时
#### react-router-dom
    - BrowserRouter HashRouter
    - Route Routes Router 


#### css
    - react module css 模块化css
    - less stylus css预编译
    - iconfont 
    - Linear-gradient 渐变色代替图片的请求
    - :global() 选择器用于在局部作用域的less 文件中定义全局样式 为指定的css规则应用到当前组件的全局范围，模块化开发


#### 登录注册
    - 切换表单 login/register  useEffect+useLocation
    - 切换动画 
        - 将注册相关的表单项包装在一个带有 registerFields 类的 div 中
        - 使用 CSS 的 transition 属性和 cubic-bezier 缓动函数来实现加速度变化的效果
        - 通过 max-height 、 opacity 和 transform 属性的变化来实现元素的平滑插入和移出
        - 使用条件类名 show 和 hide 来控制元素的显示状态

#### User
    
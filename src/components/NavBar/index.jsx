import React,{useState} from "react";
import s from './style.module.less' //css module模块化    
import { TabBar } from "antd-mobile";
//react风格 原生JS 函数式编程

import PropTypes from "prop-types";
import { useNavigate, useLocation } from 'react-router-dom';
import CustomIcon  from "@/components/CustomIcon";

const NavBar = ({showNav = true}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeKey, setActiveKey] = useState(location.pathname);
    
    const changTab = (path) => {
        setActiveKey(path);
        navigate(path);
    }
     return showNav && (
        <TabBar visible={showNav} className={s.tab} activeKey={activeKey} onChange={changTab}>
            <TabBar.Item
                key="/home"
                title="账单"
                icon={<CustomIcon type="note-jiaofeizhangdan" />}
                
            />
            <TabBar.Item
                key="/data"
                title="统计"
                icon={<CustomIcon type="note-tongjifenxi" />}
            />
            <TabBar.Item
                key="/user"
                title="我的"
                icon={<CustomIcon type="note-wode" />}
            />
        </TabBar>
    )
}
NavBar.propTypes = {
    showNav: PropTypes.bool,
}
export default NavBar


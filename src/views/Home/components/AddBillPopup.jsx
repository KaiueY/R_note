import React, { useState, useEffect } from 'react';
import { Popup, Form, Input, Button, NumberKeyboard, Picker, DatePicker, Toast, Radio } from 'antd-mobile';
import CustomIcon from '@/components/CustomIcon';
import s from './AddBillPopup.module.less';
import { billService } from '@/api/services';

// 图标映射，用于显示不同类型的图标
const TYPE_ICON_MAP = {
  '餐饮': 'note-food',
  '交通': 'note-transport',
  '购物': 'note-shopping',
  '娱乐': 'note-entertainment',
  '医疗': 'note-medical',
  '住房': 'note-housing',
  '教育': 'note-education',
  '工资': 'note-salary',
  '奖金': 'note-bonus',
  '投资': 'note-investment',
  '其他收入': 'note-income',
  '其他': 'note-bill',
  'default': 'note-bill'
};

const AddBillPopup = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [billTypes, setBillTypes] = useState([[]]);
  const [loading, setLoading] = useState(false);
  const [isIncome, setIsIncome] = useState(false);
  const [dateVisible, setDateVisible] = useState(false);
  const [typeVisible, setTypeVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [billStatus, setBillStatus] = useState('paid'); // 默认为已支付状态
  const [dbBillTypes, setDbBillTypes] = useState([]); // 存储从数据库获取的账单类型

  // 初始化和重置表单
  useEffect(() => {
    if (visible) {
      // 重置表单
      form.resetFields();
      setIsIncome(false);
      setSelectedDate(new Date());
      setBillStatus('paid'); // 重置为已支付状态
      fetchBillTypes(); // 获取账单类型
    }
  }, [visible]);
  
  // 当收入/支出状态变化时，更新账单类型
  useEffect(() => {
    if (visible) {
      fetchBillTypes();
    }
  }, [isIncome]);

  // 获取账单类型列表
  const fetchBillTypes = async () => {
    try {
      // 从后端获取账单类型数据
      const response = await billService.getBillTypes();
      // axios拦截器已经处理了响应，直接使用response中的数据
      if (response.status === 'success') {
        // 保存所有账单类型数据
        const allTypes = response.data || [];
        setDbBillTypes(allTypes);
        
        // 根据当前选择的收入/支出状态过滤类型
        const typeList = allTypes.filter(type => type.is_income === (isIncome ? 1 : 0));
        
        // 转换为Picker组件需要的格式
        const types = typeList.map(type => ({
          label: (
            <div className={s.typeItem}>
              <CustomIcon type={TYPE_ICON_MAP[type.name] || TYPE_ICON_MAP.default} />
              <span>{type.name}</span>
            </div>
          ),
          value: type.id
        }));
        
        setBillTypes([types]);
      } else {
        Toast.show({
          icon: 'fail',
          content: '获取账单类型失败'
        });
      }
    } catch (error) {
      console.error('获取账单类型失败:', error);
      Toast.show({
        icon: 'fail',
        content: '获取账单类型失败'
      });
    }
  };

  // 提交表单
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      // 构建提交数据 - 只包含数据库支持的字段
      const billData = {
        amount: values.amount,
        type_id: values.typeId, // 使用type_id字段与数据库对应
        date: selectedDate.toISOString().split('T')[0],
        remark: values.remark || null,
        status: billStatus, // 账单状态字段
        payment_method_id: 1 // 默认支付方式ID，对应数据库中的payment_method_id
      };
      
      // 发送请求
      const response = await billService.addBill(billData);
      
      if (response.status === 'success') {
        Toast.show({
          icon: 'success',
          content: billStatus === 'paid' ? '添加成功' : '待支付账单已添加'
        });
        onClose();
        // 传递账单状态给父组件，以便刷新相应的数据
        onSuccess && onSuccess(billStatus);
      } else {
        throw new Error(response.message || '添加失败');
      }
    } catch (error) {
      console.error('添加账单失败:', error);
      Toast.show({
        icon: 'fail',
        content: error.message || '添加账单失败'
      });
    } finally {
      setLoading(false);
    }
  };

  // 切换收入/支出
  const toggleIncomeType = () => {
    setIsIncome(!isIncome);
    // 重置表单数据
    form.resetFields();
    setSelectedDate(new Date());
    setBillStatus('paid');
  };

  // 日期选择器确认
  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    setDateVisible(false);
  };

  // 格式化日期显示
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{ height: '80vh' }}
      position="bottom"
      showCloseButton
    >
      <div className={s.addBillPopup}>
        <div className={s.header}>
          <div className={s.typeSwitch}>
            <div 
              className={`${s.typeButton} ${!isIncome ? s.active : ''}`}
              onClick={() => setIsIncome(false)}
            >
              支出
            </div>
            <div 
              className={`${s.typeButton} ${isIncome ? s.active : ''}`}
              onClick={() => setIsIncome(true)}
            >
              收入
            </div>
          </div>
        </div>
        
        <Form
          form={form}
          layout="horizontal"
          footer={
            <Button block type="submit" color="primary" loading={loading}>
              保存
            </Button>
          }
          onFinish={handleSubmit}
        >
          <Form.Item
            name="amount"
            label="金额"
            rules={[{ required: true, message: '请输入金额' }]}
          >
            <Input placeholder="请输入金额" type="number" />
          </Form.Item>
          
          <Form.Item
            name="typeId"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
            className={s.typeFormItem}
          >
            <div className={s.typeSelector} onClick={() => setTypeVisible(true)}>
              {form.getFieldValue('typeId') ? (
                <>
                  <div className={s.typeIcon}>
                    <CustomIcon type={
                      TYPE_ICON_MAP[dbBillTypes.find(type => type.id === form.getFieldValue('typeId'))?.name] || TYPE_ICON_MAP.default
                    } />
                  </div>
                  <span>
                    {dbBillTypes.find(type => type.id === form.getFieldValue('typeId'))?.name || '请选择类型'}
                  </span>
                </>
              ) : '请选择类型'}
            </div>
          </Form.Item>
          
          <Form.Item label="日期">
            <div className={s.dateSelector} onClick={() => setDateVisible(true)}>
              {formatDate(selectedDate)}
            </div>
          </Form.Item>
          
          <Form.Item name="remark" label="备注">
            <Input placeholder="请输入备注" />
          </Form.Item>
          
          <Form.Item label="状态">
            <Radio.Group
              value={billStatus}
              onChange={val => setBillStatus(val)}
            >
              <div className={s.statusGroup}>
                <Radio value="paid">已支付</Radio>
                <Radio value="pending">待支付</Radio>
              </div>
            </Radio.Group>
          </Form.Item>
        </Form>
        
        <DatePicker
          visible={dateVisible}
          value={selectedDate}
          onClose={() => setDateVisible(false)}
          onConfirm={handleDateConfirm}
          title="选择日期"
        />
        
        <Picker
          columns={billTypes}
          visible={typeVisible}
          onClose={() => setTypeVisible(false)}
          onConfirm={val => {
            form.setFieldsValue({ typeId: val[0] });
            setTypeVisible(false);
          }}
          title="选择类型"
        />
      </div>
    </Popup>
  );
};

export default AddBillPopup;
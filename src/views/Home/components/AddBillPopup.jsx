import React, { useState, useEffect } from 'react';
import { Popup, Form, Input, Button, NumberKeyboard, Selector, DatePicker, Toast } from 'antd-mobile';
import CustomIcon from '@/components/CustomIcon';
import s from './AddBillPopup.module.less';
import { billService } from '@/api/services';

const AddBillPopup = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [billTypes, setBillTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isIncome, setIsIncome] = useState(false);
  const [dateVisible, setDateVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 获取账单类型
  useEffect(() => {
    if (visible) {
      fetchBillTypes();
      // 重置表单
      form.resetFields();
      setIsIncome(false);
      setSelectedDate(new Date());
    }
  }, [visible]);

  // 获取账单类型列表
  const fetchBillTypes = async () => {
    try {
      const response = await billService.getBillTypes();
      if (response.data.status === 'success') {
        const types = response.data.data.map(type => ({
          label: (
            <div className={s.typeItem}>
              <CustomIcon type={type.icon} />
              <span>{type.name}</span>
            </div>
          ),
          value: type.id,
          key: type.id
        }));
        setBillTypes(types);
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
      
      // 构建提交数据
      const billData = {
        ...values,
        date: selectedDate.toISOString().split('T')[0],
        type_id: values.typeId
      };
      
      // 发送请求
      const response = await billService.addBill(billData);
      
      if (response.data.status === 'success') {
        Toast.show({
          icon: 'success',
          content: '添加成功'
        });
        onClose();
        onSuccess && onSuccess();
      } else {
        throw new Error(response.data.message || '添加失败');
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
          >
            <Selector
              columns={4}
              options={billTypes}
              showCheckMark={false}
            />
          </Form.Item>
          
          <Form.Item label="日期">
            <div className={s.dateSelector} onClick={() => setDateVisible(true)}>
              {formatDate(selectedDate)}
            </div>
          </Form.Item>
          
          <Form.Item name="remark" label="备注">
            <Input placeholder="请输入备注" />
          </Form.Item>
        </Form>
        
        <DatePicker
          visible={dateVisible}
          value={selectedDate}
          onClose={() => setDateVisible(false)}
          onConfirm={handleDateConfirm}
          title="选择日期"
        />
      </div>
    </Popup>
  );
};

export default AddBillPopup;
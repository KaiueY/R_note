import { useState } from 'react';

export const useDatePicker = () => {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const toggleDatePicker = () => {
    setVisible(!visible);
  };

  const formatDate = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    
    if (activeTab === 'date') {
      return `${month} ${currentDate.getDate()}, ${year}`;
    }
    return month;
  };

  const handleDateSelect = (val) => {
    setCurrentDate(val);
    setVisible(false);
  };

  return {
    visible,
    setVisible,
    activeTab,
    setActiveTab,
    currentDate,
    setCurrentDate,
    toggleDatePicker,
    formatDate,
    handleDateSelect
  };
};
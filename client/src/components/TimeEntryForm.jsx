import React from 'react';
import { Form, DatePicker, Input, Modal, Select } from 'antd';
import { useTasks } from '../contexts/TaskContext';

const { Option } = Select;

const TimeEntryForm = ({ visible, onCancel, onSubmit, initialTask }) => {
  const [form] = Form.useForm();
  const { tasks } = useTasks();
  const fontStyle = { fontFamily: 'Times New Roman, serif' };

  React.useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialTask && initialTask._id) {
        form.setFieldsValue({ taskId: initialTask._id });
      } else if (tasks && tasks.length > 0 && !initialTask) {
      }
    }
  }, [visible, initialTask, form, tasks]);


  const handleOk = () => {
    form.validateFields()
      .then(values => {
        if (!values.timeRange || values.timeRange.length !== 2) {
            console.error("Time range is not correctly selected.");
            return;
        }
        onSubmit({
          ...values,
          startTime: values.timeRange[0].toISOString(),
          endTime: values.timeRange[1].toISOString(),
        });
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <div style={fontStyle}>
      <Modal
        title={<span style={fontStyle}>Log Time Entry</span>}
        open={visible}
        onOk={handleOk}
        onCancel={() => { form.resetFields(); onCancel(); }}
        okText={<span style={fontStyle}>Log Time</span>}
        cancelText={<span style={fontStyle}>Cancel</span>}
        destroyOnHidden
        style={fontStyle}
      >
        <Form 
          form={form}
          layout="vertical" 
          name="time_entry_form"
          style={fontStyle}
        >
          <Form.Item
            name="taskId"
            label={<span style={fontStyle}>Task</span>}
            rules={[{ required: true, message: 'Please select a task!' }]}
            style={fontStyle}
          >
            <Select 
              placeholder="Select a task" 
              allowClear
              style={fontStyle}
            >
              {Array.isArray(tasks) && tasks.map(task => (
                <Option key={task._id} value={task._id} style={fontStyle}>{task.title}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="timeRange"
            label={<span style={fontStyle}>Start and End Time</span>}
            rules={[{ required: true, message: 'Please select start and end time!' }]}
            style={fontStyle}
          >
            <DatePicker.RangePicker 
              showTime 
              format="YYYY-MM-DD HH:mm" 
              style={{ width: '100%', ...fontStyle }}
            />
          </Form.Item>
          <Form.Item name="notes" label={<span style={fontStyle}>Notes</span>} style={fontStyle}>
            <Input.TextArea 
              rows={2} 
              style={fontStyle}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TimeEntryForm;
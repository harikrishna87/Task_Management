import React from 'react';
import { Form, Input, Select, DatePicker, Modal } from 'antd';
import moment from 'moment';

const { Option } = Select;

const TaskForm = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const fontStyle = { fontFamily: 'Times New Roman, serif' };

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        dueDate: initialValues.dueDate ? moment(initialValues.dueDate) : null,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form, visible]);

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        onSubmit({
          ...values,
          dueDate: values.dueDate ? values.dueDate.toISOString() : null,
        });
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <div style={fontStyle}>
      <Modal
        title={<span style={fontStyle}>{initialValues ? "Edit Task" : "Create New Task"}</span>}
        open={visible}
        onOk={handleOk}
        onCancel={() => { form.resetFields(); onCancel(); }}
        okText={<span style={fontStyle}>{initialValues ? "Save" : "Create"}</span>}
        cancelText={<span style={fontStyle}>Cancel</span>}
        destroyOnHidden
        style={fontStyle}
      >
        <Form 
          form={form}
          layout="vertical" 
          name="task_form"
          style={fontStyle}
        >
          <Form.Item
            name="title"
            label={<span style={fontStyle}>Title</span>}
            rules={[{ required: true, message: 'Please input the title of the task!' }]}
            style={fontStyle}
          >
            <Input style={fontStyle} />
          </Form.Item>
          <Form.Item 
            name="description" 
            label={<span style={fontStyle}>Description</span>} 
            style={fontStyle}
          >
            <Input.TextArea rows={3} style={fontStyle} />
          </Form.Item>
          <Form.Item 
            name="status" 
            label={<span style={fontStyle}>Status</span>} 
            initialValue="todo" 
            style={fontStyle}
          >
            <Select style={fontStyle}>
              <Option value="todo" style={fontStyle}>To Do</Option>
              <Option value="in-progress" style={fontStyle}>In Progress</Option>
              <Option value="done" style={fontStyle}>Done</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            name="dueDate" 
            label={<span style={fontStyle}>Due Date</span>} 
            style={fontStyle}
          >
            <DatePicker style={{ width: '100%', ...fontStyle }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskForm;
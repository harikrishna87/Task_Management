import { useState } from 'react';
import { List, Button, Typography, Space, Tag, Row, Col, Card, Empty, Spin, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useTasks } from '../contexts/TaskContext';
import TaskForm from '../components/TaskForm';
import moment from 'moment';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const getStatusColor = (status) => {
  switch (status) {
    case 'todo': return 'blue';
    case 'in-progress': return 'gold';
    case 'done': return 'green';
    default: return 'default';
  }
};

const TaskListView = () => {
  const { tasks, addTask, editTask, removeTask, loading } = useTasks();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const showModal = (task = null) => {
    setEditingTask(task);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingTask(null);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingTask) {
        await editTask(editingTask._id, values);
      } else {
        await addTask(values);
      }
      setIsModalVisible(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  if (loading && tasks.length === 0) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)', fontFamily: '"Times New Roman", serif'}}><Spin size="large" /></div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: '"Times New Roman", serif' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 30 }}>
        <Col>
          <Title level={2} style={{ fontFamily: '"Times New Roman", serif', color: '#1890ff' }}>My Tasks</Title>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
            style={{
              border: 'none',
              borderRadius: '10px',
              padding: '0 25px',
              height: '45px',
              fontSize: '16px',
              fontWeight: '600',
              fontFamily: '"Times New Roman", serif',
              boxShadow: '0 4px 15px rgba(238, 90, 82, 0.4)',
              transform: 'translateY(0)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(238, 90, 82, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(238, 90, 82, 0.4)';
            }}
          >
            Add Task
          </Button>
        </Col>
      </Row>

      {tasks.length === 0 && !loading ? (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          fontFamily: '"Times New Roman", serif',
          color: '#8c8c8c'
        }}>
          <Empty description={<span style={{ color: '#8c8c8c' }}>No tasks yet. Add one to get started!</span>} />
        </div>
      ) : (
        <List
          grid={{ gutter: [20, 20], xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }}
          dataSource={tasks}
          loading={loading}
          renderItem={(task) => {
            if (!task) return null;

            return (
            <List.Item>
              <Card
                title={
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1890ff',
                    marginBottom: '5px',
                    fontFamily: '"Times New Roman", serif'
                  }}>
                    {task.title || "Untitled Task"}
                  </div>
                }
                style={{ 
                  borderRadius: '10px',
                  border: '1px solid #f0f0f0',
                  boxShadow: '0 4px 20px rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden',
                  fontFamily: '"Times New Roman", serif'
                }}
                bodyStyle={{
                  padding: '20px',
                  fontFamily: '"Times New Roman", serif'
                }}
                headStyle={{
                  borderBottom: '1px solid #f0f0f0',
                  borderRadius: '10px 10px 0 0',
                  fontFamily: '"Times New Roman", serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 255, 255, 0.08)';
                }}
                actions={[
                  <Link 
                    to={`/time-tracking/${task._id}`} 
                    key="time-track"
                    style={{
                      color: '#667eea',
                      fontWeight: '500',
                      fontFamily: '"Times New Roman", serif',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(102, 126, 234, 0.2)';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <ClockCircleOutlined /> Track Time
                  </Link>,
                  <div
                    key="edit"
                    onClick={() => showModal(task)}
                    style={{
                      color: '#52c41a',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '8px',
                      borderRadius: '50%',
                      transition: 'all 0.3s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(82, 196, 26, 0.2)';
                      e.target.style.transform = 'scale(1.2) rotate(15deg)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'scale(1) rotate(0deg)';
                    }}
                  >
                    <EditOutlined />
                  </div>,
                  <Popconfirm
                      title={<span style={{ color: '#262626' }}>Delete the task</span>}
                      description={<span style={{ color: '#595959' }}>Are you sure to delete this task? This action cannot be undone.</span>}
                      onConfirm={() => removeTask(task._id)}
                      okText="Yes"
                      cancelText="No"
                      key="delete"
                    >
                      <div
                        style={{
                          color: '#ff4d4f',
                          cursor: 'pointer',
                          fontSize: '16px',
                          padding: '8px',
                          borderRadius: '50%',
                          transition: 'all 0.3s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(255, 77, 79, 0.2)';
                          e.target.style.transform = 'scale(1.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <DeleteOutlined />
                      </div>
                  </Popconfirm>
                ]}
              >
                <Space direction="vertical" style={{width: '100%', gap: '12px'}}>
                  <Tag 
                    color={getStatusColor(task.status)}
                    style={{
                      borderRadius: '10px',
                      padding: '4px 16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      fontFamily: '"Times New Roman", serif',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      border: 'none',
                      boxShadow: '0 2px 8px rgba(255,255,255,0.1)'
                    }}
                  >
                    {task.status ? task.status.toUpperCase() : 'NO STATUS'}
                  </Tag>
                  <Text 
                    type="secondary" 
                    style={{
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: '#b0b0b0',
                      fontFamily: '"Times New Roman", serif'
                    }}
                  >
                    {task.description || "No description"}
                  </Text>
                  {task.dueDate && (
                    <Text 
                      strong 
                      style={{
                        color: '#e74c3c',
                        fontSize: '13px',
                        fontFamily: '"Times New Roman", serif',
                        padding: '4px 12px',
                        borderRadius: '10px',
                        display: 'inline-block'
                      }}
                    >
                      Due: {moment(task.dueDate).format('YYYY-MM-DD')}
                    </Text>
                  )}
                  <Text 
                    style={{
                      fontSize: '12px',
                      color: '#888888',
                      fontStyle: 'italic',
                      fontFamily: '"Times New Roman", serif'
                    }}
                  >
                    Created: {task.createdAt ? moment(task.createdAt).fromNow() : 'N/A'}
                  </Text>
                </Space>
              </Card>
            </List.Item>
            );
          }}
        />
      )}

      <TaskForm
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        initialValues={editingTask}
      />
    </div>
  );
};

export default TaskListView;
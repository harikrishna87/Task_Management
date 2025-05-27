import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../contexts/TaskContext';
import { Typography, Button, Select, List, Card, Spin, Empty, Statistic, Row, Col, Divider, Popconfirm, message as antdMessage, Badge, Avatar, theme } from 'antd';
import { PlusOutlined, FieldTimeOutlined, ArrowLeftOutlined, DeleteOutlined, ClockCircleOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import TimeEntryForm from '../components/TimeEntryForm';
import moment from 'moment';
import * as api from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;
const { useToken } = theme;

const TimeTrackingView = () => {
  const { token } = useToken();
  const { taskId: routeTaskId } = useParams();
  const navigate = useNavigate();
  const { tasks, timeEntries, fetchTimeEntries, addTimeEntry, loading: tasksLoading } = useTasks();
  
  const [selectedTaskId, setSelectedTaskId] = useState(routeTaskId || null);
  const [isTimeEntryModalVisible, setIsTimeEntryModalVisible] = useState(false);
  const [activeTimer, setActiveTimer] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [currentTaskTimeEntries, setCurrentTaskTimeEntries] = useState([]);

  const fontStyle = { fontFamily: 'Times New Roman, serif' };

  const selectedTask = useMemo(() => {
    if (Array.isArray(tasks) && selectedTaskId) {
      return tasks.find(t => t._id === selectedTaskId);
    }
    return null;
  }, [tasks, selectedTaskId]);

  useEffect(() => {
    if (routeTaskId) {
      setSelectedTaskId(routeTaskId);
    } else if (Array.isArray(tasks) && tasks.length > 0 && !selectedTaskId) {

    }
  }, [routeTaskId, tasks, selectedTaskId, navigate]);
  
  useEffect(() => {
    const fetchAndSetEntries = async () => {
        if (selectedTaskId) {
            if (!timeEntries || !timeEntries[selectedTaskId]) {
                setLoadingEntries(true);
                await fetchTimeEntries(selectedTaskId);
                setLoadingEntries(false);
            }
            setCurrentTaskTimeEntries(timeEntries && timeEntries[selectedTaskId] ? [...timeEntries[selectedTaskId]] : []);
        } else {
            setCurrentTaskTimeEntries([]);
        }
    }
    fetchAndSetEntries();
  }, [selectedTaskId, fetchTimeEntries, timeEntries]);

  useEffect(() => {
    let interval;
    if (activeTimer) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - activeTimer.startTime) / 1000));
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  const handleTaskChange = (value) => {
    setSelectedTaskId(value);
    if (value) {
        navigate(`/time-tracking/${value}`, { replace: true });
    } else {
        navigate('/time-tracking', {replace: true});
    }
    if (activeTimer && activeTimer.taskId !== value) {
      handleStopTimer(false);
    }
  };

  const handleShowTimeEntryModal = () => {
    if (!selectedTaskId) {
        antdMessage.warning("Please select a task first to log time manually.");
        return;
    }
    setIsTimeEntryModalVisible(true);
  }
  const handleCancelTimeEntryModal = () => setIsTimeEntryModalVisible(false);

  const handleSubmitTimeEntry = async (values) => {
    try {
      const newEntry = await addTimeEntry(values);
      setIsTimeEntryModalVisible(false);
      if (newEntry && newEntry.taskId === selectedTaskId) {

      }
    } catch (error) {

    }
  };

  const handleStartTimer = () => {
    if (!selectedTaskId) {
      antdMessage.warning('Please select a task first!');
      return;
    }
    if (activeTimer) {
        antdMessage.warning('A timer is already running. Stop it first or it will be overridden.');
    }
    setActiveTimer({ taskId: selectedTaskId, startTime: Date.now() });
    antdMessage.success(`Timer started for: ${selectedTask?.title || 'Selected Task'}`);
  };

  const handleStopTimer = async (saveEntry = true) => {
    if (!activeTimer) return;
    const endTime = new Date();
    const startTime = new Date(activeTimer.startTime);
    const currentActiveTimerDetails = { ...activeTimer };
    setActiveTimer(null);
    setElapsedTime(0);

    if (saveEntry) {
        try {
          const newEntry = await addTimeEntry({
            taskId: currentActiveTimerDetails.taskId,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            notes: 'Tracked with timer'
          });
          antdMessage.success(`Time logged for task: ${tasks.find(t=> t._id === currentActiveTimerDetails.taskId)?.title || 'Task'}`);
        } catch (error) {
          antdMessage.error('Failed to log time automatically.');
        }
    }
  };
  
  const handleDeleteTimeEntry = async (entryId) => {
    try {
        await api.deleteTimeEntryAPI(entryId);
        setCurrentTaskTimeEntries(prev => prev.filter(entry => entry._id !== entryId));
        if (selectedTaskId) fetchTimeEntries(selectedTaskId);
        antdMessage.success('Time entry deleted.');
    } catch (err) {
        antdMessage.error('Failed to delete time entry.');
    }
  };

  const formatElapsedTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const totalTrackedForTask = useMemo(() => {
    if (!Array.isArray(currentTaskTimeEntries)) return 0;
    return currentTaskTimeEntries.reduce((acc, entry) => acc + (entry.duration || 0), 0);
  }, [currentTaskTimeEntries]);

  if (tasksLoading && (!Array.isArray(tasks) || tasks.length === 0)) {
    return (
      <div style={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 'calc(100vh - 200px)',
        flexDirection: 'column',
        gap: '16px',
        ...fontStyle
      }}>
        <Spin size="large" />
        <Text type="secondary" style={{ ...fontStyle, color: token.colorTextSecondary }}>Loading tasks...</Text>
      </div>
    );
  }
  
  return (
    <div style={{ 
      padding: '24px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      minHeight: '100vh',
      ...fontStyle
    }}>
      <div style={{ 
        padding: '20px 24px', 
        borderRadius: '10px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Title level={2} style={{ 
            margin: 0, 
            color: '#1890ff', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            ...fontStyle 
          }}>
            <ClockCircleOutlined />
            Time Tracking
          </Title>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/')}
            type="text"
            size="large"
            style={{ color: token.colorTextSecondary, ...fontStyle }}
          >
            Back to Tasks
          </Button>
        </div>
        
        <Row gutter={[24, 16]} align="middle">
          <Col xs={24} lg={12}>
            <div style={{ marginBottom: '8px' }}>
              <Text strong style={{ fontSize: '16px', color: token.colorText, ...fontStyle }}>Select Task</Text>
            </div>
            <Select
              showSearch
              style={{ width: '100%', ...fontStyle }}
              placeholder="Choose a task to track time"
              value={selectedTaskId}
              onChange={handleTaskChange}
              loading={tasksLoading}
              allowClear
              size="large"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={Array.isArray(tasks) ? tasks.map(task => ({value: task._id, label: task.title})) : []}
            />
          </Col>
          <Col xs={24} lg={12}>
            {selectedTaskId && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {(!activeTimer || activeTimer.taskId !== selectedTaskId) ? (
                  <Button 
                    type="primary" 
                    icon={<PlayCircleOutlined />} 
                    onClick={handleStartTimer} 
                    disabled={!!activeTimer && activeTimer.taskId !== selectedTaskId}
                    size="large"
                    style={{ 
                      background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                      border: 'none',
                      boxShadow: '0 4px 10px rgba(82, 196, 26, 0.3)',
                      ...fontStyle
                    }}
                  >
                    Start Timer
                  </Button>
                ) : (
                  <Badge count={formatElapsedTime(elapsedTime)} 
                    style={{ backgroundColor: '#ff4d4f', fontSize: '12px', fontWeight: 'bold', ...fontStyle }}>
                    <Button 
                      type="primary" 
                      danger 
                      icon={<PauseCircleOutlined />}
                      onClick={() => handleStopTimer(true)}
                      size="large"
                      style={{ 
                        background: 'linear-gradient(135deg, #ff7875 0%, #ff4d4f 100%)',
                        border: 'none',
                        boxShadow: '0 4px 10px rgba(255, 77, 79, 0.3)',
                        ...fontStyle
                      }}
                    >
                      Stop Timer
                    </Button>
                  </Badge>
                )}
                <Button 
                  icon={<PlusOutlined />} 
                  onClick={handleShowTimeEntryModal}
                  size="large"
                  style={{ 
                    borderColor: '#1890ff',
                    color: '#1890ff',
                    ...fontStyle
                  }}
                >
                  Log Manually
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </div>
      
      {selectedTask && (
        <Card 
          style={{
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
            border: 'none',
            ...fontStyle
          }}
          bodyStyle={{ padding: '32px' }}
        >
          <div style={{ marginBottom: '24px' }}>
            <Title level={3} style={{ 
              margin: 0, 
              color: token.colorText,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              ...fontStyle
            }}>
              <Avatar style={{ backgroundColor: '#1890ff' }} icon={<FieldTimeOutlined />} />
              {selectedTask.title}
            </Title>
          </div>
          
          <div style={{ 
            padding: '24px', 
            borderRadius: '8px',
            marginBottom: '24px',
            border: '1px solid #91d5ff'
          }}>
            <Statistic 
              title={<span style={{ fontSize: '16px', fontWeight: '600', color: token.colorText, ...fontStyle }}>Total Time Tracked</span>}
              value={`${Math.floor(totalTrackedForTask / 60)}h ${totalTrackedForTask % 60}m`} 
              valueStyle={{ 
                color: '#1890ff', 
                fontSize: '28px', 
                fontWeight: 'bold',
                ...fontStyle
              }}
              prefix={<ClockCircleOutlined />}
            />
          </div>
          
          <Divider style={{ margin: '24px 0', borderColor: '#e8e8e8' }} />
          
          {loadingEntries ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px' }}>
                <Text type="secondary" style={{ ...fontStyle, color: token.colorTextSecondary }}>Loading time entries...</Text>
              </div>
            </div>
          ) : currentTaskTimeEntries && currentTaskTimeEntries.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={[...currentTaskTimeEntries].sort((a, b) => new Date(b.startTime) - new Date(a.startTime))}
              renderItem={item => (
                <List.Item
                  style={{ 
                    padding: '16px 0',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                  actions={[
                    <Popconfirm
                      key="delete-entry"
                      title={<span style={{ ...fontStyle, color: token.colorText }}>Delete this time entry?</span>}
                      description={<span style={{ ...fontStyle, color: token.colorText }}>This action cannot be undone.</span>}
                      onConfirm={() => handleDeleteTimeEntry(item._id)}
                      okText={<span style={{ ...fontStyle }}>Delete</span>}
                      cancelText={<span style={{ ...fontStyle }}>Cancel</span>}
                      okButtonProps={{ danger: true }}
                    >
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          ...fontStyle
                        }}
                      />
                    </Popconfirm>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ backgroundColor: '#52c41a' }} 
                        icon={<ClockCircleOutlined />} 
                      />
                    }
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Text strong style={{ fontSize: '16px', color: token.colorText, ...fontStyle }}>
                          {moment(item.startTime).format('MMM D, YYYY HH:mm')} - {item.endTime ? moment(item.endTime).format('HH:mm') : 'Ongoing'}
                        </Text>
                        <Badge 
                          count={item.duration != null ? `${item.duration} min` : 'N/A'} 
                          style={{ backgroundColor: '#1890ff', ...fontStyle }}
                        />
                      </div>
                    }
                    description={
                      item.notes && (
                        <Text type="secondary" style={{ fontSize: '14px', color: token.colorTextSecondary, ...fontStyle }}>
                          <strong>Notes:</strong> {item.notes}
                        </Text>
                      )
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty 
              description={
                <span style={{ fontSize: '16px', color: token.colorText, ...fontStyle }}>
                  No time entries logged for this task yet.
                </span>
              }
              style={{ padding: '40px' }}
            />
          )}
        </Card>
      )}
      
      {!selectedTaskId && Array.isArray(tasks) && tasks.length > 0 && (
        <div style={{ 
          borderRadius: '10px', 
          padding: '60px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <Empty 
            description={
              <span style={{ fontSize: '18px', color: token.colorText, ...fontStyle }}>
                Select a task above to view its time entries or start tracking
              </span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      )}
      
      {(!Array.isArray(tasks) || tasks.length === 0) && !tasksLoading && (
        <div style={{ 
          borderRadius: '10px', 
          padding: '60px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <Empty 
            description={
              <span style={{ fontSize: '18px', color: token.colorText, ...fontStyle }}>
                No tasks available. Create a task first from the Task List.
              </span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      )}

      <TimeEntryForm
        visible={isTimeEntryModalVisible}
        onCancel={handleCancelTimeEntryModal}
        onSubmit={handleSubmitTimeEntry}
        initialTask={selectedTask}
      />
    </div>
  );
};

export default TimeTrackingView;
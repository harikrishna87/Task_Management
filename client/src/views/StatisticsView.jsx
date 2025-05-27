import { useState, useEffect } from 'react';
import { Typography, Spin, Alert, Row, Col, Card, Statistic, List, Empty, Progress } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ContainerOutlined, BarChartOutlined } from '@ant-design/icons';
import * as api from '../services/api';

const { Title, Text } = Typography;

const StatisticsView = ({ isDarkMode = false }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Theme colors
  const theme = {
    background: 'transparent',
    cardBackground: 'transparent',
    textPrimary: isDarkMode ? '#ffffff' : '#000000',
    textSecondary: isDarkMode ? '#b3b3b3' : '#666666',
    textMuted: isDarkMode ? '#888888' : '#64748b',
    borderColor: isDarkMode ? '#404040' : '#e2e8f0',
    shadowColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.getStatistics();
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 'calc(100vh - 200px)',
        fontFamily: '"Times New Roman", serif',
        backgroundColor: 'transparent'
      }}>
        <div style={{
          background: 'transparent',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: `0 20px 40px ${theme.shadowColor}`,
          backdropFilter: 'blur(10px)'
        }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '40px', 
        fontFamily: '"Times New Roman", serif',
        backgroundColor: 'transparent',
        minHeight: '100vh'
      }}>
        <Alert 
          message="Error" 
          description={error} 
          type="error" 
          showIcon 
          style={{
            borderRadius: '15px',
            border: 'none',
            boxShadow: '0 10px 30px rgba(255, 77, 79, 0.2)'
          }}
        />
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ 
        padding: '40px', 
        fontFamily: '"Times New Roman", serif',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
      }}>
        <Empty 
          description={
            <span style={{ color: theme.textSecondary }}>
              No statistics data available.
            </span>
          }
          style={{
            background: 'transparent',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: `0 15px 35px ${theme.shadowColor}`
          }}
        />
      </div>
    );
  }
  
  const completionPercentage = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;

  return (
    <div style={{ 
      padding: '40px',
      minHeight: '100vh',
      fontFamily: '"Times New Roman", serif',
      backgroundColor: 'transparent'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <Title 
          level={2} 
          style={{ 
            marginBottom: '40px',
            color: theme.textPrimary,
            textAlign: 'center',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            fontFamily: '"Times New Roman", serif'
          }}
        >
          Productivity Statistics
        </Title>
        
        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6} lg={6}>
            <Card 
              hoverable
              style={{
                background: 'transparent',
                border: `1px solid ${isDarkMode ? '#404060' : '#e8f4fd'}`,
                borderRadius: '16px',
                boxShadow: `0 8px 24px ${isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.12)'}`,
                transition: 'all 0.3s ease',
                fontFamily: '"Times New Roman", serif',
                height: '140px'
              }}
              bodyStyle={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <Statistic
                title={<span style={{ fontSize: '14px', fontWeight: '600', color: theme.textMuted, fontFamily: '"Times New Roman", serif' }}>Total Tasks</span>}
                value={stats.totalTasks}
                prefix={<ContainerOutlined style={{ color: '#6366f1', fontSize: '20px' }} />}
                valueStyle={{ 
                  color: theme.textPrimary, 
                  fontSize: '28px', 
                  fontWeight: 'bold',
                  fontFamily: '"Times New Roman", serif'
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <Card 
              hoverable
              style={{
                background: 'transparent',
                border: `1px solid ${isDarkMode ? '#2a5a2a' : '#d1fae5'}`,
                borderRadius: '16px',
                boxShadow: `0 8px 24px ${isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.12)'}`,
                transition: 'all 0.3s ease',
                fontFamily: '"Times New Roman", serif',
                height: '140px'
              }}
              bodyStyle={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <Statistic
                title={<span style={{ fontSize: '14px', fontWeight: '600', color: theme.textMuted, fontFamily: '"Times New Roman", serif' }}>Tasks Completed</span>}
                value={stats.completedTasks}
                valueStyle={{ 
                  color: theme.textPrimary, 
                  fontSize: '28px', 
                  fontWeight: 'bold',
                  fontFamily: '"Times New Roman", serif'
                }}
                prefix={<CheckCircleOutlined style={{ color: '#22c55e', fontSize: '20px' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <Card 
              hoverable
              style={{
                background: 'transparent',
                border: `1px solid ${isDarkMode ? '#5a3a2a' : '#fed7aa'}`,
                borderRadius: '16px',
                boxShadow: `0 8px 24px ${isDarkMode ? 'rgba(251, 146, 60, 0.2)' : 'rgba(251, 146, 60, 0.12)'}`,
                transition: 'all 0.3s ease',
                fontFamily: '"Times New Roman", serif',
                height: '140px'
              }}
              bodyStyle={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <Statistic
                title={<span style={{ fontSize: '14px', fontWeight: '600', color: theme.textMuted, fontFamily: '"Times New Roman", serif' }}>Tasks To Do</span>}
                value={stats.todoTasks}
                prefix={<ClockCircleOutlined style={{ color: '#f59e0b', fontSize: '20px' }} />}
                valueStyle={{ 
                  color: theme.textPrimary, 
                  fontSize: '28px', 
                  fontWeight: 'bold',
                  fontFamily: '"Times New Roman", serif'
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <Card 
              hoverable
              style={{
                background: 'transparent',
                border: `1px solid ${isDarkMode ? '#2a3a5a' : '#bfdbfe'}`,
                borderRadius: '16px',
                boxShadow: `0 8px 24px ${isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.12)'}`,
                transition: 'all 0.3s ease',
                fontFamily: '"Times New Roman", serif',
                height: '140px'
              }}
              bodyStyle={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <Statistic
                title={<span style={{ fontSize: '14px', fontWeight: '600', color: theme.textMuted, fontFamily: '"Times New Roman", serif' }}>Tasks In Progress</span>}
                value={stats.inProgressTasks}
                prefix={<BarChartOutlined style={{ color: '#3b82f6', fontSize: '20px' }} />}
                valueStyle={{ 
                  color: theme.textPrimary, 
                  fontSize: '28px', 
                  fontWeight: 'bold',
                  fontFamily: '"Times New Roman", serif'
                }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={8} lg={8}>
            <Card 
              hoverable
              style={{
                background: 'transparent',
                border: `1px solid ${isDarkMode ? '#5a2a5a' : '#e9d5ff'}`,
                borderRadius: '16px',
                boxShadow: `0 8px 24px ${isDarkMode ? 'rgba(168, 85, 247, 0.2)' : 'rgba(168, 85, 247, 0.12)'}`,
                transition: 'all 0.3s ease',
                fontFamily: '"Times New Roman", serif',
                height: '140px'
              }}
              bodyStyle={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <Statistic
                title={<span style={{ fontSize: '14px', fontWeight: '600', color: theme.textMuted, fontFamily: '"Times New Roman", serif' }}>Total Time Tracked</span>}
                value={`${Math.floor(stats.totalTimeTrackedMinutes / 60)}h ${stats.totalTimeTrackedMinutes % 60}m`}
                prefix={<ClockCircleOutlined style={{ color: '#a855f7', fontSize: '20px' }} />}
                valueStyle={{ 
                  color: theme.textPrimary, 
                  fontSize: '24px', 
                  fontWeight: 'bold',
                  fontFamily: '"Times New Roman", serif'
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8}>
            <Card 
              hoverable
              style={{
                background: 'transparent',
                border: `1px solid ${isDarkMode ? '#2a5a2a' : '#bbf7d0'}`,
                borderRadius: '16px',
                boxShadow: `0 8px 24px ${isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.12)'}`,
                transition: 'all 0.3s ease',
                fontFamily: '"Times New Roman", serif',
                height: '140px'
              }}
              bodyStyle={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <Statistic
                title={<span style={{ fontSize: '14px', fontWeight: '600', color: theme.textMuted, fontFamily: '"Times New Roman", serif' }}>Tasks Completed This Week</span>}
                value={stats.tasksCompletedThisWeek}
                prefix={<CheckCircleOutlined style={{ color: '#10b981', fontSize: '20px' }} />}
                valueStyle={{ 
                  color: theme.textPrimary, 
                  fontSize: '28px', 
                  fontWeight: 'bold',
                  fontFamily: '"Times New Roman", serif'
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8}>
            <Card 
              title={
                <span style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  color: theme.textPrimary,
                  fontFamily: '"Times New Roman", serif'
                }}>
                  🎯 Overall Task Completion
                </span>
              }
              hoverable
              style={{
                background: 'transparent',
                border: `1px solid ${theme.borderColor}`,
                borderRadius: '16px',
                boxShadow: `0 8px 24px ${theme.shadowColor}`,
                transition: 'all 0.3s ease',
                fontFamily: '"Times New Roman", serif',
                height: '140px'
              }}
              bodyStyle={{ padding: '20px', height: 'calc(100% - 57px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <Progress 
                percent={parseFloat(completionPercentage.toFixed(1))} 
                status={completionPercentage === 100 ? "success" : "active"} 
                strokeColor={{ 
                  '0%': '#6366f1', 
                  '50%': '#8b5cf6',
                  '100%': '#10b981' 
                }}
                trailColor={isDarkMode ? '#404040' : '#e2e8f0'}
                strokeWidth={8}
                style={{ marginBottom: '8px' }}
              />
              <Text 
                type="secondary" 
                style={{ 
                  display: 'block', 
                  textAlign: 'center', 
                  fontSize: '12px',
                  fontWeight: '500',
                  color: theme.textMuted,
                  fontFamily: '"Times New Roman", serif'
                }}
              >
                {stats.completedTasks} of {stats.totalTasks} tasks completed
              </Text>
            </Card>
          </Col>
        </Row>

        <Title 
          level={3} 
          style={{ 
            marginTop: '60px', 
            marginBottom: '30px',
            color: theme.textPrimary,
            fontSize: '2rem',
            fontWeight: 'bold',
            textAlign: 'center',
            fontFamily: '"Times New Roman", serif'
          }}
        >
          ⏱️ Time Spent Per Task
        </Title>
        {stats.timePerTask && stats.timePerTask.length > 0 ? (
          <List
            grid={{ gutter: 24, xs: 1, sm: 2, md: 3 }}
            dataSource={stats.timePerTask}
            renderItem={item => (
              <List.Item>
                <Card 
                  title={
                    <span style={{ 
                      color: theme.textPrimary, 
                      fontSize: '16px', 
                      fontWeight: 'bold',
                      fontFamily: '"Times New Roman", serif'
                    }}>
                      📋 {item.taskTitle}
                    </span>
                  }
                  hoverable 
                  size="small"
                  style={{
                    background: 'transparent',
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: '12px',
                    boxShadow: `0 4px 12px ${theme.shadowColor}`,
                    transition: 'all 0.3s ease',
                    fontFamily: '"Times New Roman", serif'
                  }}
                  bodyStyle={{ padding: '20px' }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Text 
                      strong 
                      style={{ 
                        color: theme.textSecondary, 
                        fontSize: '14px',
                        fontFamily: '"Times New Roman", serif'
                      }}
                    >
                      ⏰ Total Duration: 
                    </Text>
                    <div style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold', 
                      color: '#8c7ae6', 
                      marginTop: '8px',
                      fontFamily: '"Times New Roman", serif'
                    }}>
                      {`${Math.floor(item.totalDuration / 60)}h ${item.totalDuration % 60}m`}
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <div style={{
            background: 'transparent',
            border: `1px solid ${theme.borderColor}`,
            borderRadius: '16px',
            padding: '40px',
            boxShadow: `0 8px 24px ${theme.shadowColor}`,
            textAlign: 'center'
          }}>
            <Empty 
              description={
                <span style={{ 
                  color: theme.textMuted, 
                  fontSize: '16px',
                  fontFamily: '"Times New Roman", serif'
                }}>
                  No time has been tracked against specific tasks yet.
                </span>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsView;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Switch, Space, Typography, Badge, Avatar, Drawer, Button } from 'antd';
import { 
  UnorderedListOutlined, 
  FieldTimeOutlined, 
  BarChartOutlined, 
  SunOutlined, 
  MoonOutlined, 
  DashboardOutlined,
  MenuOutlined 
} from '@ant-design/icons';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { TaskProvider } from './contexts/TaskContext';
import ErrorBoundary from './components/ErrorBoundary';

import TaskListView from './views/TaskListView';
import TimeTrackingView from './views/TimeTrackingView';
import StatisticsView from './views/StatisticsView';

import './App.css';

const { Header, Content, Sider, Footer } = Layout;
const { Title, Text } = Typography;

const AppContent = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 992); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getSelectedKey = () => {
    if (location.pathname.startsWith('/time-tracking')) return ['/time-tracking'];
    if (location.pathname === '/statistics') return ['/statistics'];
    return ['/'];
  };

  const handleMenuClick = () => {
    if (isMobile) {
      setMobileDrawerVisible(false);
    }
  };

  const menuItems = [
    {
      key: '/',
      icon: <UnorderedListOutlined style={{ fontSize: '16px' }} />,
      label: (
        <Link 
          to="/" 
          onClick={handleMenuClick}
          style={{ 
            fontFamily: 'Times New Roman, serif', 
            fontSize: '15px', 
            fontWeight: '500',
            color: theme === 'light' ? '#000000' : '#ffffff'
          }}
        >
          Task Management
        </Link>
      ),
    },
    {
      key: '/time-tracking',
      icon: <FieldTimeOutlined style={{ fontSize: '16px' }} />,
      label: (
        <Link 
          to="/time-tracking" 
          onClick={handleMenuClick}
          style={{ 
            fontFamily: 'Times New Roman, serif', 
            fontSize: '15px', 
            fontWeight: '500',
            color: theme === 'light' ? '#000000' : '#ffffff'
          }}
        >
          Time Tracking
        </Link>
      ),
    },
    {
      key: '/statistics',
      icon: <BarChartOutlined style={{ fontSize: '16px' }} />,
      label: (
        <Link 
          to="/statistics" 
          onClick={handleMenuClick}
          style={{ 
            fontFamily: 'Times New Roman, serif', 
            fontSize: '15px', 
            fontWeight: '500',
            color: theme === 'light' ? '#000000' : '#ffffff'
          }}
        >
          Analytics & Reports
        </Link>
      ),
    },
  ];

  const siderStyle = {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 10,
    background: theme === 'light' ? '#ffffff' : '#001529',
    borderRight: theme === 'light' ? '1px solid #e8e8e8' : '1px solid #404040',
  };

  const headerStyle = {
    padding: isMobile ? '0 16px' : '0 32px',
    background: theme === 'light' ? '#ffffff' : '#001529',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: theme === 'light' ? '1px solid #e8e8e8' : '1px solid #404040',
    height: '70px',
    position: isMobile ? 'sticky' : 'static',
    top: 0,
    zIndex: 100,
  };

  const contentStyle = {
    margin: isMobile ? '16px 16px 0' : '32px 24px 0',
    padding: isMobile ? '16px' : '32px',
    background: theme === 'light' ? '#ffffff' : '#141414',
    borderRadius: '8px',
    border: theme === 'light' ? '1px solid #e8e8e8' : '1px solid #404040',
    minHeight: 'calc(100vh - 200px)',
  };

  const layoutStyle = {
    minHeight: '100vh',
    fontFamily: 'Times New Roman, serif',
    background: theme === 'light' ? '#f0f2f5' : '#000000'
  };

  const mainLayoutStyle = {
    marginLeft: isMobile ? 0 : 200,
    transition: 'margin-left 0.2s'
  };

  const SidebarContent = () => (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        height: '80px', 
        margin: '20px 16px', 
        background: theme === 'light' ? '#f5f5f5' : '#262626', 
        borderRadius: '8px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: theme === 'light' ? '1px solid #e8e8e8' : '1px solid #404040',
      }}>
        <Space direction="vertical" align="center" size={0}>
          <Avatar 
            size={32} 
            icon={<DashboardOutlined />} 
            style={{ 
              background: theme === 'light' ? '#1890ff' : '#722ed1',
              border: theme === 'light' ? '1px solid #d9d9d9' : '1px solid #595959'
            }} 
          />
          <Title 
            level={4} 
            style={{
              color: theme === 'light' ? '#1a1a1a' : '#ffffff', 
              margin: 0, 
              fontSize: isMobile ? '16px' : '18px',
              fontFamily: 'Times New Roman, serif',
              fontWeight: 'bold',
            }}
          >
            TaskManagement
          </Title>
        </Space>
      </div>

      <Menu
        theme={theme === 'light' ? 'light' : 'dark'}
        mode="inline"
        selectedKeys={getSelectedKey()}
        items={menuItems}
        style={{
          background: 'transparent',
          border: 'none',
          fontFamily: 'Times New Roman, serif',
          flex: 1
        }}
      />

      <div style={{
        margin: '20px 16px',
        padding: '12px',
        background: theme === 'light' ? '#f5f5f5' : '#262626',
        borderRadius: '8px',
        textAlign: 'center',
        border: theme === 'light' ? '1px solid #e8e8e8' : '1px solid #404040',
      }}>
        <Badge status="processing" />
        <Text style={{ 
          color: theme === 'light' ? '#666666' : 'rgba(255,255,255,0.8)', 
          fontSize: '12px',
          fontFamily: 'Times New Roman, serif'
        }}>
          System Online
        </Text>
      </div>
    </div>
  );

  return (
    <Layout style={layoutStyle}>
      {!isMobile && (
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          style={siderStyle}
        >
          <SidebarContent />
        </Sider>
      )}
      <Drawer
        title={null}
        placement="left"
        closable={false}
        onClose={() => setMobileDrawerVisible(false)}
        open={mobileDrawerVisible}
        bodyStyle={{ 
          padding: 0, 
          background: theme === 'light' ? '#ffffff' : '#001529' 
        }}
        width={280}
        style={{ zIndex: 1000 }}
        mask={true}
        maskClosable={true}
      >
        <SidebarContent />
      </Drawer>

      <Layout style={mainLayoutStyle} className="site-layout">
        <Header className="site-layout-header" style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileDrawerVisible(true)}
                style={{
                  marginRight: '16px',
                  color: theme === 'light' ? '#1a1a1a' : '#ffffff',
                  fontSize: '18px'
                }}
              />
            )}
            <Title 
              level={isMobile ? 4 : 3} 
              style={{
                margin: 0, 
                color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
                fontFamily: 'Times New Roman, serif',
                fontWeight: 'bold'
              }}
            >
              Dashboard
            </Title>
          </div>
          
          <Space size={isMobile ? "small" : "large"}>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
              {!isMobile && (
                <Text style={{
                  color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
                  fontFamily: 'Times New Roman, serif',
                  fontSize: '16px',
                  fontWeight: '500'
                }}>
                  {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                </Text>
              )}
              <Switch
                checkedChildren={<SunOutlined style={{ fontSize: '14px' }} />}
                unCheckedChildren={<MoonOutlined style={{ fontSize: '14px' }} />}
                checked={theme === 'light'}
                onChange={toggleTheme}
                style={{
                  background: theme === 'light' ? '#1890ff' : '#722ed1',
                }}
              />
            </div>
          </Space>
        </Header>

        <Content className="site-layout-content" style={contentStyle}>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<TaskListView />} />
              <Route path="/time-tracking" element={<TimeTrackingView />} />
              <Route path="/time-tracking/:taskId" element={<TimeTrackingView />} />
              <Route path="/statistics" element={<StatisticsView />} />
            </Routes>
          </ErrorBoundary>
        </Content>

        <Footer style={{ 
          textAlign: 'center',
          background: theme === 'light' ? '#ffffff' : '#001529',
          color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
          fontFamily: 'Times New Roman, serif',
          fontSize: isMobile ? '14px' : '16px',
          fontWeight: '500',
          padding: isMobile ? '16px 20px' : '24px 50px',
          borderTop: theme === 'light' ? '1px solid #e8e8e8' : '1px solid #404040',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Title 
              level={isMobile ? 5 : 4} 
              style={{ 
                color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
                fontFamily: 'Times New Roman, serif',
                margin: '0 0 8px 0',
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: 'bold'
              }}
            >
              Personal Task Dashboard
            </Title>
            <Text style={{ 
              color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(26,26,26,0.7)',
              fontFamily: 'Times New Roman, serif',
              fontSize: isMobile ? '12px' : '14px'
            }}>
              © {new Date().getFullYear()} - Crafted with precision for productivity excellence
            </Text>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

const App = () => (
  <Router>
    <ThemeProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </ThemeProvider>
  </Router>
);

export default App;
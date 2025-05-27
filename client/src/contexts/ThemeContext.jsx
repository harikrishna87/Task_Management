import { createContext, useState, useMemo, useContext } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const antdAlgorithm = useMemo(() =>
    theme === 'light' ? antdTheme.defaultAlgorithm : antdTheme.darkAlgorithm,
    [theme]
  );

  const antdToken = useMemo(() => ({
    colorPrimary: theme === 'light' ? '#1677ff' : '#177ddc',
  }), [theme]);


  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ConfigProvider theme={{ algorithm: antdAlgorithm, token: antdToken }}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
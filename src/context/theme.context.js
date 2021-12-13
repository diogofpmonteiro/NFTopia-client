import React, { createContext, useState } from "react";

const ThemeContext = createContext();

function ThemeProviderWrapper({ children }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export { ThemeContext, ThemeProviderWrapper };

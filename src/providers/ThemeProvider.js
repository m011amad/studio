"use client";

import { ConfigProvider } from "antd";
import useIllustrationTheme from "../app/theme/illustrationTheme";

export default function ThemeProvider({ children }) {
  const configProps = useIllustrationTheme();

  return <ConfigProvider {...configProps}>{children}</ConfigProvider>;
}

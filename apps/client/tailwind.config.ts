import config from "@repo/tailwind-config/tailwind.config";
import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  ...config,
  darkMode: "class",
  theme: {
    ...config.theme,
    extend: {
      ...config.theme.extend,
      screens: {
        ...defaultTheme.screens,
        ...config.theme.extend.screens,
      },
    },
  },
} satisfies Config;

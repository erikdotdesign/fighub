import { Theme } from "./types";

const lightThemeColors = {
  primary: "#202020",
  accent: "#ffffff",
  secondary: "#999999",
  bg: {
    z0: "#ffffff",
    z1: "#efefef",
    z2: "#DFDFDF",
    z3: "#CFCFCF"
  },
  green: "#29a329",
  yellow: "#b37700",
  red: "#e61919",
  hover: {
    primary: "#000000",
    accent: "#efefef",
    secondary: "#919191",
    green: "#259225",
    yellow: "#a06a00",
    red: "#ce1616",
  }
}

const darkThemeColors = {
  primary: "#efefef",
  accent: "#000000",
  secondary: "#999999",
  bg: {
    z0: "#000000",
    z1: "#202020",
    z2: "#303030",
    z3: "#404040"
  },
  green: "#33cc33",
  yellow: "#ffbb33",
  red: "#EB4747",
  hover: {
    primary: "#ffffff",
    accent: "#202020",
    secondary: "#A1A1A1",
    green: "#7bd77b",
    yellow: "#ffca7b",
    red: "#eb7474",
  }
}

export const getThemedStyle = (theme: Theme) => ({
  color: theme === "light" ? lightThemeColors : darkThemeColors,
  spacing: {
    small: 8,
    shmedium: 12,
    medium: 24,
    large: 32,
    xLarge: 56
  },
  padding: {
    small: 12,
    shmedium: 16,
    medium: 32,
    large: 56
  },
  fontFamily: {
    sansSerif: "IBM Plex Mono",
    mono: "IBM Plex Mono"
  },
  fontSize: {
    medium: 16,
    large: 32,
  },
  lineHeight: {
    medium: 24,
    large: 48
  },
  fontWeight: {
    normal: 400,
    semiBold: 600,
    bold: 700
  },
  cornerRadius: {
    medium: 16,
    large: 32
  }
});

export type ThemedStyle = ReturnType<typeof getThemedStyle>;
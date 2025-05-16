import { palette } from "./palette-trustie";

//possible value "default", "dark-content", "light-content"

const commonColors = {
  //Set 1 pink - black gradient
  // tabBackgroundStart: palette["color-lightpink-600"],
  // tabBackgroundEnd: palette["color-charcoal-400"],
  // tabButton: palette["color-primary-500"],
  // tabFont: palette["color-white"],
  // tabBorder: palette["color-charcoal-500"],

  // headerBackgroundStart: palette["color-lightpink-600"],
  // headerBackgroundEnd: palette["color-charcoal-400"],
  // headerButton: palette["color-primary-500"],
  // headerFontActive: palette["color-primary-500"],
  // headerFontInactive: palette["color-primary-200"],
  // headerBorder: palette["color-charcoal-500"],

  // overlayBackgroundStart: palette["color-white"],
  // overlayBackgroundEnd: palette["color-white"],
  // overlayButton: palette["color-primary-500"],
  // overlayFont: palette["color-charcoal-500"],
  // overlayBorder: palette["color-grey-500"],

  // gradTheme: [palette["color-charcoal-100"], palette["color-charcoal-300"]],

  //Set 2 pink gradient
  // tabBackgroundStart: palette["color-primary-500"],
  // tabBackgroundEnd: palette["color-primary-200"],
  // tabButton: palette["color-charcoal-500"],
  // tabFont: palette["color-white"],
  // tabBorder: palette["color-charcoal-500"],

  // headerBackgroundStart: palette["color-primary-500"],
  // headerBackgroundEnd: palette["color-primary-200"],
  // headerButton: palette["color-charcoal-500"],
  // headerFontActive: palette["color-white"],
  // headerFontInactive: palette["color-white"],
  // headerBorder: palette["color-charcoal-500"],

  // overlayBackgroundStart: palette["color-white"],
  // overlayBackgroundEnd: palette["color-white"],
  // overlayButton: palette["color-primary-500"],
  // overlayFont: palette["color-charcoal-500"],
  // overlayBorder: palette["color-grey-500"],

  // to delete after
  tabBackgroundStart: palette["color-white"],
  tabBackgroundEnd: palette["color-white"],
  tabButtonBackground: palette["color-primary-500"],
  tabButtonActive: palette["color-white"],
  tabButtonInactive: palette["color-charcoal-400"],
  tabFont: palette["color-primary-500"],
  tabBorder: palette["color-charcoal-200"],

  headerBackgroundStart: palette["color-primary-200"],
  headerBackgroundEnd: palette["color-primary-100"],
  headerButton: palette["color-primary-500"],
  headerFontActive: palette["color-primary-500"],
  headerFontInactive: palette["color-charcoal-600"],
  headerBorder: palette["color-charcoal-500"],

  overlayBackgroundStart: palette["color-white"],
  overlayBackgroundEnd: palette["color-white"],
  overlayButton: palette["color-charcoal-500"],
  overlayFont: palette["color-charcoal-500"],
  overlayBorder: palette["color-grey-500"],

  // gradTheme: [palette["color-charcoal-100"], palette["color-charcoal-300"]],

  gradTheme: ["#f5f9fc", palette["color-primary-100"]],

  spend: palette["color-sapphire-500"],
  spendLow: palette["color-sapphire-200"],
  saving: palette["color-lavender-500"],
  savingLow: palette["color-lavender-200"],

  buttonPrimary: palette["color-primary-500"],
  buttonSecondary: palette["color-primary-100"],
  buttonTertiary: "#E98090",
  income: "#B8FFC2",
  transfer: "#ffeaa7",

  primary100: palette["color-primary-100"],
  primary200: palette["color-primary-200"],
  primary300: palette["color-primary-300"],
  primary400: palette["color-primary-400"],
  primary500: palette["color-primary-500"],
  primary: palette["color-primary-500"],
  primaryActive: palette["color-primary-700"],
  secondary: palette["color-lightpink-100"],
  menuPrimary: palette["color-lightpink-400"],
  menuSecondary: palette["color-primary-500"],
  success: palette["color-success-500"],
  successActive: palette["color-success-700"],
  info: palette["color-info-500"],
  infoActive: palette["color-info-700"],
  warning: palette["color-warning-500"],
  warningActive: palette["color-warning-700"],
  danger: palette["color-danger-500"],
  dangerActive: palette["color-danger-700"],
  error: palette["color-danger-500"],
  errorActive: palette["color-danger-700"],
  foreground: palette["color-info-transparent-400"],
  modalBackground: palette["color-info-transparent-400"],
  //background: palette["color-info-300"],
  overlay: palette["color-info-transparent-500"],
  highlight: palette["color-info-900"],
  white: palette["color-white"],
  black: palette["color-black"],
  defaultText: palette["color-black"],
  primaryText: palette["color-primary-500"],
  grayText: palette["color-black-500"],
  inputText: "#05375a",
  buttonText: palette["color-white"],
  buttonEnabled: palette["color-primary-500"],
  buttonDisabled: palette["color-charcoal-400"],
  buttonRipple: palette["color-primary-200"],
  primaryAction: palette["color-primary-700"],
  avatarName: palette["color-info-700"], //'#6f7c8a',
  border: palette["color-black-600"], // '#616164',
  lightGray: palette["color-black-200"],
  mediumGray: palette["color-black-400"],
  darkGray: palette["color-black-700"],
  divider: palette["color-info-200"], //'#F2F2F2',
  defaultBorder: palette["color-black-500"],
  primaryBorder: palette["color-primary-500"],
  defaultModal: palette["color-white"],
  primaryModal: palette["color-primary-500"],
  header: "rgba(255,255,255, 0.5)",
  boy: "#d3e4ff", //'#bbcce8', //'#72c2ff',
  girl: "#fcd9d9", //'#ffe5e5',
  transparent: "rgba(0,0,0,0)",
  ricePaper: "rgba(255,255,255, 0.85)",

  contribution: "#0e8418", //'#0d8cc6',
  goal: "#9ffcb3",
  verified: palette["color-success-500"],
  valid: palette["color-success-500"],
  positive: palette["color-success-500"],
  negative: "#ef1f28",
  codeCheck: palette["color-success-500"],
  credit: "#27ae60",
  debit: "#ef1f28",
  taskReward: palette["color-success-500"],
  taskRewardActive: palette["color-success-700"],
  taskChore: palette["color-warning-500"],
  taskChoreActive: palette["color-warning-700"],
  taskPenalty: palette["color-danger-500"],
  taskPenaltyActive: palette["color-danger-700"],
  invite: palette["color-success-500"],
  friend: palette["color-primary-500"],
  blocked: palette["color-danger-400"],
  contact: palette["color-warning-300"],
  wheel1: palette["color-primary-700"],
  wheel2: palette["color-primary-200"],
  wheel3: palette["color-primary-500"],

  fieldBorderColor: "#0691ce", //blue

  //success: '#52c41a',
  //error: '#ff190c',
  //warning: '#faad14',
  //primary: '#4d76a7', //'#007dc0',
  //secondary: '#91b6dd', //'#79d8ac',//'#8cd5df'
  //gray: '#848b90', //'#D7DFE3',
  //lightGray: '#F5F5F5', //'#ececec',
  //mediumGray: '#c9c9c9', //'#afb8bb',
  //darkGray: '#7A7777', //'#666666',
  //grayText: '#6f6f6f',
  //background: '#F2F2F2', //grey '#01579B', //dark blue

  orange: "#f39c12",
  blue: "#2980b9",
  red: "#ef1f28",
  yellow: "#F5C94E",
  purple: "#933DA8",
  salmon: "#FC714E",
  green: "#27ae60",

  Salary: "#79d8ac",
  Savings: "#0e8418",
  Deposits: "#27ae60",

  Bills: "#f39c12",
  Car: "#2980b9",
  Communications: "#ef1f28",
  EatingOut: "#F5C94E",
  Entertainment: "#933DA8",
  Food: "#FC714E",
  Gifts: "#B721FF",
  Health: "#91b6dd",
  Home: "#dee580",
  Pets: "#a29bfe",
  Sport: "#DA0569",
  Transport: "#ffeaa7",
  Holiday: "#ff7675",
  Services: "#81ecec",
  Education: "#74b9ff",
  Fees: "#00cec9",
  Kid: "#0984e3",
  Shopping: "#6c5ce7",
  Travel: "#fab1a0",
  Transfer: "#ff7675",
  Insurance: "#fd79a8",
  // "#fdcb6e", //Bright yarrow
  // "#e17055", //Orangeville
  // "#d63031", //chichong
  // "#e84393", //prunus avium

  gradButton: [palette["color-primary-200"], palette["color-primary-700"]], //["#4d76a7", "#91b6dd"], //['#B721FF','#21D4FD'],
  gradAzure: ["#7F7FD5", "#86A8E7", "#91EAE4"],
  //gradTheme: ['#bdc3c7','#2c3e50'],
  gradSpend: ["#65b5f7", "#148cF0"], //['#dee580','#cac531'],
  gradSaving: ["#55ba5e", "#0e8418"], //['#30dd95','#11998e'],
  //gradButton:['#2f80ed','#007dc0'],
  gradInsta: ["#DA0569", "#4E58CF"],
  gradSky: ["#56ccf2", "#2f80ed"],
  gradVision: ["#1cb5e0", "#000046"],
  gradPurple: ["#6670a5", "#2d324f"],
  gradGray: ["#bdc3c7", "#2c3e50"],
  gradPrimary: ["#91b6dd", "#4d76a7"],
  //gradTheme: ["#f5f9fc", palette["color-primary-100"]], //["#f5f9fc", "#93afcc"], //[("#f0f5fa", "#b5cee6")], // ["#000046", "#4d76a7"], // ["#91b6dd", "#4d76a7"], //["#bdc3c7", "#2c3e50"], //['#ececec','#ececec'], //['#7F7FD5','#86A8E7','#91EAE4'], // purple //['#30dd95','#11998e'], //green // ['#bdc3c7','#2c3e50'], //grey
};

export const TrustieLightTheme = {
  colors: {
    ...commonColors,
    defaultText: palette["color-black"],
    tabBackgroundStart: palette["color-white"],
    tabBackgroundEnd: palette["color-white"],
    tabButtonBackground: palette["color-primary-500"],
    tabButtonActive: palette["color-white"],
    tabButtonInactive: palette["color-charcoal-400"],
    tabFont: palette["color-primary-500"],
    tabBorder: palette["color-charcoal-200"],

    headerBackgroundStart: palette["color-primary-200"],
    headerBackgroundEnd: palette["color-primary-100"],
    headerButton: palette["color-primary-500"],
    headerFontActive: palette["color-charcoal-500"],
    headerFontInactive: palette["color-charcoal-400"],
    headerBorder: palette["color-charcoal-500"],

    overlayBackgroundStart: palette["color-white"],
    overlayBackgroundEnd: palette["color-white"],
    overlayButton: palette["color-charcoal-500"],
    overlayFont: palette["color-charcoal-500"],
    overlayBorder: palette["color-grey-500"],

    card: palette["color-white"],

    textLight: palette["color-black-200"],
    textMedium: palette["color-black-400"],
  },
  spacing: {
    S: 8,
    M: 12,
    L: 16,
    XL: 20,
    XXL: 24,
  },
  fontSize: {
    S: 8,
    M: 12,
    L: 16,
    XL: 20,
    XXL: 24,
  },
};

export const TrustieDarkTheme = {
  colors: {
    ...commonColors,
    defaultText: palette["color-white"],
    tabBackgroundStart: palette["color-black"],
    tabBackgroundEnd: palette["color-black"],
    tabButtonBackground: palette["color-primary-500"],
    tabButtonActive: palette["color-black"],
    tabButtonInactive: palette["color-white"],
    tabFont: palette["color-primary-500"],
    tabBorder: palette["color-black"],

    headerBackgroundStart: palette["color-primary-200"],
    headerBackgroundEnd: palette["color-primary-100"],
    headerButton: palette["color-primary-500"],
    headerFontActive: palette["color-charcoal-500"],
    headerFontInactive: palette["color-charcoal-400"],
    headerBorder: palette["color-charcoal-500"],

    overlayBackgroundStart: palette["color-white"],
    overlayBackgroundEnd: palette["color-white"],
    overlayButton: palette["color-charcoal-500"],
    overlayFont: palette["color-charcoal-500"],
    overlayBorder: palette["color-grey-500"],

    card: palette["color-charcoal-500"],

    textLight: palette["color-black-200"],
    textMedium: palette["color-black-400"],
  },
  spacing: {
    S: 8,
    M: 12,
    L: 16,
    XL: 20,
    XXL: 24,
  },
  fontSize: {
    S: 8,
    M: 12,
    L: 16,
    XL: 20,
    XXL: 24,
  },
};

export const Colors = commonColors;

// from https://flatuicolors.com/ american
export const randomColors = [
  "#55efc4", // Light greenish blue
  "#81ecec", // Faded poster
  "#74b9ff", // Green Darner Tail
  "#a29bfe", // Shymoment
  "#00b894", // mint leaf
  "#00cec9", // robin egg blue
  "#0984e3", // electron blue
  "#6c5ce7", //exodus fruit
  "#ffeaa7", //sour lemon
  "#fab1a0", //first date
  "#ff7675", //pink glamour
  "#fd79a8", //pico pink
  "#fdcb6e", //Bright yarrow
  "#e17055", //Orangeville
  "#d63031", //chichong
  "#e84393", //prunus avium
];

export const Shadow = {
  shadowColor: Colors.darkGray,
  shadowOffset: {
    width: 4,
    height: 7,
  },
  shadowOpacity: 0.5,
  elevation: 15,
};

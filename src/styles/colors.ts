type Neutral =
  | "white"
  | "s100"
  | "s150"
  | "s200"
  | "s250"
  | "s300"
  | "s400"
  | "s500"
  | "s600"
  | "s700"
  | "s800"
  | "s900"
  | "black"
export const neutral: Record<Neutral, string> = {
  white: "#ffffff",
  s100: "#efeff6",
  s150: "#dfdfe6",
  s200: "#c7c7ce",
  s250: "#bbbbc2",
  s300: "#9f9ea4",
  s400: "#7c7c82",
  s500: "#515154",
  s600: "#38383a",
  s700: "#2d2c2e",
  s800: "#212123",
  s900: "#161617",
  black: "#000000",
}

type Primary = "brand" | "s200" | "s600"
export const primary: Record<Primary, string> = {
  s200: "#1934FF",
  brand: "#0014A8",
  s600: "#011EF5",
}

type Secondary = "brand" | "s200" | "s600"
export const secondary: Record<Secondary, string> = {
  s200: "#A88200",
  brand: "#F5BD00",
  s600: "#F59F00",
}

type Danger = "s400"
export const danger: Record<Danger, string> = {
  s400: "#cf1717",
}

type Success = "s400"
export const success: Record<Success, string> = {
  s400: "#008a09",
}

type Warning = "s400"
export const warning: Record<Warning, string> = {
  s400: "#cf9700",
}
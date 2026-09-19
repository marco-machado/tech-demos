/// <reference types="vite/client" />
declare module "virtual:demo-catalogue" {
  const demos: import("./types").Demo[];
  export default demos;
}

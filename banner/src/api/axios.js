import axios from "./index";

export function getImgUrl() {
  return axios.get("/getImage");
}

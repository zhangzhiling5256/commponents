import axios from "axios";
import Qs from "qs";

axios.defaults.baseURL="http://localhost:8888";
axios.defaults.withCredenttials=true;
axios.defaults.transformRequest=(data={})=>{return Qs.stringify(data)};
axios.interceptors.response.use(result=>result.data);
export default axios;
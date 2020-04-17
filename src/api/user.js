/**
 * user接口
 */
import axios from './http'
 const user = {
     getuserlist (data){
         return axios.get(`users`,{
            params: data
          })
     }
 }

 export default user
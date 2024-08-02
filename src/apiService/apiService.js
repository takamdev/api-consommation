import axios from "axios";

const url = "https://simon.zayado.net/public/api/identitydocs"


export async  function getAll(){
        try {
            return await  axios.get(`${url}`)   
        } catch (error) {
            return error.response
        }
}


export async function getById(id){
        try {
           return await axios.get(`${url}/${id}`)  
        } catch (error) {
            return error.response
        }
}

export async function editData(id,data){
    console.log(data);
    try {
       return await axios.put(`${url}/${id}`,data)  
    } catch (error) {
        return error.response
       
    }
}

export async function deleteData(id){
    try {
       return await axios.delete(`${url}/${id}`)  
    } catch (error) {
        return error.response
    }
}

export async function uploadDta(data){
    try {
       return await axios.post(`${url}`,data)  
    } catch (error) {
        return error.response
    }
}


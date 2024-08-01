import axios from "axios";

const url = "https://simon.zayado.net/public/api/passports"


export async  function getAll(){
        try {
            return await  axios.get(`${url}`)   
        } catch (error) {
            console.log(error);
        }
}


export async function getById(id){
        try {
           return await axios.get(`${url}/${id}`)  
        } catch (error) {
            console.log(error);
        }
}

export async function editData(id,data){
    try {
       return await axios.put(`${url}/${id}`,{identitydoc:data})  
    } catch (error) {
        console.log(error);
    }
}

export async function deleteData(id){
    try {
       return await axios.delete(`${url}/${id}`)  
    } catch (error) {
        console.log(error);
    }
}

export async function uploadDta(data){
    try {
       return await axios.post(`${url}`,{identitydoc:data})  
    } catch (error) {
        console.log(error);
    }
}
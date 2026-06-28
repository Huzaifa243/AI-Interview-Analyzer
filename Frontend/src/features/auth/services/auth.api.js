/// isi file me hum ye logic likhte h k hamara frontend exactly kese backend ki api's se communicate karta h.
// frontend ko agar backend se communicate karna hota h to ek package ka use karna hota h jis ka naam h "axios".
import axios from "axios"


const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})


export async function register({ username, email, password }) {

    try{

        const response = await api.post('/api/auth/register', {
            username, email, password
        })

        return response.data

    } catch(err) {

        throw err.response?.data || err;
        

    }

}


export async function login({ email, password }) {

    try{
        
        const response = await api.post('/api/auth/login', {
            email, password
        }) 

        return response.data


    } catch (err) {
        throw err.response?.data || err;
        
    }

}


export async function logout() {

    try{
          
        const response = await api.get('/api/auth/logout')

        return response.data

    } catch(err) {
        throw err.response?.data || err;
        
    }

}


export async function getMe() {

    try{

        const response = await api.get('/api/auth/get-me')

        return response.data

    } catch (err) {
        throw err.response?.data || err;
    }

}


/// ye 4 functions jo humne backend pe 4 api's bana k rakhe h un se interact karte h.

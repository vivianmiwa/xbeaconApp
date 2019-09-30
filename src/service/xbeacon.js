import axios from 'axios';

axios.defaults.timeout = 30000;

const getID = async (minor) => {

  try {
    const response = await axios.get('http://179.106.206.14:3000/api/beacons/' + minor)
    let {status, data} = response.data;
    if(status === "success"){
      if(data.id != NULL){
        return data.id;
      }
    }
    return "";
  } catch (e) {
    reject(e);
  }
}

const services = {
  getID
};

export default services;


var minhaPromise = function(minor){
//var XMLHTTPRequest = require("xmlhttprequest").XMLHTTPRequest;

//import {XMLHTTPRequest} from 'xmlhttprequest'

  return new Promise(function(resolve, reject){ // Promise é uma classe e resolve e reject são funções dentro de uma função, sendo de sucesso e insucesso respectivamente.

    var request = new XMLHttpRequest(); // classe que dá acesso ao Ajax.
    //request.open('GET', `http://127.0.0.1:3000/api/beacons/${minor}`); // primeiro campo é o método e o segundo é a URL de onde quer buscar os dados.
    request.open('GET', 'http://127.0.0.1:3000/api/list'); // primeiro campo é o método e o segundo é a URL de onde quer buscar os dados.

    request.send(); // envio dos parâmetros da requisição.

    request.onreadystatechange = function(){
      if(request.readyState === 4){ // 4 é a variável que significa que a resposta voltou.
        if(request.status === 200){
          resolve(JSON.parse(request.responseText)); // move para dentro da promise.
        }
        else{
          reject(request.responseText);
        }
      }
    }
  });
}

// funcoes do bluetooth
minor = 1245234;
minhaPromise(minor)
  .then(function(response){

    console.log(response);

  }) // chamado caso o response seja executado.
  .catch(function(error){
    console.log(error);
    console.warn(error);
  }); // chamado caso o reject seja executado.

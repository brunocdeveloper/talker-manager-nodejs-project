function generateToken() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 16; i += 1) {
     text += possible.charAt(Math.floor(Math.random() * possible.length)); 
  }

  return text;
}

// fonte da função de gerar token https://www.webtutorial.com.br/funcao-para-gerar-uma-string-aleatoria-random-com-caracteres-especificos-em-javascript/

module.exports = generateToken;

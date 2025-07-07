const cepInput = document.getElementById('cep');
const erro = document.getElementById('erro');

cepInput.addEventListener('input', () => {
  const cep = cepInput.value.replace(/\D/g, '');

  if (cep.length === 8) {
    buscarEndereco(cep);
  }
});

function buscarEndereco(cep) {
  erro.classList.add('hidden');

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(res => res.json())
    .then(data => {
      if (data.erro) {
        mostrarErro('CEP não encontrado.');
        return;
      }

      document.getElementById('logradouro').value = data.logradouro || '';
      document.getElementById('bairro').value = data.bairro || '';
      document.getElementById('localidade').value = data.localidade || '';
      document.getElementById('uf').value = data.uf || '';
      salvarNoLocalStorage(data);
    })
    .catch(() => {
      mostrarErro('Erro ao consultar o CEP.');
    });
}

function mostrarErro(msg) {
  erro.textContent = msg;
  erro.classList.remove('hidden');


  document.getElementById('logradouro').value = '';
  document.getElementById('bairro').value = '';
  document.getElementById('localidade').value = '';
  document.getElementById('uf').value = '';
}

function salvarNoLocalStorage(data) {
  const novoEndereco = {
    nome: document.getElementById('nome').value || '',
    cep: document.getElementById('cep').value || '',
    logradouro: data.logradouro || '',
    bairro: data.bairro || '',
    localidade: data.localidade || '',
    uf: data.uf || ''
  };

  let enderecos = JSON.parse(localStorage.getItem('enderecos')) || [];
  enderecos.push(novoEndereco);
  localStorage.setItem('enderecos', JSON.stringify(enderecos));
}
function listarEnderecos() {
  const listaContainer = document.getElementById('lista-enderecos');
  listaContainer.innerHTML = ''; // Limpa a lista antiga
  listaContainer.classList.remove('hidden');

  let enderecos = JSON.parse(localStorage.getItem('enderecos')) || [];

  if (enderecos.length === 0) {
    listaContainer.textContent = 'Nenhum endereço salvo.';
    return;
  }

  enderecos.forEach((endereco, index) => {
    const div = document.createElement('div');
    div.className = 'endereco-card';
    div.innerHTML = `
      <strong>${index + 1}) ${endereco.nome}</strong><br>
      CEP: ${endereco.cep}<br>
      Logradouro: ${endereco.logradouro}<br>
      Bairro: ${endereco.bairro}<br>
      Cidade: ${endereco.localidade}<br>
      Estado: ${endereco.uf}<br>
    `;
    listaContainer.appendChild(div);
  });
}

function carregarEnderecoDoLocalStorage() {
  const enderecoSalvo = JSON.parse(localStorage.getItem('endereco'));

  if (enderecoSalvo) {
    document.getElementById('nome').value = enderecoSalvo.nome || '';
    document.getElementById('cep').value = enderecoSalvo.cep || '';
    document.getElementById('logradouro').value = enderecoSalvo.logradouro || '';
    document.getElementById('bairro').value = enderecoSalvo.bairro || '';
    document.getElementById('localidade').value = enderecoSalvo.localidade || '';
    document.getElementById('uf').value = enderecoSalvo.uf || '';
  }
}

document.addEventListener('DOMContentLoaded', carregarEnderecoDoLocalStorage);
document.getElementById('btn-listar').addEventListener('click', listarEnderecos);
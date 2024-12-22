const fs = require('fs');
const path = require('path');
// const readline = require('node:readline');
let paths = [];

const PERGUNTA_ROTA = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const COMPONENTS_DIR = path.join(__dirname, 'src/app');
// const ARQUIVOS_MODIFICADOS = fs.readFileSync(path.join(__dirname, '/arquivos_modificados.txt'), 'utf8').split('\n').filter(Boolean);
let arquivos = fs.readFileSync(path.join(__dirname, '/arquivos_modificados.txt'), 'utf8').split('\n').filter(Boolean)
let ARQUIVOS_MODIFICADOS = [];

let paiAtualArquivo;
arquivos.forEach(arquivo => {
  let isCabecalho = arquivo.split(',').length > 1;
  if (isCabecalho) {
    let cabecalho = arquivo.split(',');
    let nome = cabecalho[0];
    let data_commit = cabecalho[1];
    paiAtualArquivo = {nome, data_commit}
  } else {
    console.log(paiAtualArquivo);
    ARQUIVOS_MODIFICADOS.push( {arquivoAlterado: arquivo, ...paiAtualArquivo});
  }

});

console.log(ARQUIVOS_MODIFICADOS);
// const ROUTES_FILE = path.join(__dirname, '/src/app/elementos/elementos-routing.module.ts');
// const content = fs.readFileSync(ROUTES_FILE, 'utf8');

function recuperarTodosArquivos(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            // Se for um diretório, chama a função recursivamente
            recuperarTodosArquivos(filePath, fileList);
        } else {
            // Se for um arquivo, adiciona o caminho relativo
            fileList.push(path.relative(__dirname, filePath));
        }
    });

    return fileList;
}

const files = recuperarTodosArquivos(COMPONENTS_DIR);

function encontrarComponentes(componentName) {
    const componentFiles = [];
    const baseArquivo = componentName.split('.')[0].replace(/Component/g, '');
    const separadoPorTracos = baseArquivo.replace(/([A-Z])/g, '-$1').replace(/^-/, '');

    const filteredFiles = files.filter(file => {
        const lowercaseFile = file.toLowerCase();
        const lowercaseBaseArquivo = baseArquivo.toLowerCase();
        const lowercaseSeparadoPorTracos = separadoPorTracos.toLowerCase();
        return lowercaseFile.includes(lowercaseBaseArquivo) || lowercaseFile.includes(lowercaseSeparadoPorTracos);
    });

    componentFiles.push(...filteredFiles);

    return componentFiles;
}


function extrairConteudoDoArray(arquivoString, variableName) {
    arquivoString = arquivoString.replace(/component:\s*([a-zA-Z0-9]+)/g, "component: '$1'");

    const variableRegex = new RegExp(`(?:const|var|let)\\s\\b${variableName}.*\\s*=\\s*\\[`, 'm'); // Regex para encontrar a declaração da variável

    const match = variableRegex.exec(arquivoString); // Procurar a variável
    if (!match) {
        console.log("Variable not found.");
        return;
    }

    const startIndex = match.index + match[0].length - 1;

    let openBracketsCount = 0;
    let endIndex = startIndex;
    let foundOpeningBracket = false;
    for (let i = startIndex; i < arquivoString.length; i++) {
        const char = arquivoString[i];

        if (char === '[') {
            if (!foundOpeningBracket) {
                foundOpeningBracket = true;
            }
            openBracketsCount++;
        } else if (char === ']') {
            openBracketsCount--;
        }
        if (openBracketsCount === 0 && foundOpeningBracket) {
            endIndex = i;
            break;
        }
    }
    const routesArrayContent = arquivoString.slice(startIndex, endIndex + 1);
    return eval(routesArrayContent);
}

function formataString(string) {
    return string.split('/')[string.split('/').length - 1].replace(/([A-Z])/g, '-$1').replace(/^-/, '').toLowerCase().replace('component', '')
}

function insereEmPathRecursivamente(objeto, caminho = '', arquivo_modificado = false) {
  if (objeto.children) {
    objeto.children.forEach((filho) => {
      insereEmPathRecursivamente(filho, caminho + '/' + objeto.path, arquivo_modificado);
    });
  }
  let objetoIncluso = { rota: rota_raiz + caminho + '/' + objeto.path, componente: objeto.component?.toString(), arquivos: objeto.component ? encontrarComponentes(objeto.component.toString()) : undefined };



  let stringTratada = '';
  if (arquivo_modificado && objetoIncluso.componente) {
    stringTratada = ARQUIVOS_MODIFICADOS.find(arq => formataString(arq.arquivoAlterado).includes(objetoIncluso.componente.toLowerCase().replace('component', '')));
  }

  if (paths.find(x => x.rota == objetoIncluso.rota) || (arquivo_modificado && stringTratada))
  return;
  paths.push(objetoIncluso);
}

// function rodaCodigoEmUmaRota(conteudo = content) {
//     const arrayOriginal = extrairConteudoDoArray(conteudo, 'routes');

//     arrayOriginal.forEach((objeto) => {
//         insereEmPathRecursivamente(objeto = objeto, rota = '', arquivo_modificado = false);
//     });

// }



function rotaCodigoEmTodasAsRotas() {
    const arquivosDeRotas = files.map(arquivo => arquivo.includes('-routing.module.ts') ? arquivo : null).filter(Boolean);
    arquivosDeRotas.forEach(rota => {
        const conteudoDaRota = fs.readFileSync(rota, 'utf-8');
        console.log(conteudoDaRota.length);
        const arrayOriginal = extrairConteudoDoArray(conteudoDaRota, 'routes');
        if (arrayOriginal == undefined) return;
        arrayOriginal.forEach((objeto) => {
            insereEmPathRecursivamente(objeto = objeto, rota = '', arquivo_modificado = true);
        });
    });

}

function main() {
    PERGUNTA_ROTA.question(`\x1b[32mExemplo de Rota Raiz:\x1b[0m https://portal-hml.enc.fyi/ \n\n\x1b[42mDIGITE A ROTA RAIZ:\x1b[0m `, name => {
        rota_raiz = name;
        // rodaCodigoEmUmaRota();
        rotaCodigoEmTodasAsRotas();
        paths = paths.filter(x => x.componente != undefined && x.arquivos != undefined);
        console.log(JSON.stringify(paths, null, 4));

        console.log('Quantidade de rotas: ' + paths.length);
        PERGUNTA_ROTA.close();
    });
}

main();

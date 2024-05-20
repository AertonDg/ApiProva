//Paciência e uma boa prova. Que a Força esteja com você!
import { v4 as uuidv4 } from 'uuid'; //Se não souber, não precisa usar.
import fs, { writeFile } from 'node:fs'
import { createServer } from 'node:http'
import LerDadosPessoa from './lerDados.js';

const PORT = 3333

const server = createServer((request, response) => {
    const { method, url } = request;
    if (method === 'GET' && url === '/pessoas') {
        LerDadosPessoa((err, pessoas) => {
            if (err) {
                response.writeHead(500, { "Content-Type": "application/json" })
                response.end(JSON.stringify({ message: "não é possivel ler o arquivo..." }))
                return
            }
            response.writeHead(200, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify(pessoas))
        })

    } else if (method === 'POST' && url === "/pessoas") {
        let body = ""
        request.on('data', (chunck) => {
            body += chunck
        })
        request.on('end', () => {

            const novaPessoa = JSON.parse(body);
            LerDadosPessoa((err, pessoas) => {
                console.log(pessoas)
                if (err) {
                    console.log(err)
                    response.writeHead(500, { "Content-Type": "application/json" })
                    response.end(JSON.stringify({ message: "não é possivel ler o arquivo..." }))
                    return

                }
                novaPessoa.id = pessoas.length + 1
                const verifcaEmail = pessoas.find((pessoa) => pessoa.email === novaPessoa.email)

                if (verifcaEmail) {
                    response.writeHead(400, { "Content-Type": "application/json" })
                    response.end(JSON.stringify({ message: "o email já está sendo usado" }))
                    return
                }
                pessoas.push(novaPessoa)

                writeFile('pessoas.json', JSON.stringify(pessoas, null, 2), (err) => {
                    if (err) {
                        response.writeHead(500, { "Content-Type": "application/json" })
                        response.end(JSON.stringify({ message: "não é possivel ler o arquivo..." }))
                        return
                    }
                    response.writeHead(201, { "Content-Type": "application/json" })
                    response.end(JSON.stringify(novaPessoa))

                });
            });
        });

    } else if (method === "GET" && url.startsWith("/pessoa/")) {
        const id = url.split('/')[2]
        LerDadosPessoa((err, pessoas) => {
            console.log(pessoas)
            if (err) {
                console.log(err)
                response.writeHead(500, { "Content-Type": "application/json" })
                response.end(JSON.stringify({ message: "não é possivel ler o arquivo..." }))
                return
            }
            const index = pessoas.findIndex((pessoa) => pessoa.id == id)
            if (index == -1) {
                response.writeHead(404, { "Content-Type": "application/json" })
                response.end(JSON.stringify({ message: "Perfil não encontrado!" }))
                return
            }
            response.writeHead(200, { "Content-Type": "application/json" })
            response.end(JSON.stringify(pessoas[index]))
        })

    }else{
        
    }
});
server.listen(PORT, () => {
    console.log('o servidor está on...' + PORT)
});
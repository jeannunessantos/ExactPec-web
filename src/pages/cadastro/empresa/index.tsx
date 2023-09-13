import { Container } from "../../../components/container";
import { FiEdit2, FiTrash2, FiPlusCircle } from "react-icons/fi";
import { ImSearch } from "react-icons/im";
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { collection, getDocs, query, doc, deleteDoc, where } from 'firebase/firestore'
import { db } from '../../../services/firebaseConnection'
import toast from "react-hot-toast";

export function PesquisarEmpresa(){

    interface EmpresasProps{
        id: string,
        nome: string,
        documento: string,
        tipoDocumento: string
        nscricaoMunicipal: string,
        iscricaoEstadual: string,
        responsavel: string,
        telefone: string,
        email: string,
        dataCriacao: Date,
        situacao: number,
        
    }
    
    const [input, setInput] = useState("")
    const [empresas, setEmpresas] = useState<EmpresasProps[]>([])
    const navigate = useNavigate();

    useEffect(() => {
        loadEmpresas();
    }, [])

    async function handleSearchEmpresa(){
        if(input === ''){
            loadEmpresas();
          return;
        }

        setEmpresas([])
        const q = query(collection(db, 'Empresas'), 
        where("nome", ">=", input),
        where("nome", "<=", input + "\uf8ff")
        )

        const querySnapshot = await getDocs(q)
        let listEmpresas = [] as EmpresasProps[];

        querySnapshot.forEach(doc => {
            listEmpresas.push({
                id: doc.id,
                nome: doc.data().nome,
                documento: doc.data().documento,
                situacao: doc.data().situacao,
                tipoDocumento: doc.data().tipoDocumento,
                nscricaoMunicipal: doc.data().nscricaoMunicipal,
                iscricaoEstadual: doc.data().striniscricaoEstadual,
                responsavel: doc.data().responsavel,
                telefone: doc.data().telefone,
                email: doc.data().email,
                dataCriacao: doc.data().dataCriacao,
            })
        });

        setEmpresas(listEmpresas);
    }

    function loadEmpresas(){
        const empresasRef = collection(db, "Empresas")
        const queryRef = query(empresasRef)
        getDocs(queryRef)
        .then((snapshot) => {
        let listEmpresas = [] as EmpresasProps[];

        snapshot.forEach( doc => {
            listEmpresas.push({
                id: doc.id,
                nome: doc.data().nome,
                documento: doc.data().documento,
                situacao: doc.data().situacao,
                tipoDocumento: doc.data().tipoDocumento,
                nscricaoMunicipal: doc.data().nscricaoMunicipal,
                iscricaoEstadual: doc.data().striniscricaoEstadual,
                responsavel: doc.data().responsavel,
                telefone: doc.data().telefone,
                email: doc.data().email,
                dataCriacao: doc.data().dataCriacao,
            })
        })
        setEmpresas(listEmpresas);  
        })
    }

    function novoCadastro(){
        navigate(`/cadastro/empresa`);
    };

    function editarItem(id: string){
        navigate(`/cadastro/empresa/${id}`);
    };

    async function excluirItem(empresa: EmpresasProps){
        const itemEmpresa = empresa;
        const docRef = doc(db, "Empresas", itemEmpresa.id)
        await deleteDoc(docRef).then(() => {
            toast.success("Registro excluido com sucesso.");
            loadEmpresas();
        }).catch(() => {
            toast.error("Ocorreu um erro, tente novamente.");
        });
    };

    return(
        <Container>
          <div className="w-full">
            <div className="flex-col">

                <section className="bg-white p-2 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
                      <input
                        className="w-full border-2 rounded-lg h-9 px-3 outline-none"
                        placeholder="Digite o nome da empresa..."
                        value={input}
                        onChange={ (e) => setInput(e.target.value) }
                      />

                      <button
                        className="bg-blue-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
                        onClick={handleSearchEmpresa}
                      >
                      <ImSearch size='20'/>
                      </button>
                </section>
                
                <main className="grid gird-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1">
                  {empresas && empresas.length ? (
                      <div className="overflow-x-auto">
                      <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded" onClick={() => novoCadastro()}><FiPlusCircle size="20" /></button>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              Nome
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              Documento
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              Tipo de Documento
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              Responsável
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              E-mail
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              Telefone
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              Situação
                            </th>
                          </tr>
                        </thead>
                        
                        <tbody className="bg-white divide-y divide-gray-200">
                          {empresas.map((empresa, index) => {
                            const corFundo = index % 2 === 0 ? 'bg-blue-100' : 'bg-green-100';
                              return (
                                  <tr className={corFundo} key={empresa.id}>
                                      <td className="px-6 py-4 whitespace-no-wrap">{empresa.nome}</td>
                                      <td className="px-6 py-4 whitespace-no-wrap">{empresa.documento}</td>
                                      <td className="px-6 py-4 whitespace-no-wrap">{empresa.tipoDocumento === "1" ? 
                                        "CPF" : "CNPJ"}</td>
                                      <td className="px-6 py-4 whitespace-no-wrap">{empresa.responsavel}</td>
                                      <td className="px-6 py-4 whitespace-no-wrap">{empresa.email}</td>
                                      <td className="px-6 py-4 whitespace-no-wrap">{empresa.telefone}</td>
                                      <td className="px-6 py-4 whitespace-no-wrap">{empresa.situacao ? "Ativo" : "Inativo"}</td>
                                      <td className="px-6 py-4 whitespace-no-wrap text-right">
                                        <div className="space-x-1">
                                          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded" onClick={() => editarItem(empresa.id.toString())}><FiEdit2 size="20" />
                                          </button>
                                          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded" onClick={() => excluirItem(empresa)}><FiTrash2 size="20" />
                                          </button>
                                        </div>
                                    </td>
                                  </tr>
                              );
                          })}
                        </tbody> 
                      </table>
                    </div>
                  ) : 
                  <div className="flex flex-col items-center justify-center">
                    <p className="font-medium">Ops, empresas não encontradas...</p>
                        <Link 
                            to="/cadastro/empresa"
                            className="bg-blue-500 hover:bg-blue-400 my-3 p-1 px-3 text-white font-medium rounded"
                        >
                            Cadastrar uma nova empresa
                        </Link>
                  </div>
                  }
                </main>
              </div>
            </div>
        </Container>
    )
}
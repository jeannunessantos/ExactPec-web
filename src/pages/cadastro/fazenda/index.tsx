import { Container } from "../../../components/container";
import { FiEdit2, FiTrash2, FiPlusCircle } from "react-icons/fi";
import { ImSearch } from "react-icons/im";
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { collection, getDocs, query, doc, deleteDoc, where } from 'firebase/firestore'
import { db } from '../../../services/firebaseConnection'
import toast from "react-hot-toast";

export function PesquisarFazenda(){
    const navigate = useNavigate();
    const [fazendas, setFazendas] = useState<FazendasProps[]>([])
    const [input, setInput] = useState("")

    interface FazendasProps{
        id: string,
        nome: string,
        tipoDeControleDaFazenda: string,
        situacao: number,
        dataCadastro: string,
    }

    useEffect(() => {
        loadFazendas();
    }, [])

    function loadFazendas(){
        const animaisRef = collection(db, "Fazendas")
        const queryRef = query(animaisRef)
        getDocs(queryRef)
        .then((snapshot) => {
        let listFazendas = [] as FazendasProps[];

        snapshot.forEach( doc => {
            listFazendas.push({
                id: doc.id,
                nome: doc.data().nome,
                situacao: doc.data().situacao,
                tipoDeControleDaFazenda: doc.data().tipoDeControleDaFazenda,
                dataCadastro: doc.data().dataCadastro
            })
        })
        setFazendas(listFazendas);  
        })
    }

    async function handleSearchFazenda(){
        if(input === ''){
            loadFazendas();
          return;
        }

        setFazendas([])
        const q = query(collection(db, 'Fazendas'), 
        where("nome", ">=", input),
        where("nome", "<=", input + "\uf8ff")
        )

        const querySnapshot = await getDocs(q)
        let listFazendas = [] as FazendasProps[];

        querySnapshot.forEach(doc => {
            listFazendas.push({
                id: doc.id,
                nome: doc.data().nome,
                situacao: doc.data().situacao,
                tipoDeControleDaFazenda: doc.data().tipoDeControleDaFazenda,
                dataCadastro:doc.data().dataCadastro
            })
        });

        setFazendas(listFazendas);
    }

    function novoCadastro(){
        navigate(`/cadastro/fazenda`);
    };

    function editarItem(id: string){
        navigate(`/cadastro/fazenda/${id}`);
    };

    async function excluirItem(fazenda: FazendasProps){
        const itemFazenda = fazenda;
        const docRef = doc(db, "Fazendas", itemFazenda.id)
        await deleteDoc(docRef).then(() => {
            toast.success("Registro excluido com sucesso.");
            loadFazendas();
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
                        placeholder="Digite o nome da fazenda..."
                        value={input}
                        onChange={ (e) => setInput(e.target.value) }
                      />

                      <button
                        className="bg-blue-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
                        onClick={handleSearchFazenda}
                      >
                      <ImSearch size='20'/>
                      </button>
                </section>
                
                <main className="grid gird-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1">
                  {fazendas && fazendas.length ? (
                      <div className="overflow-x-auto">
                      <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded" onClick={() => novoCadastro()}><FiPlusCircle size="20" /></button>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              Nome
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              Tipo controle
                            </th>
                            
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              Situação
                            </th>
                          </tr>
                        </thead>
                        
                        <tbody className="bg-white divide-y divide-gray-200">
                          {fazendas.map((fazenda, index) => {
                            const corFundo = index % 2 === 0 ? 'bg-blue-100' : 'bg-green-100';
                              return (
                                  <tr className={corFundo} key={fazenda.id}>
                                      <td className="px-6 py-4 whitespace-no-wrap">{fazenda.nome}</td>
                                      <td className="px-6 py-4 whitespace-no-wrap">{fazenda.tipoDeControleDaFazenda === "1" ? 
                                        "Brinco/Número" : fazenda.tipoDeControleDaFazenda === "2" ? 
                                        "Brinco" : "Número"}</td>
                                      <td className="px-6 py-4 whitespace-no-wrap">{fazenda.situacao ? "Ativo" : "Inativo"}</td>
                                      <td className="px-6 py-4 whitespace-no-wrap text-right">
                                        <div className="space-x-1">
                                          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded" onClick={() => editarItem(fazenda.id.toString())}><FiEdit2 size="20" />
                                          </button>
                                          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded" onClick={() => excluirItem(fazenda)}><FiTrash2 size="20" />
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
                    <p className="font-medium">Ops, fazendas não encontradas...</p>
                        <Link 
                            to="/cadastro/fazenda"
                            className="bg-blue-500 hover:bg-blue-400 my-3 p-1 px-3 text-white font-medium rounded"
                        >
                            Cadastrar uma nova fazenda
                        </Link>
                  </div>
                  }
                </main>
              </div>
            </div>
        </Container>
    )
}
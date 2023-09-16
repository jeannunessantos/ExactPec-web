import { Container } from "../../../components/container";
import { FiEdit2, FiTrash2, FiPlusCircle } from "react-icons/fi";
import { ImSearch } from "react-icons/im";
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { collection, getDocs, query, doc, deleteDoc, where } from 'firebase/firestore'
import { db } from '../../../services/firebaseConnection'
import toast from "react-hot-toast";

export function PesquisarLote(){
    interface LotesProps{
        id: string,
        nome: string,
        confinamento: string,
        aptidao: string,
        finalidade:string,
        sistemaDeCriacao:string,
        observacao: string,
        dataCriacao: Date,
        situacao: number,
        
    }

    const [input, setInput] = useState("")
    const [Lotes, setLotes] = useState<LotesProps[]>([])
    const navigate = useNavigate();

    useEffect(() => {
        loadLotes();
    }, [])

    async function handleSearchLote(){
        if(input === ''){
            loadLotes();
          return;
        }

        setLotes([])
        const q = query(collection(db, 'Lotes'), 
        where("nome", ">=", input),
        where("nome", "<=", input + "\uf8ff")
        )

        const querySnapshot = await getDocs(q)
        let listLotes = [] as LotesProps[];

        querySnapshot.forEach(doc => {
            listLotes.push({
                id: doc.id,
                nome: doc.data().nome,
                confinamento: doc.data().confinamento,
                aptidao: doc.data().aptidao,
                finalidade: doc.data().finalidade,
                sistemaDeCriacao: doc.data().sistemaDeCriacao,
                observacao: doc.data().observacao,
                situacao: doc.data().situacao,
                dataCriacao: doc.data().dataCriacao
            })
        });

        setLotes(listLotes);
    }

    function loadLotes(){
        const LotesRef = collection(db, "Lotes")
        const queryRef = query(LotesRef)
        getDocs(queryRef)
        .then((snapshot) => {
        let listLotes = [] as LotesProps[];

        snapshot.forEach( doc => {
            listLotes.push({
                id: doc.id,
                nome: doc.data().nome,
                confinamento: doc.data().confinamento,
                aptidao: doc.data().aptidao,
                finalidade: doc.data().finalidade,
                sistemaDeCriacao: doc.data().sistemaDeCriacao,
                observacao: doc.data().observacao,
                situacao: doc.data().situacao,
                dataCriacao: doc.data().dataCriacao
            })
        })
        setLotes(listLotes);  
        })
    }

    function novoCadastro(){
        navigate(`/cadastro/Lote`);
    };

    function editarItem(id: string){
        navigate(`/cadastro/Lote/${id}`);
    };

    async function excluirItem(Lote: LotesProps){
        const itemLote = Lote;
        const docRef = doc(db, "Lotes", itemLote.id)
        await deleteDoc(docRef).then(() => {
            toast.success("Registro excluido com sucesso.");
            loadLotes();
        }).catch(() => {
            toast.error("Ocorreu um erro, tente novamente.");
        });
    };

    function formatarDataString(dataString:string) {
        const data = new Date(dataString);
        return data.toLocaleDateString();
    }
    return(
        <Container>
          <div className="w-full">
            <div className="flex-col">

                <section className="bg-white p-2 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
                      <input
                        className="w-full border-2 rounded-lg h-9 px-3 outline-none"
                        placeholder="Digite o nome da raça..."
                        value={input}
                        onChange={ (e) => setInput(e.target.value) }
                      />

                      <button
                        className="bg-blue-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
                        onClick={handleSearchLote}
                      >
                      <ImSearch size='20'/>
                      </button>
                </section>
                
                <main className="grid gird-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1">
                  {Lotes && Lotes.length ? (
                      <div className="overflow-x-auto">
                      <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded" onClick={() => novoCadastro()}><FiPlusCircle size="20" /></button>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              Nome
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              Confinamento
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              Aptidão
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              Finalidade
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              Sistema de criação
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              Situação
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              Data de criação
                            </th>
                          </tr>
                        </thead>
                        
                        <tbody className="bg-white divide-y divide-gray-200">
                          {Lotes.map((Lote, index) => {
                            const corFundo = index % 2 === 0 ? 'bg-blue-100' : 'bg-green-100';
                              return (
                                  <tr className={corFundo} key={Lote.id}>
                                      <td className="px-6 py-4 whitespace-no-wrap">{Lote.nome}</td>
                                      <td className="px-6 py-4 whitespace-no-wrap">{Lote.confinamento}</td>
                                      <td className="px-6 py-4 whitespace-no-wrap">{Lote.aptidao}</td>
                                      <td className="px-6 py-4 whitespace-no-wrap">{Lote.finalidade}</td>
                                      <td className="px-6 py-4 whitespace-no-wrap">{Lote.sistemaDeCriacao}</td>
                                      <td className="px-6 py-4 whitespace-no-wrap">{Lote.situacao ? "Ativo" : "Inativo"}</td>
                                      <td className="px-6 py-4 whitespace-no-wrap">{formatarDataString(Lote.dataCriacao.toString())}</td>
                                      <td className="px-6 py-4 whitespace-no-wrap text-right">
                                        <div className="space-x-1">
                                          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded" onClick={() => editarItem(Lote.id.toString())}><FiEdit2 size="20" />
                                          </button>
                                          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded" onClick={() => excluirItem(Lote)}><FiTrash2 size="20" />
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
                    <p className="font-medium">Ops, raças não encontradas...</p>
                        <Link 
                            to="/cadastro/Lote"
                            className="bg-blue-500 hover:bg-blue-400 my-3 p-1 px-3 text-white font-medium rounded"
                        >
                            Cadastrar uma nova raça
                        </Link>
                  </div>
                  }
                </main>
              </div>
            </div>
        </Container>
    )
}
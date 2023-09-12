import { Container } from "../../../components/container";
import { FiEdit2, FiTrash2, FiFileText, FiPlusCircle } from "react-icons/fi";
import { ImSearch } from "react-icons/im";
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { collection, getDocs, query, doc, deleteDoc, orderBy, where } from 'firebase/firestore'
import { db, storage } from '../../../services/firebaseConnection'
import { ref, deleteObject } from 'firebase/storage'

interface AnimaisProps{
    id: string,
    nome: string,
    numero: number,
    anoNascimento: string,
    sexo: number,
    origem: string,
    composicao: string,
    puroDeOrigemrigem: number,
    pesoAoNascer: number,
    sisBov: string,
    pesoDoDesmame: number,
    rgn: string,
    pelagem: string,
    observacao: string,
    userCadastro: string,
    userId: number,
    dataCadastro: Date,
    images: AnimalImageProps[];
  }
  
  interface AnimalImageProps{
    name: string;
    uid: string;
    url: string;
  }

export function PesquisarAnimais(){
    const navigate = useNavigate();
    const [animais, setAnimais] = useState<AnimaisProps[]>([])
    const [input, setInput] = useState("")

    useEffect(() => {
        loadAnimais();
    }, [])

    function loadAnimais(){
        const animaisRef = collection(db, "Animais")
        const queryRef = query(animaisRef)
        getDocs(queryRef)
        .then((snapshot) => {
        let listAnimais = [] as AnimaisProps[];

        snapshot.forEach( doc => {
            listAnimais.push({
                id: doc.id,
                nome: doc.data().nome,
                numero: doc.data().numero,
                anoNascimento: doc.data().anoNascimento,
                sexo: doc.data().sexo,
                origem: doc.data().origem,
                composicao: doc.data().composicao,
                puroDeOrigemrigem: doc.data().puroDeOrigemrigem,
                pesoAoNascer: doc.data().pesoAoNascer,
                sisBov: doc.data().sisBov,
                pesoDoDesmame: doc.data().pesoDoDesmame,
                rgn: doc.data().rgn,
                pelagem: doc.data().pelagem,
                observacao: doc.data().observacao,
                userCadastro: doc.data().userId,
                userId: doc.data().userId,
                dataCadastro: new Date(),
                images: doc.data().images
            })
        })
        setAnimais(listAnimais);  
        })
    }

    async function handleSearchAnimal(){
        if(input === ''){
            loadAnimais();
          return;
        }
        setAnimais([])
        const q = query(collection(db, 'Animais'), 
        where("nome", ">=", input),
        where("nome", "<=", input + "\uf8ff")// \uf8ff  caractera para marcar o final da consulta e garantir todos os caracteres na consulta.
        )

        const querySnapshot = await getDocs(q)
        let listAnimais = [] as AnimaisProps[];

        querySnapshot.forEach(doc => {
            listAnimais.push({
                id: doc.id,
                nome: doc.data().nome,
                numero: doc.data().numero,
                anoNascimento: doc.data().anoNascimento,
                sexo: doc.data().sexo,
                origem: doc.data().origem,
                composicao: doc.data().composicao,
                puroDeOrigemrigem: doc.data().puroDeOrigemrigem,
                pesoAoNascer: doc.data().pesoAoNascer,
                sisBov: doc.data().sisBov,
                pesoDoDesmame: doc.data().pesoDoDesmame,
                rgn: doc.data().rgn,
                pelagem: doc.data().pelagem,
                observacao: doc.data().observacao,
                userCadastro: doc.data().userId,
                userId: doc.data().userId,
                dataCadastro: new Date(),
                images: doc.data().images
            })
        })

        setAnimais(listAnimais);
    }

    function handledetalhesAnimal(id:string){
        navigate(`/detalhe/animal/${id}`);
    }

    function editarItem(id: string){
      navigate(`/cadastro/animal/${id}`);
    };
    
    function novoCadastro(){
      navigate(`/cadastro/animal`);
    };
    
    async function excluirItem(animal: AnimaisProps){
        const itemAnimal = animal;
        const docRef = doc(db, "Animais", itemAnimal.id)
        await deleteDoc(docRef);
    
        itemAnimal.images.map( async (image) => {
            const imagePath = `images/${image.uid}/${image.name}`
            const imageRef = ref(storage, imagePath)

            try{
                await deleteObject(imageRef)
                setAnimais(animais.filter(animal => animal.id !== itemAnimal.id))
            }catch(err){
                console.log("ERRO AO EXCLUIR ESSA IMAGEM")
            }
        })
    };

    return(
        <Container>
          <div className="w-full">
            <div className="flex-col">

                <section className="bg-white p-2 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
                      <input
                        className="w-full border-2 rounded-lg h-9 px-3 outline-none"
                        placeholder="Digite o nome do animal..."
                        value={input}
                        onChange={ (e) => setInput(e.target.value) }
                      />

                      <button
                        className="bg-blue-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
                        onClick={handleSearchAnimal}
                      >
                      <ImSearch size='20'/>
                      </button>
                </section>
                
                <main className="grid gird-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1">
                  {animais && animais.length ? (
                      <div className="overflow-x-auto">
                      <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded" onClick={() => novoCadastro()}><FiPlusCircle size="20" /></button>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              Nome
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              Numero
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              RGN
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              SIS BOV
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              Sexo
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              Puro de origem
                            </th>
                          </tr>
                        </thead>
                        
                        <tbody className="bg-white divide-y divide-gray-200">
                          {animais.map((animal, index) => {
                            const corFundo = index % 2 === 0 ? 'bg-blue-100' : 'bg-green-100';
                              return (
                                  <tr className={corFundo} key={animal.id}>
                                      <td className="px-6 py-4 whitespace-no-wrap">{animal.nome}</td>
                                      <td className="px-6 py-4 whitespace-no-wrap">{animal.numero}</td>
                                      <td className="px-6 py-4 whitespace-no-wrap">{animal.rgn}</td>
                                      <td className="px-6 py-4 whitespace-no-wrap">{animal.sisBov}</td>
                                      <td className="px-6 py-4 whitespace-no-wrap">{animal.sexo ? "Macho" : "Fêmia"}</td>
                                      <td className="px-6 py-4 whitespace-no-wrap text-center">{animal.puroDeOrigemrigem ? "Sim" : "Não"}</td>
                                      <td className="px-6 py-4 whitespace-no-wrap text-right">
                                        <div className="space-x-1">
                                          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded" onClick={() => editarItem(animal.id.toString())}><FiEdit2 size="20" />
                                          </button>
                                          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded" onClick={() => excluirItem(animal)}><FiTrash2 size="20" />
                                          </button>
                                          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded" onClick={() => handledetalhesAnimal(animal.id)}><FiFileText size="20" />
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
                    <p className="font-medium">Ops, animais não encontrados...</p>
                        <Link 
                            to="/cadastro/animal"
                            className="bg-blue-500 hover:bg-blue-400 my-3 p-1 px-3 text-white font-medium rounded"
                        >
                            Cadastrar animal
                        </Link>
                  </div>
                  }
                </main>
              </div>
            </div>
        </Container>
    )
}
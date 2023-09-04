import { Container } from "../../../components/container";
import { FiEdit2, FiTrash2, FiImage } from "react-icons/fi";
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { collection, getDocs, query, doc, deleteDoc, orderBy, where } from 'firebase/firestore'
import { db, storage } from '../../../services/firebaseConnection'
import { ref, deleteObject } from 'firebase/storage'
import ModalImagem from './../../../components/modal/Imagem'

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
    const [animais, setAnimais] = useState<AnimaisProps[]>([])
    const [isExibeImagemAnimal, setIsExibeImagemAnimal] = useState(false);
    const [input, setInput] = useState("")

    useEffect(() => {
        loadAnimais();
    }, [])

    function loadAnimais(){
        const animaisRef = collection(db, "Animais")
        const queryRef = query(animaisRef, orderBy("dataCadastro", "desc"))
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

    async function handleSearchCar(){
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

    function handleImageAnimal(isOpen: boolean) {
        setIsExibeImagemAnimal(isOpen);
    }

    function onClose(){
        setIsExibeImagemAnimal(false);
    }

    function editarItem(id: string){
        // Lógica para editar o item
        console.log(`Editar item: ${id}`);
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
                setAnimais(animais.filter(animal => animal.userId !== itemAnimal.userId))
            }catch(err){
                console.log("ERRO AO EXCLUIR ESSA IMAGEM")
            }
        })
    };

    return(
        <Container>
 <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input
          className="w-full border-2 rounded-lg h-9 px-3 outline-none"
          placeholder="Digite o nome do animal..."
          value={input}
          onChange={ (e) => setInput(e.target.value) }
        />
        <button
          className="bg-blue-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
          onClick={handleSearchCar}
        >
          Buscar
        </button>
      </section>

            <main className="grid gird-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1">
            {animais && animais.length ? (
                <div className="w-full max-w-screen-lg mx-auto mt-8 flex">
                    <div className="bg-gray-200 p-4">
                        <div className="grid grid-cols-5 gap-2">
                        <>
                                <div className="col-span-1">
                                <div className="font-bold">Nome</div>
                                </div>
                                <div className="col-span-1">
                                    <div className="font-bold">Ano de Nascimento</div>
                                </div>
                                <div className="col-span-1">
                                    <div className="font-bold">Peso Nasc</div>
                                </div>
                                <div className="col-span-1">
                                    <div className="font-bold">Peso desmame</div>
                                </div>
                                <div className="col-span-1">
                                    <div className="font-bold"></div>
                                </div>   
                            {animais.map((animal) => (
                                <section key={animal.id} className="col-span-6 grid grid-cols-5 gap-2">
                                    <div  className="col-span-6 grid grid-cols-5 gap-2"> {/* Criei uma sub-grid para organizar os elementos da linha */}
                                        <div className="col-span-1">
                                            <div className="bg-white p-2 border rounded shadow">{animal.nome}</div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="bg-white p-2 border rounded shadow">{animal.anoNascimento}</div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="bg-white p-2 border rounded shadow">{animal.pesoAoNascer}</div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="bg-white p-2 border rounded shadow">{animal.pesoDoDesmame}</div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="flex space-x-2">
                                                <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded" onClick={() => editarItem(animal.id.toString())}><FiEdit2 size="25"/></button>
                                                <button className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded" onClick={() => excluirItem(animal)}><FiTrash2 size="25"/></button>
                                                <button className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded">
                                                    <FiImage size={24} color="#000" onClick={() => handleImageAnimal(true)} />
                                                    <ModalImagem isOpen={isExibeImagemAnimal} onClose={onClose} imageUrl={animal.images[0].url} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            ))}

                                </>    
                        </div>
                    </div>
                </div>
            ) : <div className="flex flex-col items-center justify-center">
                    <p className="font-medium">Ops, animais não encontrados...</p>
                        <Link 
                            to="/cadastro/animal"
                            className="bg-slate-600 my-3 p-1 px-3 text-white font-medium rounded"
                        >
                            Cadastrar animal
                        </Link>
                    </div>
        }
            </main>
        </Container>
    )
}
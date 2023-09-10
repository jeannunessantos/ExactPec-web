import {useEffect, useState} from 'react'
import {Container} from '../../../../components/container'
import {useParams} from 'react-router-dom'
import {getDoc, doc} from 'firebase/firestore'
import {db} from '../../../../services/firebaseConnection'
import { Link } from 'react-router-dom'

interface AnimalImageProps{
    uid:string,
    name:string,
    previewUrl:string,
    url:string
}

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

export function DetalheAnimais(){

const {id} = useParams();
const [animal, setAnimal] = useState<AnimaisProps>();

useEffect(() => {
    async function loadAnimal(){
        if(!id){return}

        const docRef = doc(db, "Animais", id);
        getDoc(docRef)
        .then((snapshot) => {
            setAnimal({
                id: snapshot.id,
                nome: snapshot.data()?.nome,
                numero: snapshot.data()?.numero,
                anoNascimento: snapshot.data()?.anoNascimento,
                sexo: snapshot.data()?.sexo,
                origem: snapshot.data()?.origem,
                composicao: snapshot.data()?.composicao,
                puroDeOrigemrigem: snapshot.data()?.puroDeOrigemrigem,
                pesoAoNascer: snapshot.data()?.pesoAoNascer,
                sisBov: snapshot.data()?.sisBov,
                pesoDoDesmame: snapshot.data()?.pesoDoDesmame,
                rgn: snapshot.data()?.rgn,
                pelagem: snapshot.data()?.pelagem,
                observacao: snapshot.data()?.observacao,
                userCadastro: snapshot.data()?.userId,
                userId: snapshot.data()?.userId,
                dataCadastro: new Date(),
                images: snapshot.data()?.images
            });
        })
    }
    loadAnimal()
    console.log(animal)
},[id])

function formatarDataString(dataString:string) {
    const data = new Date(dataString);
    return data.toLocaleDateString();
}

    return(
        <Container>
            <div className="flex flex-col items-center justify-center">
                        <Link 
                            to="/pesquisa/animal"
                            className="bg-slate-600 my-3 p-1 px-3 text-white font-medium rounded"
                        >
                            Voltar
                        </Link>
                    </div>
            {animal && (
                <main className='w-full bg-white rounded-lg p-3 my-2'>
                    <div className='flex flex-col sm:flex-row mb-2 items-center justify-between'>
                        <h1 className='font-bold text-2xl text-black'>{animal?.nome != undefined ? animal?.nome : animal?.numero}</h1>
                        <h1 className='font-bold text-2xl text-black'>Numero: {animal?.numero}</h1>
                        <h1 className='font-bold text-2xl text-black'>Data de cadastro: {formatarDataString(animal.dataCadastro.toString())}</h1>
                    </div>
                <div className='w-full flex flex-col sm:flex-row mb-2 items-center justify-between '>
                    <div className='flex-col'>
                        <div className='w-auto'>
                            <div className='flex w-full gap-6 my-3 '>
                                <div className='flex gap-6'>
                                    <div>
                                        <p>Ano de nasc: <strong>{formatarDataString(animal.anoNascimento)}</strong></p>
                                    </div>
                                    <div>
                                        <p>Sexo: <strong>{animal.sexo ? "Macho" : "Fêmea"}</strong></p>
                                    </div>
                                </div>
                                <div className='flex gap-6'>
                                    <div>
                                        <p>Origem: <strong>{animal.origem}</strong></p>
                                    </div>
                                </div>
                            </div>
                            <hr/>
                            <div className='flex w-full gap-6 my-3'>
                                <div className='flex gap-6'>
                                    <div>
                                        <p>Peso no nasc: <strong>{animal.pesoAoNascer}</strong></p>
                                    </div>
                                    <div>
                                        <p>Peso no desmame: <strong>{animal.pesoDoDesmame}</strong></p>
                                    </div>
                                </div>
                                <div className='flex gap-6'> 
                                    <div>
                                        <p>RGN: <strong>{animal.rgn}</strong></p>
                                    </div>
                                </div>
                            </div>
                            <hr/>
                            <div className='flex w-full gap-6 my-3'>
                                <div className='flex gap-6'>
                                    <div>
                                        <p>Puro de origem: <strong>{animal.puroDeOrigemrigem ? "Sim" : "Não"}</strong></p>
                                    </div>
                                </div>
                                <div className='flex gap-6'>
                                    <div>
                                        <p>Pelagem: <strong>{animal.pelagem}</strong></p>
                                    </div>
                                    <div>
                                        <p>SISBOV: <strong>{animal.sisBov}</strong></p>
                                    </div>
                                </div>
                            </div>

                            <hr/>
                                <div className='flex w-full gap-6 my-3'>
                                    <div className='flex gap-6'>
                                        <div>
                                            <p>Composicao: <strong>{animal.composicao}</strong></p>
                                        </div>
                                        <div>
                                            <p>Observação: <strong>{animal.observacao}</strong></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className='lg:w-7/12 sm: w-full'>
                            <div>
                                <img
                                src={animal.images[0].url}
                                alt="Imagem"
                                className="lg:w-9/12 h-1/2 ml-auto sm: w-full" // Classes para definir largura e altura como 50%
                                />
                            </div>
                        </div>
                    </div>
                </main>
            )}
        </Container>
    )
}
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

function formatarDataParaString(data:Date){
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
  
    return `${dia}/${mes}/${ano}`;
}
    return(
        <Container>
            <div className="flex flex-col items-center justify-center">
                    <h1 className="font-sans">Detalhes do animal</h1>
                        <Link 
                            to="/pesquisa/animal"
                            className="bg-slate-600 my-3 p-1 px-3 text-white font-medium rounded"
                        >
                            Voltar
                        </Link>
                    </div>
            {animal && (
                <main className='w-full bg-white rounded-lg p-6 my-4'>
                    <div className='flex flex-col sm:flex-row mb-4 items-center justify-between'>
                        <h1 className='font-bold text-3xl text-black'>{animal?.nome != undefined ? animal?.nome : animal?.numero}</h1>
                        <h1 className='font-bold text-3xl text-black'>Numero: {animal?.numero}</h1>
                        <h1 className='font-bold text-3xl text-black'>Data de cadastro: {formatarDataParaString(animal?.dataCadastro)}</h1>
                    </div>
                    <div className='flex w-full gap-6 my-4'>
                        <div className='flex flex-col gap-4'>
                            <div>
                                <p>Ano de nascimento:</p>
                                <strong>{animal.anoNascimento}</strong>
                            </div>
                            <div>
                                <p>Sexo:</p>
                                <strong>{animal.sexo ? "Macho" : "Fêmea"}</strong>
                            </div>
                        </div>
                        <div className='flex flex-col gap-4'>
                            <div>
                                <p>Origem:</p>
                                <strong>{animal.origem}</strong>
                            </div>
                            <div>
                                <p>Composicao:</p>
                                <strong>{animal.composicao}</strong>
                            </div>
                        </div>
                    </div>

                    <div className='flex w-full gap-6 my-4'>
                        <div className='flex flex-col gap-4'>
                            <div>
                                <p>Puro de origem:</p>
                                <strong>{animal.puroDeOrigemrigem ? "Sim" : "Não"}</strong>
                            </div>
                        </div>
                        <div className='flex flex-col gap-4'>
                            
                            <div>
                                <p>Pelagem:</p>
                                <strong>{animal.pelagem}</strong>
                            </div>
                        </div>
                    </div>

                <div className='flex w-full gap-6 my-4'>
                    <div className='flex flex-col gap-4'>
                            <div>
                                <p>Peso no nascimento:</p>
                                <strong>{animal.pesoAoNascer}</strong>
                            </div>
                            <div>
                                <p>RGN:</p>
                                <strong>{animal.rgn}</strong>
                            </div>
                         </div>
                        <div className='flex flex-col gap-4'> 
                            <div>
                                <p>Peso no desmame:</p>
                                <strong>{animal.pesoDoDesmame}</strong>
                            </div>
                            <div>
                                <p>SISBOV:</p>
                                <strong>{animal.sisBov}</strong>
                            </div>
                        </div>
                    </div>
                    
                    <div className='flex w-full gap-6 my-4'>
                        <div className='flex flex-col gap-4'>
                            <div>
                                    <p>Observação:</p>
                                    <strong>{animal.observacao}</strong>
                            </div>
                        </div>
                    </div>
                </main>
            )}
        </Container>
    )
}
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { FiUpload, FiTrash } from "react-icons/fi";
import { Container } from "../../../../components/container";
import { DashboardHeader } from "../../../../components/painelHeader";
import { useForm } from 'react-hook-form'
import { Input } from '../../../../components/input'
import { z } from 'zod'
import {toast} from 'react-hot-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import {AuthContext} from '../../../../contexts/AuthContext'
import {v4 as uuidV4} from 'uuid'

import {useParams} from 'react-router-dom'

 import {storage,db} from '../../../../services/firebaseConnection'
 import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
 } from 'firebase/storage'
import {addDoc, collection, getDoc, doc, updateDoc} from 'firebase/firestore'


const schema = z.object({
    nome: z.string().nonempty("O campo nome é obrigatório"),
    numero: z.string().min(1, "O campo número é obrigatório"), 
    anoNascimento: z.string().nonempty("O campo ano de nascimento é obrigatório"), 
    sexo: z.string().nullable().refine((sexo) => {
        return ['0', '1'].includes(sexo == null ? "" : sexo.toLowerCase());
    }, {
       message: 'O campo sexo é obrigatório.'
    }),
    origem: z.string().nonempty("O campo origem é obrigatório"), 
    composicao: z.string().nonempty("O campo composição é obrigatório"), 
    puroDeOrigemrigem: z.string().nullable().refine((puroDeOrigemrigem) => {
        return ['0', '1'].includes(puroDeOrigemrigem == null ? "" : puroDeOrigemrigem.toLowerCase());
    }, {
       message: 'O campo puro de origem é obrigatório'
    }),
    pesoAoNascer: z.string().nonempty("O campo peso ao nascer é obrigatório"), 
    sisBov: z.string().nonempty("O campo SIS BOV é obrigatório"), 
    pesoDoDesmame: z.string().nonempty("O campo peso do desmame é obrigatório"), 
    rgn: z.string().min(1,"O campo RGN é obrigatório"),
    pelagem: z.string().nonempty("O campo pelagem é obrigatório"),
    observacao: z.string().nonempty("O campo observação é obrigatório") 
    
})

type FormData = z.infer<typeof schema>;
interface ImageItemProps{
    uid:string,
    name:string,
    previewUrl:string,
    url:string
}


export function CadastroAnimais(){
    const {id} = useParams();
    const {user} =  useContext(AuthContext)
    const {register, handleSubmit, setValue, formState: {errors}, reset} = useForm<FormData>({
        resolver:zodResolver(schema),
        mode:"onChange"
    })
    
    useEffect(() => {
        if(!id){return}

        const docRef = doc(db, "Animais", id);
        getDoc(docRef)
        .then((snapshot) => {
                setValue("nome", snapshot.data()?.nome);
                setValue("numero",snapshot.data()?.numero);
                setValue("anoNascimento", snapshot.data()?.anoNascimento);
                setValue("sexo", snapshot.data()?.sexo);
                setValue("origem", snapshot.data()?.origem);
                setValue("composicao", snapshot.data()?.composicao);
                setValue("puroDeOrigemrigem", snapshot.data()?.puroDeOrigemrigem);
                setValue("pesoAoNascer", snapshot.data()?.pesoAoNascer);
                setValue("sisBov", snapshot.data()?.sisBov);
                setValue("pesoDoDesmame", snapshot.data()?.pesoDoDesmame);
                setValue("rgn", snapshot.data()?.rgn);
                setValue("pelagem", snapshot.data()?.pelagem);
                setValue("observacao", snapshot.data()?.observacao);
        })
    }, [])

    const [animalImages, setAnimalImage] = useState<ImageItemProps[]>([]);
    const [sexo, setSexo] = useState('');
    const [puroDeOrigemrigem, setPuroDeOrigemrigem] = useState('');
    
    const handleSexoChange = (event: any) => {
        setSexo(event.target.value);
      };

      const handlePuroDeOrigemrigem = (event: any) => {
        setPuroDeOrigemrigem(event.target.value);
      };

    function onSubmit(data:FormData){
        if(id === null || id === undefined){
            incluir(data)
        }else{
            alterar(data);
        }
    }
    
    function incluir(data:any){
        if(animalImages.length == 0){
            toast.error("Envie alguma imagem deste animal");
            return;
        }

        const animalListImages = animalImages.map(animal => {
            return{
                uid: animal.uid,
                name: animal.name,
                url:animal.url
            }
        })

        data.images = animalListImages
        addDoc(collection(db,"Animais"), data)
        .then(() => {
            toast.success("Registro cadastrado com sucesso.");
            reset();
            setAnimalImage([]);
        }).catch(() => {
            toast.error("Ocorreu um erro, tente novamente.");
        })
    }

    async function alterar(data:any){
        if(!id)return

        const animalListImages = animalImages.map(animal => {
            return{
                uid: animal.uid,
                name: animal.name,
                url:animal.url
            }
        });

        data.images = animalListImages;

        const docRef = doc(db, "Animais", id);
        await updateDoc(docRef,data)
        .then(() => {
            toast.success("Registro atualizado com sucesso.");
            reset();
            setAnimalImage([]);
        }).catch(() => {
            toast.error("Ocorreu um erro, tente novamente.");
        })
    }

    async function handleFile(e:ChangeEvent<HTMLInputElement>){
        if(e.target.files && e.target.files[0]){
            const image = e.target.files[0]
            debugger;
            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                await handleUpload(image)
            }else{
                toast.error("Envie uma imagem jpeg ou png!")
            }
        }
    }

    async function handleUpload(image:File) {
        if(!user?.uid){
            return;
        }

        const currentUid = user?.uid;
        const uidImage = uuidV4();

        const uploadRef = ref(storage,`images/${currentUid}/${uidImage}`)

        uploadBytes(uploadRef, image)
        .then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                const imageItem = {
                    name: uidImage,
                    uid:currentUid,
                    previewUrl: URL.createObjectURL(image),
                    url: downloadURL
                }
                setAnimalImage((images) => [...images, imageItem])
            })
        })
    }


    async function handleDeleteImage(item: ImageItemProps){
        const imagePath = `images/${item.uid}/${item.name}`;
        const imageRef = ref(storage, imagePath);
        try {
            await deleteObject(imageRef);
            setAnimalImage(animalImages.filter((animal) => animal.url !== item.url));
        } catch (error) {
        }
    }

    return(
        <div>
            <Container>
                <DashboardHeader/>
                <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
                    <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
                        <div className="absolute cursor-pointer">
                            <FiUpload size={30} color="#000"/>
                        </div>
                        <div className="cursor-pointer">
                            <input 
                            type="file" 
                            accept="image/*" 
                            className="opacity-0 cursor-pointer" 
                            onChange={handleFile} />
                        </div>
                    </button>
                    {animalImages.map(item => (
                        <div key={item.name} className="h-32 flex items-center justify-center">
                            <button className="absolute" onClick={() => handleDeleteImage(item)}>
                                <FiTrash size={28} color="#FFF"/>
                            </button>
                            <img src={item.previewUrl}
                            className="rounded-lg w-full h-32 object-cover"
                            alt="Foto do animal"
                            />
                        </div>
                    ))}


                </div>
                <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
                    <form className="w-full" 
                        onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex w-full mb-3 flex-row items-center gap-4">
                            <div className="w-full">
                                <p className="mb-2 font-medium">Nome do animal</p>
                                <Input
                                type="text"
                                register={register}
                                name="nome"
                                error={errors.nome?.message}
                                placeholder="Informe o nome do animal"
                                />
                            </div>
                            <div className="w-full">
                                <p className="mb-2 font-medium">Número</p>
                                <Input
                                type="text"
                                register={register}
                                name="numero"
                                error={errors.numero?.message}
                                placeholder="Informe o número do animal"
                                />
                            </div>

                            <div className="w-full">
                                <p className="mb-2 font-medium">Ano de nasc.</p>
                                <Input
                                type="Date"
                                register={register}
                                name="anoNascimento"
                                error={errors.anoNascimento?.message}
                                placeholder="Informe o ano de nasc."
                                />
                            </div>
                        </div>

                        <div className="flex w-full mb-3 flex-row items-center gap-4">                            
                        <div className="w-full">
                                <p className="mb-2 font-medium">origem</p>
                                <Input
                                type="text"
                                register={register}
                                name="origem"
                                error={errors.origem?.message}
                                placeholder="Informe a origem"
                                />
                            </div>

                            <div className="w-full">
                                <p className="mb-2 font-medium">Peso do nascimento</p>
                                <Input
                                type="text"
                                register={register}
                                name="pesoAoNascer"
                                error={errors.pesoAoNascer?.message}
                                placeholder="Informe o peso do nascimento"
                                />
                            </div>
                            <div className="w-full">
                                <p className="mb-2 font-medium">SIS BOV</p>
                                <Input
                                type="text"
                                register={register}
                                name="sisBov"
                                error={errors.sisBov?.message}
                                placeholder="Informe o SIS BOV"
                                />
                            </div>
                        </div>

                        <div className="flex w-full mb-3 flex-row items-center gap-4">
                            <div className="w-full">
                                <p className="mb-2 font-medium">RGN</p>
                                <Input
                                type="text"
                                register={register}
                                name="rgn"
                                error={errors.rgn?.message}
                                placeholder="Informe o RGN"
                                />
                            </div>

                            <div className="w-full">
                                <p className="mb-2 font-medium">Pelagem</p>
                                <Input
                                type="text"
                                register={register}
                                name="pelagem"
                                error={errors.pelagem?.message}
                                placeholder="Informe a pelagem"
                                />
                            </div>
                            <div className="w-full">
                                <p className="mb-2 font-medium">Peso do desmame</p>
                                <Input
                                type="text"
                                register={register}
                                name="pesoDoDesmame"
                                error={errors.pesoDoDesmame?.message}
                                placeholder="Informe peso do desmame"
                                />
                            </div>

                        </div>
                        <div className="flex w-full mb-3 flex-row items-center gap-4">
                            <div className="w-full space-x-4">
                                <p className="font-medium">Sexo</p>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        {...register("sexo")}
                                        name="sexo"
                                        id="sexo1"
                                        value="0"
                                        checked={sexo === '0'}
                                        onChange={handleSexoChange}
                                    />
                                    <span className="ml-2">Macho</span>
                                </label>

                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        {...register("sexo")}
                                        name="sexo"
                                        id="sexo2"
                                        value="1"
                                        checked={sexo === '1'}
                                        onChange={handleSexoChange}
                                    />
                                    <span className="ml-2">Fêmea</span>
                                </label>
                                {errors.sexo && <p className="mb-1 text-red-500">{errors.sexo?.message}</p>} 
                            </div>


                            <div className="w-full space-x-4">
                                <p className="font-medium">Puro de origem</p>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        {...register("puroDeOrigemrigem")}
                                        name="puroDeOrigemrigem"
                                        id="puroDeOrigemrigem1"
                                        value="0"
                                        checked={puroDeOrigemrigem === '0'}
                                        onChange={handlePuroDeOrigemrigem}
                                    />
                                    <span className="ml-2">SIM</span>
                                </label>

                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        {...register("puroDeOrigemrigem")}
                                        name="puroDeOrigemrigem"
                                        id="puroDeOrigemrigem2"
                                        value="1"
                                        checked={puroDeOrigemrigem === '1'}
                                        onChange={handlePuroDeOrigemrigem}
                                    />
                                    <span className="ml-2">NÃO</span>
                                </label>
                                {errors.puroDeOrigemrigem && <p className="mb-1 text-red-500">{errors.puroDeOrigemrigem?.message}</p>} 
                            </div>

                            <div className="w-full">
                                <p className="mb-2 font-medium">Composição</p>
                                <Input
                                type="text"
                                register={register}
                                name="composicao"
                                error={errors.composicao?.message}
                                placeholder="Informe a composicao"
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <p className="mb-2 font-medium">Observação</p>
                            <textarea 
                                className="border-2 w-full rounded-md h-24 px-2"
                                {... register("observacao")}
                                name="observacao"
                                id="observacao"
                                placeholder="Digite a observação"
                            />
                           {errors.observacao && <p className="mb-1 text-red-500">{errors.observacao.message}</p>} 
                        </div>
                        <button type="submit" className="w-full flex-auto rounded-md bg-blue-500 text-white font-medium h-10">
                            Cadastrar
                        </button>
                    </form>
                </div>
            </Container>
        </div>
    )
}